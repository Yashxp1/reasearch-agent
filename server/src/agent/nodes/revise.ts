import { llm } from "../llm";
import { cleanClaims, formatSources } from "../utils";
import { ClaimsSchema } from "./write";
import type { AgentStateType } from "../state";

const REVISER_PROMPT = `You revise a list of claims after fact-checking.

For each claim that failed the check, either:
- rewrite it so it matches exactly what the cited source says, or
- remove it if no source supports it.

Keep claims that passed unchanged. Do not add new facts. Use ONLY the provided sources and cite only IDs that exist.`;

export async function reviseNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const reviser = llm.withStructuredOutput(ClaimsSchema);

  const feedback = state.checks
    .map((c, i) => {
      const line = `${i + 1}. [${c.verdict.toUpperCase()}] ${c.claim.text} (cites ${c.claim.sourceIds.join(", ")})`;
      return c.verdict === "supported"
        ? line
        : `${line}\n   Problem: ${c.reason}`;
    })
    .join("\n");

  const result = await reviser.invoke([
    ["system", REVISER_PROMPT],
    [
      "human",
      `QUESTION: ${state.question}\n\nCURRENT CLAIMS AND CHECK RESULTS:\n${feedback}\n\nSOURCES:\n${formatSources(state.sources)}`,
    ],
  ]);

  return {
    claims: cleanClaims(result.claims, state.sources),
    revisions: state.revisions + 1,
  };
}
