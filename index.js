import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/connectDB.js';
import userRouter from './src/routes/userRoute.js';
import cookieParser from 'cookie-parser'; 

dotenv.config();

const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());
app.use(cookieParser());

const PORT = 4000 || process.env.PORT;

app.get("/", (req, res)=>{
    res.json({msg: "Servidor corriendo en: " + PORT})
})

app.use('/api/user', userRouter)

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Servidor corriendo en el puerto ", PORT)
    })
});