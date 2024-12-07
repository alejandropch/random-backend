import { AuthenticationController } from "@root/controllers/authentication.controller";
import verifyAuthentication from "@root/middleware/verifyAuthentication.middleware";
import { Router } from "express";

export const authRoute = Router()

authRoute.post("/login", AuthenticationController.login)
authRoute.post("/register", AuthenticationController.register)