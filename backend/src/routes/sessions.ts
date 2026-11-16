import { Router } from "express";
import * as Controller from "../domain/sessions/controller.js";

const sessionRoute = Router();

sessionRoute.get("/check", Controller.CheckSessionController);

export default sessionRoute;