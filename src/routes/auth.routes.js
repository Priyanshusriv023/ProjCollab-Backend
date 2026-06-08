import { Router } from "express";
import {registerUser,loginUser,logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerification} from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import {userRegisterValidator,userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator} from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

//unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(),validate,loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword)



//secured route(we use these route only when user is loggedin,so using verifyJWT to store user in req.user)
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)


//catches error(userRegisterValidator)->validate(middleware)->registerUser(controller)
export default router;