import { Router } from "express";
import * as Controller from "../domain/answer/controller.js";

const answer = Router();

answer.get("/check/:questionId", Controller.CheckAnswerController);

answer.post("/submit", Controller.SubmitAnswerController);

export default answer;