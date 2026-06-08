import {body} from "express-validator"
import {AvailableUserRole, AvailableTaskStatuses} from "../utils/constants.js";


export const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("username should be in lowercase")
            .isLength({min:3})
            .withMessage("length should be atleast 3"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required"),
        body("fullname")
            .optional()
            .trim()
        

    ];
};

export const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ];
};

export const userChangeCurrentPasswordValidator = () => {
        return [
            body("oldPassword")
            .trim()
            .notEmpty()
            .withMessage("Old password is required"),
            body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required")
        ]
}

export const userForgotPasswordValidator = ()=> {
          return [
             body("email")
           .trim()
           .notEmpty()
           .withMessage("Email is required")
           .isEmail()
           .withMessage("Email is invalid")
          ]
}

export const userResetForgotPasswordValidator = ()=> {
          return [
             body("newPassword")
             .trim()
             .notEmpty()
             .withMessage("Password is required")
             
          ]
}


export const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

export const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)  //this will check if the role provided is one of the values in AvailableUserRole array
      .withMessage("Role is invalid"),
  ];
};

export const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
    body("description")
      .optional()
      .trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Status is invalid"),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("Assigned to must be a valid user ID"),
  ];
};

export const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Status is invalid"),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("Assigned to must be a valid user ID"),
  ];
};

