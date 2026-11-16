import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { gameSessions } from "../../db/schema.js";

export async function CheckSessionsDAO(userId: number, gameModesId: number, levelId: number) {
    const data = await db
        .select({
            id: gameSessions.id
        })
        .from(gameSessions)
        .where(
            and(
                eq(gameSessions.userId, userId),
                eq(gameSessions.gameModesId, gameModesId),
            )
        )
        .limit(1);

    if(data.length === 0) {
        await db
            .insert(gameSessions)
            .values({
                userId: userId,
                gameModesId: gameModesId,
                totalQuestions: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                totalScore: 0
            });
    } else {
        return data;
    }
    return data;
}