import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { levels } from "../../db/schema.js";

export async function GetLevelsDAO(gameModeId: number) {
    const data = await db
        .select({
            id: levels.id,
            level: levels.level
        })
        .from(levels)
        .where(
            eq(levels.gameModesId, gameModeId)
        );

    return data;
}