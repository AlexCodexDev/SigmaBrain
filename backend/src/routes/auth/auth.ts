import { Router } from "express";
import * as Controller from "../../domain/auth/controller.js";

const AuthRouter = Router();

AuthRouter.post("/register", Controller.RegisterController);

export default AuthRouter;