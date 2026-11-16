import { Router } from "express";
import AuthRouter from "./auth.js";
import GameModesRoute from "./gameModes.js";
import LevelRoute from "./levels.js";
import QuestionRoute from "./questions.js";
import sessionRoute from "./sessions.js";
import answer from "./answer.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/game-modes", GameModesRoute);
router.use("/levels", LevelRoute);
router.use("/questions", QuestionRoute);
router.use("/sessions", sessionRoute);
router.use("/answer", answer);

export default router;