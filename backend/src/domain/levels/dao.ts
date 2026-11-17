import { and, asc, count, eq, exists, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import { levels, questions, userAnswers } from "../../db/schema.js";

export type QuestionType = NonNullable<
    typeof questions.$inferInsert.questionType
>;

export async function GetLevelsDAO(
    gameModesId: number,
    gameSessionId: number,
    questionType: QuestionType,
    difficulty: string
) {
     const levelData = await db
        .select({
            id: levels.id,
            level: levels.level,
            name: levels.name
        })
        .from(levels)
        .where(
            and(
                eq(levels.gameModesId, gameModesId),
                eq(levels.name, difficulty)
            )
        )
        .orderBy(asc(levels.level));

        const questionCounts = await db
            .select({
                levelId: questions.levelId,
                totalQuestions: count(questions.id)
            })
            .from(questions)
            .where(
                and(
                    eq(questions.gameModesId, gameModesId),
                    eq(questions.questionType, questionType),
                    eq(questions.isActive, true)
                )
            )
            .groupBy(questions.levelId);

        const answerStats = await db
            .select({
                levelId: userAnswers.levelId,

                totalAttempts: count(userAnswers.id),

                correctQuestions: sql<number>`
                    COUNT(
                        DISTINCT CASE
                            WHEN ${userAnswers.isCorrect} = 1
                            THEN ${userAnswers.questionsId}
                        END
                    )
                `.mapWith(Number)
            })
            .from(userAnswers)
            .innerJoin(
                questions,
                eq(userAnswers.questionsId, questions.id)
            )
            .where(
                and(
                    eq(userAnswers.gameSessionsId, gameSessionId),
                    eq(questions.gameModesId, gameModesId),
                    eq(questions.questionType, questionType),
                    eq(questions.isActive, true)
                )
            )
            .groupBy(userAnswers.levelId);

        const questionMap = new Map(
            questionCounts.map(item => [
                item.levelId,
                item.totalQuestions
            ])
        );

        const answerMap = new Map(
            answerStats.map(item => [
                item.levelId,
                item
            ])
        );

        const result = levelData.map((item, index) => {
            const totalQuestions = questionMap.get(item.id) ?? 0;

            const answer = answerMap.get(item.id);

            const correctQuestions = answer?.correctQuestions ?? 0;

            const hasUserAnswer = (answer?.totalAttempts ?? 0) > 0;

            const isCompleted =
                totalQuestions > 0 &&
                correctQuestions >= totalQuestions;

            const previousLevel = index > 0
                ? levelData[index - 1]
                : null;

            const previousQuestionCount = previousLevel
                ? questionMap.get(previousLevel.id) ?? 0
                : 0;

            const previousAnswer = previousLevel
                ? answerMap.get(previousLevel.id)
                : undefined;

            const previousCompleted =
                previousQuestionCount > 0 &&
                (previousAnswer?.correctQuestions ?? 0) >= previousQuestionCount;

            const isLocked = index > 0 && !previousCompleted;

            return {
                id: item.id,
                level: item.level,
                name: item.name,

                totalQuestions,
                correctQuestions,

                hasUserAnswer,
                isCompleted,
                isLocked
            };
        });

    return result;
}