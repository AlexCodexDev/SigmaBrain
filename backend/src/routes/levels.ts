import { Router } from "express";
import * as Controller from "../domain/levels/controller.js";

const LevelRoute = Router();

LevelRoute.get("/fetch", Controller.GetLevelsController);

export default LevelRoute;