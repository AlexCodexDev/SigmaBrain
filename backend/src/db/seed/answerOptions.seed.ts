import { db } from "../../config/database.js";
import { answerOptions } from "../schema.js";
import { answerOptionsData } from "./data/answerOptions.data.js";

export async function run() {
    await db.transaction(async (tx) => {
        for(const item of answerOptionsData) {
            const [data] = await tx
                .insert(answerOptions)
                .values({
                    questionsId: item.questionId,
                    option: item.option,
                    isCorrect: item.is_correct
                })
                .$returningId();
        }
    });

    console.log("Data answer options berhasil dimasukan!");
}