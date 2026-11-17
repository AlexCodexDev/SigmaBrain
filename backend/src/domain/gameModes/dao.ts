import { ne } from "drizzle-orm";
import { db } from "../../config/database.js";
import { gameModes } from "../../db/schema.js";

export async function GetDataDAO() {
    const data = await db
        .select({
            id: gameModes.id,
            name: gameModes.name
        })
        .from(gameModes)
        .where(
            ne(gameModes.name, "nightmare")
        );
    return data;
}