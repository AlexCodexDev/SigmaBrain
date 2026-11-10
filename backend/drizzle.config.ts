import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if(!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export default defineConfig({
    dialect: "mysql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: DATABASE_URL
    }
});