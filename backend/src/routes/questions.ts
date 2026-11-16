import { Router } from "express";
import * as Controller from "../domain/questions/controller.js";

const QuestionRoute = Router();

QuestionRoute.get("/fetch", Controller.GetDataController);

export default QuestionRoute;