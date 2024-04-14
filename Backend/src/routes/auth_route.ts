import express from "express";
import auth from "../controllers/auth_controller";
import authenticate from "../common/auth_middleware";
const router = express.Router();


router.post("/login", auth.login);
router.post("/register", auth.register);
router.post('/logout',authenticate, auth.logout);
router.post('/refreshToken', auth.refreshToken);

export default router;
