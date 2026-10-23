import { z } from "zod";
import { Request, Response } from "express";
import { runResearch } from "../agent/graph";

const BodySchema = z.object({
  question: z.string().min(5).max(500),
});

export const handleResearch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = BodySchema.safeParse(req.body);

  if (!parsed) {
    res.status(400).json({ error: "question must be 5 to 500 characters" });
    return;
  }

  try {
    const result = await runResearch(parsed.data?.question || "");
    res.json(result);
  } catch (error) {
    console.error("Error running research:", error);
    res.status(500).json({ error: "Failed to run research" });
  }
};
