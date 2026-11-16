import { questions } from "../../db/schema.js";
import * as DAO from "./dao.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetDataServices(
    gameModesId: number,
    questionType: QuestionType,
    startLevelId: number,
    endLevel: number
) {
    const data = DAO.GetDataDAO(
        gameModesId,
        questionType,
        startLevelId,
        endLevel
    );
    return data;
}