import express from "express"
import dotenv from "dotenv"
//routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationsRoutes from "./routes/notifications.routes.js"

//cloudinary
import { v2 as cloudinary } from "cloudinary"

//db
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationsRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectMongoDB()
})