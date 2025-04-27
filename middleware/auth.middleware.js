import jwt from "jsonwebtoken"
import db from "../libs/db.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided to User!"
            })
        }

        let decoded

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                success: false,
                 message: "Unauthorized - No token provided to User!"
            })
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });


        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        req.user = user

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unauthorized - No token provided to User!",
        })
    }
}

export default authMiddleware