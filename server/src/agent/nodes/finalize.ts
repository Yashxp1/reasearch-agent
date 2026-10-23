import type { AgentStateType } from "../state";

export async function finalizeNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const kept = state.checks.filter((c) => c.verdict === "supported");
  const removed = state.checks.filter((c) => c.verdict !== "supported");

  const answer =
    kept.length === 0
      ? "I couldn't find enough well-supported information in the sources to answer this question."
      : kept
          .map((c) => {
            const cites = c.claim.sourceIds.map((id) => `[${id}]`).join("");
            return `${c.claim.text} ${cites}`;
          })
          .join("\n\n");

  return {
    answer,
    claims: kept.map((c) => c.claim),
    checks: kept,
    removed,
  };
}
