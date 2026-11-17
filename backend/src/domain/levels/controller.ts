import { Request, Response } from "express";
import * as Services from "./services.js";
import { questions } from "../../db/schema.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetLevelsController(req: Request, res: Response) {
    try {
        const { gameModesId, gameSessionId, questionType, difficulty } = req.query;

        const result = await Services.GetLevelsServices(
            Number(gameModesId),
            Number(gameSessionId),
            questionType as QuestionType,
            String(difficulty)
        );

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}