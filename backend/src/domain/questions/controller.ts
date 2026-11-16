import { Request, Response } from "express";
import * as Services from "./services.js";
import { questions } from "../../db/schema.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetDataController(req: Request, res: Response) {
    try {
        const { gameModesId, questionType, startLevelId, endLevel } = req.query;

        const result = await Services.GetDataServices(
            Number(gameModesId),
            questionType as QuestionType,
            Number(startLevelId),
            Number(endLevel)
        );

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}