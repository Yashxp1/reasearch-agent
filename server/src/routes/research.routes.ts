import { Router } from "express";
import { handleResearch } from "../controllers/research.controller";

const router = Router();

router.post("/research", handleResearch);

export { router as researchRouter };
