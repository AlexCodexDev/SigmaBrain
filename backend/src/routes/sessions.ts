import { Router } from "express";
import * as Controller from "../domain/sessions/controller.js";

const sessionRoute = Router();

sessionRoute.get("/check", Controller.CheckSessionController);
sessionRoute.get("/leaderboard", Controller.GetLeaderBoardController);
sessionRoute.get("/score", Controller.GetScoreUserController);

export default sessionRoute;