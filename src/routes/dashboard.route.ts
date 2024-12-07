import { DashboardController } from "@root/controllers/dashboard.controller";
import verifyAuthentication from "@root/middleware/verifyAuthentication.middleware";
import { Router } from "express";

export const dashboardRoute = Router()

dashboardRoute.get("/users", DashboardController.getUsers)
dashboardRoute.delete("/users/:id", DashboardController.deleteUser)
dashboardRoute.put("/users/:id", DashboardController.updateUser)