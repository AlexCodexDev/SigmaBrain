import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { users } from "../../db/schema.js";

export async function RegisterDAO(data: any) {
    await db.insert(users).values({
        username: data.username,
        email: data.email,
        password: data.password,
        updatedAt: null
    });
}

export async function LoginDAO(email: string) {
    const result = await db
        .select()
        .from(users)
        .where(
            eq(users.email, email),
        )
        .limit(1);

    return result[0] ?? null;
}