import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user_model";

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
    return sendError(res, "failed to create user");
  }
};

const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout route" });
  res.status(400).json({ message: "Logout failed" });
};
const login = (req: Request, res: Response) => {
  res.status(200).json({ message: "Login route" });
  res.status(400).json({ message: "Login failed" });
};

function sendError(res, msg = "Invalid request") {
  return res.status(400).send({
    status: "error",
    message: msg,
  });
}

export default {
  login,
  register,
  logout,
};

