import connectDB from './db/db.js';
import dotenv from 'dotenv';
import {app} from './app.js'
// dotenv.config({ quiet: true });
dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT ||5000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})