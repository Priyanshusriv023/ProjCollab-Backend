import { apiResponse } from "../utils/api-Response.js";
import {asynchandler} from "../utils/asyncHandler.js";

/*const healthCheck =  (req, res) => {
    try {
        res
        .status(200)
        .json(new apiResponse(200, { message: "Server is running" }));
    } catch (error) {
        // 1. Print the exact error to your terminal so you can see what broke
        console.error("🥵 HEALTHCHECK CRASHED:", error);
        
        // 2. Send an error response so the browser stops spinning
        return res.status(500).json({
            success: false,
            message: "Internal Server Error inside healthcheck controller",
            error: error.message
        });
    }
}; */

const healthCheck = asynchandler(async (req,res)=>{
         res.status(200).
         json(new apiResponse(200,{message:"server is running"}))
});



export { healthCheck };