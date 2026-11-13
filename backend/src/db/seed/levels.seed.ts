import { db } from "../../config/database.js";
import { levels } from "../schema.js";
import { levelData } from "./data/levels.data.js";

export async function run() {
    await db.transaction(async (tx) => {
        for(const item of levelData) {
            const [data] = await tx
                .insert(levels)
                .values({
                    gameModesId: item.gameModesId,
                    name: item.name,
                    level: item.level
                })
                .$returningId();
        }
    });

    console.log("Data levels berhasil dimasukan!");
}