import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/connectDB.js';
import userRouter from './src/routes/userRoute.js';
import cookieParser from 'cookie-parser'; 
import categoryRouter from './src/routes/categoryRoute.js';
import uploadRouter from './src/routes/uploadRouter.js';
import subCategoryRouter from './src/routes/subCategoryRoute.js';

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
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Servidor corriendo en el puerto ", PORT)
    })
});