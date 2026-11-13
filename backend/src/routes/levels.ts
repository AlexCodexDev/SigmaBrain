import { Router } from "express";
import * as Controller from "../domain/levels/controller.js";

const LevelRoute = Router();

LevelRoute.get("/fetch/:gameModeId", Controller.GetLevelsController);

export default LevelRoute;