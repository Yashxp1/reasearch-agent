import { z } from "zod";
import { llm } from "../llm";
import { formatSources, normalize } from "../utils";
import type { AgentStateType } from "../state";
import type { ClaimCheck, Source, Verdict } from "../types";

const CheckSchema = z.object({
  verdict: z.enum(["supported", "partial", "unsupported"]),
  quote: z
    .string()
    .describe(
      "One exact, contiguous quote (max 200 characters) copied from a cited source that supports the claim. Empty string if none.",
    ),
  reason: z.string().describe("One sentence explaining the verdict"),
});

const VERIFIER_PROMPT = `You are a strict fact-checker. You get ONE claim and the sources it cites.

Verdicts:
- "supported": a cited source directly states EVERY part of the claim. Every named technology, number, date, and qualifier in the claim must appear in the sources.
- "partial": the sources support only part of the claim, or the claim overstates, generalizes, reframes, or adds detail the sources do not give.
- "unsupported": the sources do not state the claim, or they contradict it.

Before answering, list each distinct fact in the claim and check each one against the sources. If any fact is missing, the verdict is "partial" at best.

You must copy one exact, contiguous quote from a cited source as evidence. Do not paraphrase the quote or join fragments with "...". If you cannot find such a quote, the verdict is "unsupported".
Judge only against the cited sources, never your own knowledge.`;

export async function verifyNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const checker = llm.withStructuredOutput(CheckSchema);
  const byId = new Map(state.sources.map((s) => [s.id, s]));

  const checks: ClaimCheck[] = await Promise.all(
    state.claims.map(async (claim): Promise<ClaimCheck> => {
      const cited = claim.sourceIds
        .map((id) => byId.get(id))
        .filter((s): s is Source => s !== undefined);

      const result = await checker.invoke([
        ["system", VERIFIER_PROMPT],
        [
          "human",
          `CLAIM: ${claim.text}\n\nCITED SOURCES:\n${formatSources(cited)}`,
        ],
      ]);

      let verdict: Verdict = result.verdict;
      let reason = result.reason;
      const quoteExists =
        result.quote.length > 0 &&
        cited.some((s) => normalize(s.text).includes(normalize(result.quote)));

      if (verdict !== "unsupported" && !quoteExists) {
        verdict = "unsupported";
        reason = "Evidence quote was not found in the cited source text.";
      }

      return { claim, verdict, evidence: result.quote, reason };
    }),
  );

  return { checks };
}
