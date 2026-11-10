import { db } from "../../config/database.js";
import { users } from "../../db/schema.js";

export async function RegisterDAO(username: string, email: string, password: string) {
    await db.insert(users).values({
        username: username,
        email: email,
        password: password,
    });
}