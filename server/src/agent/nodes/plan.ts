import z from "zod";
import { AgentStateType } from "../state";
import { llm } from "../llm";

const PlanSchema = z.object({
  queries: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("Distinct web search queries"),
});

export async function planNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const planner = llm.withStructuredOutput(PlanSchema);

  const result = await planner.invoke([
    [
      "system",
      "You plan web research. Given a question, write 3 distinct, specific search queries that together cover it. Prefer wording that surfaces authoritative or primary sources (official docs, papers, government or company pages). Do not repeat the same query in different words.",
    ],
    ["human", state.question],
  ]);

  return {
    queries: result.queries,
  };
}
