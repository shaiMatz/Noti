import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";

router.get("/", PostController.getPosts.bind(PostController))

router.get("/:id", PostController.getPosts.bind(PostController))

router.post("/", PostController.createPost.bind(PostController))

router.delete("/:id", PostController.deletePost.bind(PostController));



export default router;

