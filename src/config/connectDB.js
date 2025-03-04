import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error(
        "Proveer MONGODB_URI en el archivo .env"
    )
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Conexión exitosa a la DB")
    } catch (error) {
        console.log("Error en la conexión con MongoDB", error)
        process.exit(1)
    }
}
export default connectDB;