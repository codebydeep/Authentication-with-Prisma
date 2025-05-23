import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import Routes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()

const port = process.env.PORT || 4000

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: process.env.PORT,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"]
}))

app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Authentication with Prisma")
})


app.use("/api/v1/user", Routes)

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})