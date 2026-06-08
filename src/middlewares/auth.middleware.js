import {User} from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import {apiError} from "../utils/api-Error.js";
import {asynchandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export const verifyJWT = asynchandler(async (req,res,next)=>{
         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")//this extra space after bearer is neccesary

         if(!token){
              throw new apiError(401,"unauthorized request")

         }

         try{
                const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

                const user = await User.findById(decodedToken._id)
                                      .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

                 if(!user){
                     throw new apiError(401,"unauthorized request, user does not exist")
                 }
                 req.user = user;
                    next()
         }
         catch(error){
             throw new apiError(401,error?.message || "invalid access token")
         }
        

})


export const validateProjectPermission = (roles = []) => {
  return asynchandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new apiError(400, "project id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new apiError(400, "project not found");
    }

    const givenRole = project?.role;

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new apiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};
