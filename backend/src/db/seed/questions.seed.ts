import { db } from "../../config/database.js";
import { questions } from "../schema.js";
import { questionData } from "./data/questions.data.js";

export async function run() {
    await db.transaction(async (tx) => {
        for(const item of questionData) {
            const [data] = await tx
                .insert(questions)
                .values({
                    gameModesId: item.gameModesId,
                    questionType: item.questionType,
                    answer: item.answer,
                    point: item.point,
                    questionText: item.questionText,
                    isActive: true
                })
                .$returningId();
        }
    });

    console.log("Data questions berhasil dimasukan!");
}