import { Claim, Source } from "./types";

export const formatSources = (sources: Source[]): string => {
  return sources
    .map((s) => `[${s.id}] ${s.title}\nURL: ${s.url}\n${s.text}`)
    .join("\n\n---\n\n");
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function cleanClaims(claims: Claim[], sources: Source[]): Claim[] {
  const validIds = new Set(sources.map((s) => s.id));
  return claims
    .map((c) => ({
      text: c.text.trim(),
      sourceIds: c.sourceIds.filter((id) => validIds.has(id)),
    }))
    .filter((c) => c.text.length > 0 && c.sourceIds.length > 0);
}
