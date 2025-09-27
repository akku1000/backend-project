import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
// const mongoose=require('mongoose')

const connectDB=async()=>{
    try {
        // const conn= await mongoose.connect(process.env.MONGO_URL);
        const conn=await mongoose.connect(`${process.env.MONGO_URL}\${DB_NAME}`);
        console.log(`\n MongoDb connected successfully::HOST:${conn.connection.host}`)
    } catch (error) {
        console.log(`error is ${error.message}`);
        process.exit(1);
    }
}
  
export default connectDB;