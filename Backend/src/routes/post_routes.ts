import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authenticate from "../common/auth_middleware";

router.get("/",authenticate, PostController.getPosts.bind(PostController))

router.get("/:id",authenticate, PostController.getPost.bind(PostController))

router.post("/", authenticate,PostController.createPost.bind(PostController))

router.delete("/:id", authenticate,PostController.deletePost.bind(PostController));

router.put("/:id", authenticate,PostController.editPost.bind(PostController));

router.get("/user/:id", authenticate,PostController.getPostByUser.bind(PostController));

router.get("/location/:location", authenticate,PostController.getPostByLocation.bind(PostController));



export default router;

