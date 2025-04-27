import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

const Routes = express.Router()

Routes.post("/register", registerUser)
Routes.post("/login", loginUser)
Routes.post("/logout", logoutUser)

export default Routes