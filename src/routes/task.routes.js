import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRoleEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Secure all task routes
router.use(verifyJWT);

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    upload.array("attachments", 10),
    createTaskValidator(),
    validate,
    createTask
  );

router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    updateTaskValidator(),
    validate,
    updateTask
  )
  .delete(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
    deleteTask
  );

export default router;
