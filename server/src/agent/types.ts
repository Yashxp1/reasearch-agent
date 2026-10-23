export interface Source {
  id: string;
  url: string;
  title: string;
  text: string;
}

export interface Claim {
  text: string;
  sourceIds: string[];
}

export type Verdict = "supported" | "partial" | "unsupported";

export interface ClaimCheck {
  claim: Claim;
  verdict: Verdict;
  evidence: string;
  reason: string;
}
