import { bigint, boolean, foreignKey, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    username: varchar("username", { length: 150 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const questions = mysqlTable("questions", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    levelId: bigint("level_id", { mode: "number", unsigned: true }).notNull(),
    gameModesId: bigint("gameModesId", { mode: "number", unsigned: true }).notNull(),
    questionText: varchar("question_text", { length: 255 }).notNull(),
    attachment: text("attachment"),
    answer: varchar("answer", { length: 255 }).notNull(),
    point: int("point", { unsigned: true }).notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
}, (table) => [
    foreignKey({
        columns: [table.levelId],
        foreignColumns: [levels.id]
    }),
    foreignKey({
        columns: [table.gameModesId],
        foreignColumns: [gameModes.id]
    })
]);

export const answerOptions = mysqlTable("answer_options", {
    id: bigint('id', { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    questionsId: bigint("questions_id", { mode: "number", unsigned: true }).notNull(),
    option: varchar("option", { length: 255 }).notNull(),
    isCorrect: boolean("is_correct").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
}, (table) => [
    foreignKey({
        columns: [table.questionsId],
        foreignColumns: [questions.id]
    })
]);

export const gameModes = mysqlTable("game_modes", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
});

export const levels = mysqlTable("levels", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    gameModesId: bigint("game_modes_id", { mode: "number", unsigned: true }).notNull(),
    level: int("level").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
}, (table) => [
    foreignKey({
        columns: [table.gameModesId],
        foreignColumns: [gameModes.id]
    }),
]);

export const gameSessions = mysqlTable("game_sessions", {
    id: bigint('id', { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    gameModesId: bigint("game_modes_id", { mode: "number", unsigned: true }).notNull(),
    levelId: bigint("level_id", { mode: "number", unsigned: true }).notNull(),
    totalQuestions: int("total_questions", { unsigned: true }).notNull(),
    correctAnswers: int("correct_answers", { unsigned: true }).notNull(),
    wrongAnswers: int("wrong_answers", { unsigned: true }).notNull(),
    totalScore: int("total_score", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id]
    }),
    foreignKey({
        columns: [table.gameModesId],
        foreignColumns: [gameModes.id]
    }),
    foreignKey({
        columns: [table.levelId],
        foreignColumns: [levels.id]
    })
]);

export const userAnswers = mysqlTable("user_answers", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    gameSessionsId: bigint("game_sessions_id", { mode: "number", unsigned: true }).notNull(),
    questionsId: bigint("questions_id", { mode: "number", unsigned: true }).notNull(),
    answerOptionsId: bigint("answer_options_id", { mode: "number", unsigned: true }).notNull(),
    isCorrect: boolean("is_correct").default(false),
    scoreEarned: int("score_earned", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date())
}, (table) => [
    foreignKey({
        columns: [table.gameSessionsId],
        foreignColumns: [gameSessions.id]
    }),
    foreignKey({
        columns: [table.questionsId],
        foreignColumns: [questions.id]
    }),
    foreignKey({
        columns: [table.answerOptionsId],
        foreignColumns: [answerOptions.id]
    })
]);