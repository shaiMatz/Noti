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

// Create Post Method
async createPost(req: AuthRequest, res: Response) {
  const userId = req.user._id;
  console.log("Request body: ", req.body);
  const post = new Post({
      userId: userId,
      content: req.body.content || "",
      location: req.body.location,
      image: req.body.image || "",
      geo: {
          type: 'Point',
          coordinates: [req.body.longitude, req.body.latitude]
      }
  });
  console.log("Creating post: ", post);
  try {
      const newPost = await post.save();
      console.log("New post: ", newPost);
      res.status(201).json(newPost);
      console.log("Post created successfully: ", newPost);
  } catch (error) {
      res.status(400).json({ message: (error as Error).message });
  }
}

  
// Edit Post Method
async editPost(req: AuthRequest, res: Response) {
  const updateData = {
      ...req.body,
      ...(req.body.longitude && req.body.latitude ? {
          geo: {
              type: 'Point',
              coordinates: [req.body.longitude, req.body.latitude]
          }
      } : {})
  };

  try {
      console.log("Editing post with id: ", req.params.id);
      const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

// Get Posts by Location with Geospatial Query
async getPostByLocation(req: AuthRequest, res: Response) {
  console.log("Getting posts by location");
  // Explicitly cast longitude and latitude to string using TypeScript type assertions
  const longitude = req.body.longitude as string;
  const latitude = req.body.latitude as string;
  console.log("Longitude: ", longitude);
  console.log("Latitude: ", latitude);
  try {
      const posts = await Post.find({
          geo: {
              $near: {
                  $geometry: {
                      type: "Point",
                      coordinates: [
                          parseFloat(longitude),  // Safely parse it as a float
                          parseFloat(latitude)    // Safely parse it as a float
                      ]
                  }
              }
          }
      });

      res.status(200).json(posts);
      console.log("Posts retrieved successfully based on location: ", posts);
  } catch (error) {
      res.status(500).json({ message: (error as Error).message });
  }
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
