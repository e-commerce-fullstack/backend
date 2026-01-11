import mongoose from "mongoose";
import { MONGO_URL } from "../configs/env.js";
const connectDB = async () =>{
    try{
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected');
        
    }
    catch(err){
        console.log('Mongo connection fail', err.message);
        process.exit(1); // stop nodejs if connection fail
    }
}

export default connectDB