import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { apiResponse } from "../utils/api-Response.js";
import { apiError } from "../utils/api-Error.js";
import { asynchandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRoleEnum } from "../utils/constants.js";

const createTask = asynchandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new apiError(404, "Project not found");
  }
  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new apiResponse(201, task, "Task created successfully"));
});


const getTasks = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullname"); 

  return res
    .status(200)
    .json(new apiResponse(200, tasks, "Task fetched successfully"));
});

const getTaskById = asynchandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          { 
            $project:
             { _id: 1,
            username: 1,
            fullname: 1,
            avatar: 1,}
          },
        ],
      },
    },

    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new apiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asynchandler(async (req, res) => {
     const {taskId} = req.params;
     const {title,description,assignedTo,status} = req.body;
    



     const updatedTask = await Task.findByIdAndUpdate(taskId,{
        title,
        description,
        assignedTo,
        status,
     },{new: true}).populate("assignedTo", "avatar username fullname");

     if(!updatedTask){
       throw new apiError(404,"Task not found")
     }


     
     return res.status(200).json(new apiResponse(200, updatedTask, "Task updated successfully"))
});


const deleteTask = asynchandler(async (req, res) => {
      const {taskId} = req.params;
      const task = await Task.findByIdAndDelete(taskId);
      if(!task){
        throw new apiError(404,"Task not found");
      }

      return res.status(200).json(new apiResponse(200, {}, "Task deleted successfully"))
});


export {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
};
















