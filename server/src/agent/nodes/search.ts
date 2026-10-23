import { tavily } from "@tavily/core";
import { config } from "../../config/env";
import { AgentStateType } from "../state";
import { Source } from "../types";

const client = tavily({ apiKey: config.tavilyApiKey });

export async function searchNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  const responses = await Promise.all(
    state.queries.map((query) =>
      client
        .search(query, { maxResults: 4, includeRawContent: "text" })
        .catch((err) => {
          console.error(`Search failed for "${query}":`, err);
          return null;
        }),
    ),
  );

  const seen = new Set<string>();
  const collected: Omit<Source, "id">[] = [];

  for (const response of responses) {
    if (!response) continue;
    for (const item of response.results) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      const text = (item.rawContent || item.content || "").slice(
        0,
        config.maxCharsPerSource,
      );
      if (text.length < 200) continue;
      collected.push({
        title: item.title || "Untitled",
        url: item.url,
        text,
      });
    }
  }

  const sources: Source[] = collected
    .slice(0, config.maxSources)
    .map((s, i) => ({ id: `S${i + 1}`, ...s }));

  if (sources.length === 0) {
    throw new Error("No usable sources found for this question");
  }

  return { sources };
}
