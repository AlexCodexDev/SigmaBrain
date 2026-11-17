import { and, eq, sql, count } from "drizzle-orm";
import { db } from "../../config/database.js";
import { answerOptions, gameSessions, userAnswers } from "../../db/schema.js";

export async function CheckAnswerDAO(questionId: number, answer: string) {
    const data = await db
        .select({
            isCorrect: answerOptions.isCorrect,
        })
        .from(answerOptions)
        .where(
            and(
                eq(answerOptions.questionsId, questionId),
                eq(answerOptions.option, answer)
            )
        );
    return data;
}

export async function SubmitAnswerDAO(
    gameSessionId: number,
    questionId: number,
    answerOptionId: number,
    levelId: number,
    isCorrect: boolean,
    point: number
) {
    await db.transaction(async (tx) => {
        const hasInserted = await tx
            .select({
                id: userAnswers.id
            })
            .from(userAnswers)
            .where(
                and(
                    eq(userAnswers.gameSessionsId, gameSessionId),
                    eq(userAnswers.answerOptionsId, answerOptionId),
                    eq(userAnswers.questionsId, questionId),
                    eq(userAnswers.levelId, levelId),
                )
            );

        if(hasInserted.length === 0) {
            await tx
                .insert(userAnswers)
                .values({
                    gameSessionsId: gameSessionId,
                    questionsId: questionId,
                    answerOptionsId: answerOptionId,
                    levelId: levelId,
                    isCorrect: isCorrect,
                    scoreEarned: isCorrect ? point : 0
                });
        }

        const [stats] = await tx
            .select({
                totalQuestions: sql<number>`
                    COUNT(DISTINCT ${userAnswers.questionsId})
                `.mapWith(Number),
                correctAnswers: sql<number>`
                    COUNT(
                        DISTINCT CASE
                            WHEN ${userAnswers.isCorrect} = 1
                            THEN ${userAnswers.questionsId}
                        END
                    )
                `.mapWith(Number),
                wrongAnswers: sql<number>`
                    SUM(
                        CASE
                            WHEN ${userAnswers.isCorrect} = 0
                            THEN 1
                            ELSE 0
                        END
                    )
                `.mapWith(Number),
                totalScore: sql<number>`
                    GREATEST(
                        0,
                        COALESCE(
                            SUM(
                                CASE
                                    WHEN ${userAnswers.isCorrect} = 1
                                    THEN ${userAnswers.scoreEarned}
                                    ELSE 0
                                END
                            ), 0
                        )
                        -
                        (
                            COUNT(
                                CASE
                                    WHEN ${userAnswers.isCorrect} = 0
                                    THEN 1
                                END
                            ) * 2
                        )
                    )
                `.mapWith(Number)
            })
            .from(userAnswers)
            .where(
                eq(
                    userAnswers.gameSessionsId,
                    gameSessionId
                )
            );

        await tx
            .update(gameSessions)
            .set({
                totalQuestions: stats.totalQuestions,
                correctAnswers: stats.correctAnswers,
                wrongAnswers: stats.wrongAnswers,
                totalScore: stats.totalScore
            })
            .where(
                eq(gameSessions.id, gameSessionId)
            );
    });

    return true;
}