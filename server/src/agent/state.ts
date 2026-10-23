import { Annotation } from "@langchain/langgraph";
import type { Claim, ClaimCheck, Source } from "./types";

export const AgentState = Annotation.Root({
  question: Annotation<string>(),
  queries: Annotation<string[]>(),
  sources: Annotation<Source[]>(),
  claims: Annotation<Claim[]>(),
  checks: Annotation<ClaimCheck[]>(),
  removed: Annotation<ClaimCheck[]>(),
  revisions: Annotation<number>(),
  answer: Annotation<string>(),
});

export type AgentStateType = typeof AgentState.State;
