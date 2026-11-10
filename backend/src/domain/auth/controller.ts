import { Request, Response } from "express";
import * as Services from "./services.js";

export async function RegisterController(req: Request, res: Response) {
    const { username, email, password } = req.body;
    
    try {
        const result = await Services.RegisterServices(username, email, password);
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json("Terjadi kesalahan : " + error.message);
    }
}