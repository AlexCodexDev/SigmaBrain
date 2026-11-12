import { Router } from "express";
import * as Controller from "../../domain/auth/controller.js";
import { AuthMiddleware } from "../../middleware/authMiddleware.js";

const AuthRouter = Router();

AuthRouter.get("/me", AuthMiddleware, Controller.CheckAuthController);

AuthRouter.post("/register", Controller.RegisterController);
AuthRouter.post("/login", Controller.LoginController);
AuthRouter.post("/logout", Controller.LogoutController);

export default AuthRouter;