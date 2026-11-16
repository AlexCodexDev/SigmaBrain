import * as DAO from "./dao.js";

export async function CheckAnswerServices(questionId: number, answer: string) {
    if(!answer) {
        return "Jawaban tidak boleh kosong.";
    }
    
    const data = await DAO.CheckAnswerDAO(questionId, answer);
    return data;
}

export async function SubmitAnswerServices(
    gameSessionId: number,
    questionId: number,
    answerOptionId: number,
    levelId: number,
    isCorrect: boolean,
    point: number,
) {
    await DAO.SubmitAnswerDAO(
        gameSessionId,
        questionId,
        answerOptionId,
        levelId,
        isCorrect,
        point
    );

    return true;
}