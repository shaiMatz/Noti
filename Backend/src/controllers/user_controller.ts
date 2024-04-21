import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import createController from "./base_controller";

class userController extends createController<IUser> {
  constructor() {
    super(User);
  }

  // Get a specific user
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
      console.log("User retrieved successfully: ", user);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // Edit a user
  async editUser(req: Request, res: Response): Promise<void> {
    try {
      console.log("Editing user with id: ", req.params.id);
      console.log("Request body: ", req.body);
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update user with new data
      for (const key in req.body) {
        if (key in user && req.body[key] !== undefined) {
          user[key] = req.body[key];
        }
      }
      await user.save();

      res.status(200).json(user);
      console.log("User updated successfully: ", user);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // Delete a user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted successfully" });
      console.log("User deleted successfully");
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new userController();
