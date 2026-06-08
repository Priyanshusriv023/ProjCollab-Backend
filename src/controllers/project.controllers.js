import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectmember.models.js';
import { apiResponse } from "../utils/api-Response.js";
import {apiError} from "../utils/api-Error.js";
import {asynchandler} from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRoleEnum } from '../utils/constants.js';



const getProjects = asynchandler(async (req,res)=>{
        const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, projects, "Projects fetched successfully"));
        
         
})

const getProjectById = asynchandler(async (req,res)=>{
            const {projectId} = req.params;

            const project = await Project.findById(projectId);

            if(!project){
                throw new apiError(404,"project does not exist");

            }

            return res.status(200)
                   .json(new apiResponse(
                      200,
                      project,
                      "project fetched successfully"
                   ))

})

const createProject = asynchandler(async (req,res)=>{
          const {name,description} = req.body;

          const project = await Project.create({
                 name,
                 description,
                 createdBy: new mongoose.Types.ObjectId(req.user._id)

          })

         await ProjectMember.create({
                  user: new mongoose.Types.ObjectId(req.user._id),
                  project: new mongoose.Types.ObjectId(project._id),
                  role: UserRoleEnum.ADMIN
         })

         return res.status(201)
            .json(new apiResponse(
                 201,
                 project,
                 "Project created successfully"
            ))
                 
        

         
           
})


const updateProject = asynchandler(async (req,res)=>{
          const {name,description} = req.body;
          const {projectId} = req.params;

         const project =  await Project.findByIdAndUpdate(
                projectId,
                {
                    name,
                    description,
                },
                {new: true},
          )

          if(!project){
               throw new apiError(404,"Project not found")


          }


          return res.status(200)
                 .json(new apiResponse(
                     200,
                     project,
                     "Project updated successfully"
                 ))
})

const deleteProject = asynchandler(async (req,res)=>{
         const {projectId} = req.params;
         const project = await Project.findByIdAndDelete(
                projectId
         )

         if(!project){
             throw new apiError(404,"Project does not exist")

         }

         res.status(200)
            .json(new apiResponse(
                 200,
                 {},
                 "Project deleted successfully"
            ))
})


const addMembersToProject = asynchandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  await ProjectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true, 
      upsert: true, //due to this even if user is not already in project member database it will be added with the provided role
    },
  );

  return res
    .status(201)
    .json(new apiResponse(201, {}, "Project member added successfully"));
})

const getProjectMembers = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new apiError(404, "Project not found");
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, projectMembers, "Project members fetched"));
});

const updateMemberRole = asynchandler(async (req,res)=>{
          const { projectId, userId } = req.params;
          const { newRole } = req.body;

          if(!AvailableUserRole.includes(newRole)){
              throw new apiError(404,"enter valid role")
          }
          
          const project = await ProjectMember.findOneAndUpdate({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(userId)
          },
          {role: newRole},
          {new: true});

          if(!project){
             throw new apiError(400,"Project member not found")
          }

          return res.status(200)
                 .json(new apiResponse(
                    200,
                    project,
                    "role updated successfully"
                 ))

})
                       
const deleteMember = asynchandler(async (req,res)=>{
         const { projectId, userId } = req.params;

         const project = await ProjectMember.findOneAndDelete(
               {user: new mongoose.Types.ObjectId(userId),
                project: new mongoose.Types.ObjectId(projectId)},
                
         )

         if(!project){
              throw new apiError(400,"Project member not found")
         }

         return res.status(200)
                .json(new apiResponse(
                    200,
                    {},
                    "Project member deleted successfully"
                ))
})


export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}


                      
                   
                     
            
        



