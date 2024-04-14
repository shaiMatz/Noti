import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authenticate from "../common/auth_middleware";

router.get("/",authenticate, PostController.getPosts.bind(PostController))

router.get("/:id",authenticate, PostController.getPosts.bind(PostController))

router.post("/", authenticate,PostController.createPost.bind(PostController))

router.delete("/:id", authenticate,PostController.deletePost.bind(PostController));



export default router;

