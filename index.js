import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/connectDB.js';
import userRouter from './src/routes/userRoute.js';
import cookieParser from 'cookie-parser'; 
import categoryRouter from './src/routes/categoryRoute.js';
import uploadRouter from './src/routes/uploadRouter.js';
import subCategoryRouter from './src/routes/subCategoryRoute.js';
import productRouter from './src/routes/productRoute.js';
import addressRouter from './src/routes/addressRoute.js';
import cartRouter from './src/routes/cartRoute.js';
import orderRouter from './src/routes/orderRoute.js';

dotenv.config();

const app = express()

const allowedOrigins = [
    "http://localhost:5173", 
    "https://apigreenmarket.netlify.app"
  ];
  
  app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
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
app.use('/api/product', productRouter)
app.use("/api/address",addressRouter)
app.use("/api/cart",cartRouter)
app.use('/api/order',orderRouter)

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Servidor corriendo en el puerto ", PORT)
    })
});