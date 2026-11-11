import { Request, Response } from "express";
import * as Services from "./services.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";


export function CheckAuthController(
    req: AuthRequest,
    res: Response
) {
    return res.status(200).json({
        user: req.user
    });
}

export async function RegisterController(req: Request, res: Response) {
    const data = req.body;
    
    try {
        const result = await Services.RegisterServices(data);
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}

export async function LoginController(req: Request, res: Response) {
    try {
        const result = await Services.LoginServices(req.body);

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json(result.message);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
}