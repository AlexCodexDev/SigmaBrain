import { Request, Response } from "express";
import * as Services from "./services.js";

export async function CheckSessionController(req: Request, res: Response) {
    try {
        const { userId, gameModesId, levelId } = req.query;

        const result = await Services.CheckSessionService(
            Number(userId),
            Number(gameModesId),
            Number(levelId)
        );

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}