import { Request, Response } from "express";
import Post, { IPost } from "../models/post_model";
import createController from "./base_controller";
import { AuthRequest } from "../common/auth_middleware"; 

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

  async getPost(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return; // Early return to stop execution
      }
      res.status(200).json(post);
      console.log("Post retrieved successfully: ", post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async createPost(req: AuthRequest , res: Response) {
    const userId = req.user._id;
    console.log("Request body: ", req.body);
    const post = new Post({
      userId: userId,
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

  
  //edit post
  async editPost(req: AuthRequest , res: Response) {
    try {
      console.log("Editing post with id: ", req.params.id);
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Ensures the updated document is returned
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
      console.log("Post updated successfully: ", post);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  //get specific user posts
  async getPostByUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;

      console.log("getPostByUser test")
      console.log("User ID: ",userId);
      const posts = await Post.find({ userId: userId });
      res.status(200).json(posts);
      console.log("Posts retrieved successfully: ", posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
    return;
  }

  //get specific location posts
  async getPostByLocation(req: AuthRequest , res: Response) {
    try {
      
      console.log("Location: ", req.params.location);
      const posts = await Post.find({ location: req.params.location });

      res.status(200).json(posts);
      console.log("Posts retrieved successfully: ", posts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
    return;
  }

 
  async deletePost(req: AuthRequest , res: Response) {
    try {
      console.log("Deleting post with id: ", req.params.id);
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
