import { Request, Response } from "express";
import * as Services from "./services.js";

export async function GetLevelsController(req: Request, res: Response) {
    try {
        const { gameModesId, gameSessionId } = req.query;

        const result = await Services.GetLevelsServices(
            Number(gameModesId),
            Number(gameSessionId)
        );

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}