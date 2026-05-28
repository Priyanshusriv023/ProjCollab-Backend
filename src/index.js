import dotenv from "dotenv";//unlocking key
import app from "./app.js"
import connectDB from "./db/database.js";




dotenv.config({path:"./.env"})//opening door

const port = process.env.PORT;

connectDB()
.then(
        app.listen(port,()=>{
        console.log(`your application http://localhost:${port} is running successfully`)
})
)
.catch((err)=>{
         console.error("😒MangoDB connection failed",err);
         process.exit(1);
}
      
)








