import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import { gameSessions, users } from "../../db/schema.js";

export async function CheckSessionsDAO(userId: number, gameModesId: number) {
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

export async function GetLeaderBoardDAO() {
    const data = await db
        .select({
            username: users.username,

            score: sql<number>`
                COALESCE(
                    SUM(${gameSessions.totalScore}), 0
                )
            `.mapWith(Number)
        })
        .from(users)
        .leftJoin(
            gameSessions,
            eq(users.id, gameSessions.userId)
        )
        .groupBy(
            users.id,
            users.username
        )
        .orderBy(
            desc(sql`SUM(${gameSessions.totalScore})`)
        );
    
    return data;
}

export async function GetScoreUserDAO(user: number) {
    const data = await db
        .select({
            score: sql<number>`
            COALESCE(
                SUM(${gameSessions.totalScore}), 0
            )
            `.mapWith(Number)
        })
        .from(gameSessions)
        .where(
            eq(gameSessions.userId, user)
        )
        .limit(1);

    return data;
}