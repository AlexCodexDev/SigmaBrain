import { and, eq, exists } from "drizzle-orm";
import { db } from "../../config/database.js";
import { levels, questions, userAnswers } from "../../db/schema.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetLevelsDAO(
    gameModesId: number,
    gameSessionId: number,
    questionType: QuestionType
) {
    const data = await db
        .select({
            id: levels.id,
            level: levels.level,

            hasUserAnswer: exists(
                db
                    .select({
                        id: userAnswers.id
                    })
                    .from(userAnswers)
                    .innerJoin(
                        questions,
                        eq(userAnswers.questionsId, questions.id)
                    )
                    .where(
                        and(
                            eq(userAnswers.levelId, levels.id),
                            eq(userAnswers.gameSessionsId, gameSessionId),
                            eq(questions.questionType, questionType)
                        )
                    )
            ).mapWith(value => Number(value) === 1)
        })
        .from(levels)
        .where(
            eq(levels.gameModesId, gameModesId)
        )

    return data;
}