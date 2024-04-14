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
      const accessToken = await jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );
      const refreshToken = await jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET
      );
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
      console.error('Token verification error:', err);
      return res.status(403).send(err.message + "Invalid token");
    }
    if (!userInfo) {
      console.log("Invalid token payload.");
      return res.status(403).send("Invalid token payload.");
    }
    try {
      console.log("User info:", userInfo);
      if (!userInfo.userId) {
        console.log("there is no user id in the token payload");
        return res.status(403).send("Invalid token payload.");
      }
      const user = await User.findById(userInfo.userId);
      if (!user ) {
        console.log("user not found ");
        return res.status(403).send("Invalid request");
      }
      else if(user.tokens.length === 0){
        console.log("No tokens found for user");
        return res.status(403).send("No tokens found for user");
      }
      if (!user.tokens.includes(token)) {
        user.tokens = []; // Invalidate all user tokens
        await user.save();
        console.log("Token not in user's list");
        return res.status(403).send(" Token not in user's list");
      }

      const accessToken = await jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );

      const refreshToken = await jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      // Replace the old token with the new one
      const tokenIndex = user.tokens.indexOf(token);
      if (tokenIndex !== -1) {
        user.tokens[tokenIndex] = refreshToken;
      } else {
        user.tokens.push(refreshToken); // If for some reason the token isn't found, add the new one
      }
      await user.save();

      res.status(200).send({ accessToken, refreshToken: refreshToken }); 
    } catch (err) {
      console.error('Error saving the user:', err);
      res.status(403).send(err.message);
    }
  });
};

const logout = async (req: Request, res: Response): Promise<void> => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) res.sendStatus(401);

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err, userInfo) => {
      if (err) return res.status(403).send(err.message);
      if (!userInfo) return res.status(403).send("Invalid token payload.");

      try {
        const user = await User.findById(userInfo._id);
        if (user === null) return res.status(403).send("Invalid request");

        if (!user.tokens.includes(token)) {
          user.tokens = []; // Invalidate all user tokens
          await user.save();
          return res.status(403).send("Invalid request");
        }

        user.tokens.splice(user.tokens.indexOf(token), 1);
        await user.save();

        res.status(200).send("User logged out successfully");
      } catch (err) {
        res.status(403).send(err.message);
      }
    }
  );
};

export default {
  login,
  register,
  refreshToken,
  logout,
};
