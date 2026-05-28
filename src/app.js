import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();


// --- BASIC CONFIGURATIONS (Middleware) ---
// 1. Parse JSON data (e.g., from Postman or Thunder Client)
app.use(express.json({ limit: "16kb" }));

// 2. Parse URL-encoded data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 3. Serve static files (like images) from the 'public' folder
app.use(express.static("public"));

app.use(cookieParser())


app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


//import healthcheck route
import healthCheckRoute from "./routes/healthcheck.routes.js";
import authRoute from "./routes/auth.routes.js";


app.use("/api/v1/healthcheck", healthCheckRoute);
app.use("/api/v1/auth", authRoute);

app.get("/",(req,res) => {
       res.send("This is just a blank page")
})

app.get("/Webinox",(req,res) => {
       res.send("We Welcome you to Webinox")
})

export default app