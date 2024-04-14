import { Request, Response } from "express"; // Importing types for Request and Response
import Post, { IPost } from "../models/post_model"; // Assuming Post is properly typed in its own definition
import createController from "./base_controller";

class postController extends createController<IPost> {
  constructor() {
    super(Post);
  }

  async getPosts(req: Request, res: Response) {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
      console.log("Posts retrieved successfully: ", posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
    return; // Explicitly indicate the end of the function
  }

  async createPost(req: Request, res: Response) {
    console.log("Request body: ", req.body);
    const post = new Post({
      userId: req.body.userId,
      content: req.body.content,
      location: req.body.location,
      image: req.body.image,
     
    });
    console.log("Post object: ", post);
    try {
      const newPost = await post.save();
      res.status(201).json(newPost);
      console.log("Post created successfully: ", newPost);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const result = await Post.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).json({ message: "Post not found" });
        return; // Early return to stop execution
      }
      res.json({ message: "Post deleted" });
      console.log("Post deleted successfully");
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new postController();
