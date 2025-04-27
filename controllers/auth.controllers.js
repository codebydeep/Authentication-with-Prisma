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

const loginUser = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }

    try {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched){
            return res.status(400).json({
                success: false,
                message: "Invalid Password!"
            })
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,
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
            message: "User LOGGEDIN Done",
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "Erro LoggedIn User || Internal Server Error!"
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        })

        return res.status(200).json({
            success: true,
            message: "User LOGGEDOUT Done"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error LoggedOut User || Internal Server Error!"
        })
    }
}


const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User Authenticated Successfully",
            user: req.user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Error checking User!"
        })
    }
}


export {registerUser, loginUser, logoutUser, check}