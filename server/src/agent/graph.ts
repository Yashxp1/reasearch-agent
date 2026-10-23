import { END, START, StateGraph } from "@langchain/langgraph";
import { config } from "../config/env";
import { AgentState, AgentStateType } from "./state";
import { planNode } from "./nodes/plan";
import { searchNode } from "./nodes/search";
import { writeNode } from "./nodes/write";
import { verifyNode } from "./nodes/verify";
import { finalizeNode } from "./nodes/finalize";
import { reviseNode } from "./nodes/revise";

function afterVerify(state: AgentStateType): "revise" | "finalize" {
  const hasFailure = state.checks.some((c) => c.verdict !== "supported");

  return hasFailure && state.revisions < config.maxRevisions
    ? "revise"
    : "finalize";
}

const graph = new StateGraph(AgentState)
  .addNode("plan", planNode)
  .addNode("search", searchNode)
  .addNode("write", writeNode)
  .addNode("verify", verifyNode)
  .addNode("revise", reviseNode)
  .addNode("finalize", finalizeNode)
  .addEdge(START, "plan")
  .addEdge("plan", "search")
  .addEdge("search", "write")
  .addEdge("write", "verify")
  .addConditionalEdges("verify", afterVerify, {
    revise: "revise",
    finalize: "finalize",
  })
  .addEdge("revise", "verify")
  .addEdge("finalize", END)
  .compile();

export async function runResearch(question: string) {
  const final = await graph.invoke({
    question,
    queries: [],
    sources: [],
    claims: [],
    checks: [],
    removed: [],
    revisions: 0,
    answer: "",
  });

  const citedIDs = new Set(final.claims.flatMap((c) => c.sourceIds));

  return {
     question: final.question,
    answer: final.answer,
    claims: final.checks.map((c) => ({
      text: c.claim.text,
      sourceIds: c.claim.sourceIds,
      evidence: c.evidence,
    })),
    removedClaims: final.removed.map((c) => ({
      text: c.claim.text,
      verdict: c.verdict,
      reason: c.reason,
    })),
    sources: final.sources
      .filter((s) => citedIDs.has(s.id))
      .map(({ id, url, title }) => ({ id, url, title })),
    stats: {
      sourcesFetched: final.sources.length,
      claimsKept: final.claims.length,
      claimsRemoved: final.removed.length,
      revisions: final.revisions,
    },
  };
}