import { relations } from "drizzle-orm";
import { answerOptions, gameModes, gameSessions, levels, questions, userAnswers, users } from "./schema.js";

export const userRelations = relations(users, ({ many }) => ({
    gameSessions: many(gameSessions)
}));

export const gameModesRelations = relations(gameModes, ({ many }) => ({
    levels: many(levels),
    gameSessions: many(gameSessions),
    questions: many(questions)
}));

export const levelsRelations = relations(levels, ({ one, many }) => ({
    gameModes: one(gameModes, {
        fields: [levels.gameModesId],
        references: [gameModes.id]
    }),
    questions: many(questions),
    gameSessions: many(gameSessions)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
    levels: one(levels, {
        fields: [questions.levelId],
        references: [levels.id]
    }),
    gameModesId: one(gameModes, {
        fields: [questions.gameModesId],
        references: [gameModes.id]
    }),
    answerOptions: many(answerOptions),
    userAnswers: many(userAnswers)
}));

export const answerOptinosRelations = relations(answerOptions, ({ one, many }) => ({
    questions: one(questions, {
        fields: [answerOptions.questionsId],
        references: [questions.id],
    }),
    userAnswers: many(userAnswers)
}));

export const gameSessionsrelations = relations(gameSessions, ({ one, many }) => ({
    users: one(users, {
        fields: [gameSessions.userId],
        references: [users.id]
    }),
    gameModes: one(gameModes, {
        fields: [gameSessions.gameModesId],
        references: [gameModes.id]
    }),
    levels: one(levels, {
        fields: [gameSessions.levelId],
        references: [levels.id]
    }),
    userAnswers: many(userAnswers)
}));

export const userAnswersrelations = relations(userAnswers, ({ one }) => ({
    gameSessions: one(gameSessions, {
        fields: [userAnswers.gameSessionsId],
        references: [gameSessions.id]
    }),
    questions: one(questions, {
        fields: [userAnswers.questionsId],
        references: [questions.id]
    }),
    answerOptions: one(answerOptions, {
        fields: [userAnswers.answerOptionsId],
        references: [answerOptions.id]
    })
}))