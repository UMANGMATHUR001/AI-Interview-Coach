import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import geminiRouter from "./gemini";
import interviewsRouter from "./interviews";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(geminiRouter);
router.use(interviewsRouter);
router.use(analyticsRouter);

export default router;
