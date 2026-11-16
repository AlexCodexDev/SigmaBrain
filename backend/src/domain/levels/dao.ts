import { and, eq, exists } from "drizzle-orm";
import { db } from "../../config/database.js";
import { levels, userAnswers } from "../../db/schema.js";

export async function GetLevelsDAO(
    gameModesId: number,
    gameSessionId: number
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
                    .where(
                        and(
                            eq(userAnswers.levelId, levels.id),
                            eq(userAnswers.gameSessionsId, gameSessionId)
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