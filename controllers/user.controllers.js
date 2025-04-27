import db from "../libs/db.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }
}
const loginUser = async (req, res) => {}
const logoutUser = async (req, res) => {}

export {registerUser, loginUser, logoutUser}