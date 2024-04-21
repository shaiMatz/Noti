import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import authenticate from "../common/auth_middleware";

router.get("/", authenticate, UserController.getUser.bind(UserController));
router.put("/", authenticate, UserController.editUser.bind(UserController));
router.delete("/", authenticate, UserController.deleteUser.bind(UserController));




export default router;

