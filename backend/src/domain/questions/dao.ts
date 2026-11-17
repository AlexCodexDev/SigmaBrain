import { and, asc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../config/database.js";
import { answerOptions, gameSessions, levels, questions } from "../../db/schema.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetDataDAO(
    gameModesId: number,
    type: QuestionType,
    startLevelId: number,
    endLevel: number
) {
    const [startingLevel] = await db
        .select({
            levelNo: levels.level
        })
        .from(levels)
        .where(
            and(
                eq(levels.id, startLevelId),
                eq(levels.gameModesId, gameModesId)
            )
        )
        .limit(1);

    if(!startingLevel) return [];

    const data = await db
        .select({
            id: questions.id,
            questionText: questions.questionText,
            questionType: questions.questionType,
            gameModesId: questions.gameModesId,
            answer: questions.answer,
            point: questions.point,

            levelid: levels.id,
            levelNo: levels.level,
            levelName: levels.name,

            answerOptionsId: answerOptions.id,
            option: answerOptions.option,
            isCorrect: answerOptions.isCorrect,


        })
        .from(questions)
        .innerJoin(
            answerOptions,
            eq(questions.id, answerOptions.questionsId)
        )
        .innerJoin(
            levels,
            eq(questions.levelId, levels.id)
        )
        .where(
            and(
                eq(questions.gameModesId, gameModesId),
                eq(questions.questionType, type),
                gte(levels.level, startingLevel.levelNo),
                lte(levels.level, endLevel),
                eq(questions.isActive, true)
            ),
        )
        .orderBy(
            asc(levels.level),
            asc(questions.id)
        );
    return data;
}