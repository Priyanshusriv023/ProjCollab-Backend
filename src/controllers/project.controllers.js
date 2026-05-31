import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectmember.models.js';
import { apiResponse } from "../utils/api-Response.js";
import {apiError} from "../utils/api-Error.js";
import {asynchandler} from "../utils/asynchandler.js";



const getProjects = asynchandler(async (req,res)=>{})

const getProjectById = asynchandler(async (req,res)=>{})


const createProject = asynchandler(async (req,res)=>{})


const updateProject = asynchandler(async (req,res)=>{})

const deleteProject = asynchandler(async (req,res)=>{})


const addMemberToProject = asynchandler(async (req,res)=>{})


const getProjectMembers = asynchandler(async (req,res)=>{})

const updateMemeberRole = asynchandler(async (req,res)=>{})

const deleteMember = asynchandler(async (req,res)=>{})


export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemeberRole,
    deleteMember
}

