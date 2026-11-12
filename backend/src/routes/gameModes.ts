import { Router } from "express";
import * as Controller from "../domain/gameModes/controller.js";

const GameModesRoute = Router();

GameModesRoute.get("/fetch", Controller.GetDataController);

export default GameModesRoute;