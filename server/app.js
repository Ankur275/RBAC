import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConfig.js";

dotenv.config()
const app = express();
const  port = process.env.PORT||3500;
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CORS_ORIGIN, 
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port} \n http://localhost:${port}`);
    })
})