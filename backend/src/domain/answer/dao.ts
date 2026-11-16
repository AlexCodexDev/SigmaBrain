import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { answerOptions, userAnswers } from "../../db/schema.js";

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
    await db
        .insert(userAnswers)
        .values({
            gameSessionsId: gameSessionId,
            questionsId: questionId,
            answerOptionsId: answerOptionId,
            levelId: levelId,
            isCorrect: isCorrect,
            scoreEarned: point
        });

    return true;
}