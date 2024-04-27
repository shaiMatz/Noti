import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import createController from "./base_controller";
import { AuthRequest } from "../common/auth_middleware";

class userController extends createController<IUser> {
  constructor() {
    super(User);
  }

  // Get a specific user
  async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
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
  async editUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;

      console.log("Editing user with id: ", userId);
      console.log("Request body: ", req.body);
      const user = await User.findById(userId);
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
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user._id;

      const result = await User.findByIdAndDelete(userId);
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



  // Increase points for every stop of the reminder
  async increasePointsForReminder(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user._id;

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const requiredPoints = user.level * 100;
      user.points += 10;
      if (user.points >= requiredPoints) {
        user.level += 1;
        console.log("Level increased: ", user.level);
      }

      // Save the updated user
      await user.save();

      res.status(200).json({ message: "Points increased for reminder" });
      console.log("Points increased for reminder: ", user.points);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new userController();
