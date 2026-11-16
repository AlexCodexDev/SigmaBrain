import { Request, Response } from "express";
import * as Services from "./services.js";

interface SubmitProps {
    gameSessionId: number;
    questionId: number;
    answerOptionId: number;
    levelId: number;
    point: number;
    isCorrect: boolean;
}

export async function CheckAnswerController(req: Request, res: Response) {
    try {
        const { questionId } = req.params;
        const { answer } = req.query;

        const result = await Services.CheckAnswerServices(
            Number(questionId),
            String(answer)
        );
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}

export async function SubmitAnswerController(req: Request, res: Response) {
    try {
        const {
            gameSessionId,
            questionId,
            answerOptionId,
            levelId,
            isCorrect,
            point
        } = req.body as SubmitProps;

        const result = await Services.SubmitAnswerServices(
            gameSessionId,
            questionId,
            answerOptionId,
            levelId,
            isCorrect,
            point
        );

        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}