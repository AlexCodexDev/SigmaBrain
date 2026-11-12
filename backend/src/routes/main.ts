import { Router } from "express";
import AuthRouter from "./auth.js";
import GameModesRoute from "./gameModes.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/game-modes", GameModesRoute);

export default router;