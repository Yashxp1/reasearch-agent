import { Router } from "express";
import { healthRouter } from "./health.routes";
import { researchRouter } from "./research.routes";

const router = Router();

router.use("/", healthRouter);
router.use("/", researchRouter);

export { router as apiRouter };
