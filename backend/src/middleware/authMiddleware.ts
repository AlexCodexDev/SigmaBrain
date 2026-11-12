import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        username: string;
    };
}

export function AuthMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Silakan login terlebih dahulu."
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET belum dikonfigurasi.");
        }

        const decoded = jwt.verify(token, secret) as {
            id: number;
            email: string;
            username: string;
        };

        req.user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username
        };

        next();

    } catch {
        return res.status(401).json({
            message: "Sesi tidak valid atau sudah kedaluwarsa."
        });
    }
}