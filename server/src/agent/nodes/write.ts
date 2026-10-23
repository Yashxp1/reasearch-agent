import { z } from "zod";
import { AgentStateType } from "../state";
import { cleanClaims, formatSources } from "../utils";
import { llm } from "../llm";

export const ClaimsSchema = z.object({
  claims: z
    .array(
      z.object({
        text: z
          .string()
          .describe(
            "One self-contained factual statement taken from the sources",
          ),
        sourceIds: z
          .array(z.string())
          .min(1)
          .describe("IDs of the sources that state it, e.g. ['S1']"),
      }),
    )
    .min(1),
});

const WRITER_PROMPT = `You write answers to research questions using ONLY the provided sources.

Rules:
- Produce 4 to 8 claims that together answer the question.
- Each claim is ONE factual statement that a cited source states directly.
- Do not combine facts from different sources into one claim.
- Do not add numbers, dates, or qualifiers that are not in the source.
- Do not use your own background knowledge. If the sources do not cover part of the question, leave that part out.
- Cite only IDs that exist in the sources list.`;

export async function writeNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const writer = llm.withStructuredOutput(ClaimsSchema);

  const result = await writer.invoke([
    ["system", WRITER_PROMPT],
    `QUESTION: ${state.question}\n\nSOURCES:\n${formatSources(state.sources)}`,
  ]);

  return { claims: cleanClaims(result.claims, state.sources) };
}
