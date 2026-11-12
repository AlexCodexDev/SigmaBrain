import { db } from "../../config/database.js";
import { gameModes } from "../schema.js";
import { gameModesData } from "./data/gameModes.data.js";

export async function run() {
    await db.transaction(async (tx) => {
        for(const item of gameModesData) {
            const [data] = await tx
                .insert(gameModes)
                .values({
                    name: item.name
                })
                .$returningId();
        }
    });

    console.log("Data game modes berhasil dimasukan!");
}