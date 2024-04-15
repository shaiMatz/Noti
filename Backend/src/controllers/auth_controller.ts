import { Request, Response, NextFunction } from "express";
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
      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      if (user.tokens) {
        user.tokens = [refreshToken];
      } else {
        user.tokens.push(refreshToken);
      }
      await user.save();
      res
        .status(200)
        .send({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
      return sendError(res);
    }
  }
};

const generateTokens = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    {
      _id: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      salt: Math.random(),
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) res.sendStatus(401);
  console.log("Token:", token);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).send(err.message + "Invalid token");
    }
    if (!userInfo) {
      console.log("Invalid token payload.");
      return res.status(403).send("Invalid token payload.");
    }
    try {
      console.log("User info:", userInfo);
      if (!userInfo._id) {
        console.log("there is no user id in the token payload");
        return res.status(403).send("Invalid token payload.");
      }
      const user = await User.findById(userInfo._id);
      if (!user) {
        console.log("user not found ");
        return res.status(403).send("Invalid request");
      } else if (user.tokens.length === 0) {
        console.log("No tokens found for user");
        return res.status(403).send("No tokens found for user");
      }
      if (!user.tokens.includes(token)) {
        user.tokens = []; // Invalidate all user tokens
        await user.save();
        console.log("Token not in user's list");
        return res.status(403).send(" Token not in user's list");
      }

      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      user.tokens[user.tokens.indexOf(token)] = refreshToken;
      await user.save();

      res.status(200).send({ accessToken, refreshToken: refreshToken });
    } catch (err) {
      console.error("Error saving the user:", err);
      res.status(403).send(err.message);
    }
  });
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.body.refreshToken;
  console.log("Token:", token);
  if (!token) {
    res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    const user = await User.findById(decoded._id);
    if (!user || !user.tokens.includes(token)) {
      res.status(404).send("User not found or token invalid.");
    }
    user.tokens = user.tokens.filter((t) => t !== token);
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    res.status(403).send(err.message);
  }
};

export default {
  login,
  register,
  refreshToken,
  logout,
};