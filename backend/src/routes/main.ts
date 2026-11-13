import { Router } from "express";
import AuthRouter from "./auth.js";
import GameModesRoute from "./gameModes.js";
import LevelRoute from "./levels.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/game-modes", GameModesRoute);
router.use("/levels", LevelRoute);

export default router;