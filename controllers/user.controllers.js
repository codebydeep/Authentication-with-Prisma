import db from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }

    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })
        
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        
        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "User REGISTERED Done",
            user:{
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            }
        })
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

const loginUser = async (req, res) => {}
const logoutUser = async (req, res) => {}

export {registerUser, loginUser, logoutUser}