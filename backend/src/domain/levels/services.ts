import { questions } from "../../db/schema.js";
import * as DAO from "./dao.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetLevelsServices(
    gameModesId: number,
    gameSessionId: number,
    questionType: QuestionType,
    difficulty: string
) {
    if(!gameModesId) return ({ message: "Game mode tidak diketahui." });

    const data = await DAO.GetLevelsDAO(gameModesId, gameSessionId, questionType, difficulty);
    return data;
}