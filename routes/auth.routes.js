import express from "express";
import { loginUser, logoutUser, registerUser, check } from "../controllers/auth.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const Routes = express.Router()

Routes.post("/register", registerUser)
Routes.post("/login", loginUser)
Routes.post("/logout", authMiddleware, logoutUser)
Routes.get("/check", authMiddleware, check)

export default Routes