import { Request, Response } from "express";
import * as Services from "./services.js";

export async function GetDataController(req: Request, res: Response) {
    try {
        const result = await Services.GetDataServices();
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}