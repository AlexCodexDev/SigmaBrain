import { Request, Response } from "express";
import * as Services from "./services.js";

export async function CheckSessionController(req: Request, res: Response) {
    try {
        const { userId, gameModesId } = req.query;

        const result = await Services.CheckSessionService(
            Number(userId),
            Number(gameModesId),
        );

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}

export async function GetLeaderBoardController(req: Request, res: Response) {
    try {
        const result = await Services.GetLeaderBoardServices();
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}

export async function GetScoreUserController(req: Request, res: Response) {
    try {
        const { user } = req.query;

        const result = await Services.GetScoreUserServices(Number(user));
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}