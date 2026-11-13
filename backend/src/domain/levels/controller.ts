import { Request, Response } from "express";
import * as Services from "./services.js";

export async function GetLevelsController(req: Request, res: Response) {
    try {
        const { gameModeId } = req.params;

        const result = await Services.GetLevelsServices(Number(gameModeId));

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}