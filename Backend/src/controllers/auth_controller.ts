import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user_model";
import jwt from "jsonwebtoken";

interface RequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const register = async (req: Request, res: Response): Promise<void> => {
  console.log("Register route");
  const email = req.body.email;
  try {
    let user = await User.findOne({ email: email });
    console.log("user:", user);
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    return sendError(res);
  }
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  if (!email || !password || !firstName || !lastName) {
    return sendError(res);
  }
  console.log("user:", email, password, firstName, lastName);
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: hashedPassword,
    });
    let newUser = await user.save();
    console.log("newUser:", newUser);
    res
      .status(200)
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    sendError(res, "failed to create user");
  }
};

function sendError(res, msg = "Invalid request") {
  return res.status(400).send({
    status: "error",
    message: msg,
  });
}

const login = async (req: Request, res: Response): Promise<void> => {
  {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return sendError(res, "bed email or password");
    }
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return sendError(res, "User not found");
      }
      let isMatch = user.isValidPassword(password);
      if (!isMatch) {
        return sendError(res, "Invalid credentials");
      }
      const accessToken = await jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      res.status(200).send({ accessToken: accessToken });
    } catch (error) {
      return sendError(res);
    }
  }
};

export default {
  login,
  register,
};
