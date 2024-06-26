import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user_model";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

interface RequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const register = async (req: Request, res: Response): Promise<void> => {
  console.log("Register route");
  console.log("Body:", req.body);
  const { email, password, firstName, lastName, profilePicture, carType } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return sendError(res, "Missing required fields");
  }

  try {
    let existingUser = await User.findOne({ email: email });
    console.log("user:", existingUser);
    if (existingUser) {
       res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    return sendError(res);
  }
  
  console.log("user:", email, password, firstName, lastName, profilePicture, carType);
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      profilePicture: profilePicture || '',  // Provide a default or let it be undefined based on your model requirements
      level: 1,
      points: 0,
      carType: carType || 'Unknown',  // Provide a default or let it be undefined
      tokens: []
    });
    const savedUser = await newUser.save();
    console.log("newUser:", savedUser);
    res.status(200).json({
      message: "User created successfully",
      data: savedUser
    });
   } catch (error) {
    console.error("Error saving user:", error);
    sendError(res, "Failed to create user");  }
};

function sendError(res, msg = "Invalid request") {
  return res.status(400).send({
    status: "error",
    message: msg,
  });
}

const login = async (req: Request, res: Response): Promise<void> => {
  {
    console.log("Login route");
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
        .send({ accessToken: accessToken, refreshToken: refreshToken, userId: user._id});
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
  console.log("Refresh token route");
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
      console.log("New access:", accessToken);
      console.log("New refresh:", refreshToken);
      res.status(200).send({ accessToken, refreshToken: refreshToken });
    } catch (err) {
      console.error("Error saving the user:", err);
      res.status(403).send(err.message);
    }
  });
};

const logout = async (req: Request, res: Response): Promise<void> => {
  console.log("Logout route");
  const token = req.body.refreshToken;
  console.log("Token:", token);
  if (!token) {
    res.sendStatus(401);
  }

  try {
    const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || !user.tokens.includes(token)) {
      res.status(404).send("User not found or token invalid.");
    }
    user.tokens = user.tokens.filter((t) => t !== token);
    await user.save();
    console.log("User logged out successfully");
    res.sendStatus(200);
  } catch (err) {
    console.error("Error logging out or verifying token:", err);

    if (!res.headersSent) {
       res.status(403).send(err.message);
    }
  }
};

const client = new OAuth2Client();

async function verifyGoogleToken(token) {
  try {
    console.log("Verifying google token");
    console.log("Token:", token);
    console.log("Client:", client);
    console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [process.env.GOOGLE_CLIENT_ID_AN,process.env.GOOGLE_CLIENT_ID_WEB]
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}
const googleLogin = async (req: Request, res: Response): Promise<void> => {
  console.log("Google login route");
  const { idToken, user } = req.body;
  console.log("user:", user);

  if (!idToken) {
    return sendError(res, "Invalid request");
  }
  const googleUser = await verifyGoogleToken(idToken);
  console.log("googleUser:", googleUser);
  if (googleUser.error) {
    return sendError(res, googleUser.error);
  }

  const { email, given_name, family_name, picture } = googleUser.payload;
  if (!email || !given_name || !family_name) {
    return sendError(res, "Missing required fields");
  }
  try { 
      let existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
         let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(user.id, salt);
   
        console.log("User does not exist. Creating user");
        const newUser = new User({
          firstName: given_name,
          lastName: family_name,
          email: email,
          passwordHash: hashedPassword,
          profilePicture: picture || '',
          level: 1,
          points: 0,
          carType: 'Hatchback',
          tokens: []
        });
        
   
        const savedUser = await newUser.save();
        console.log("newUser:", savedUser);

        const { accessToken, refreshToken } = generateTokens(savedUser._id.toString());
        savedUser.tokens.push(refreshToken);
        await savedUser.save();
        res.status(200).json({
          message: "User created successfully",
          data: savedUser,
          accessToken: accessToken,
          refreshToken: refreshToken,
          
          userId: savedUser._id
        });
      } else {
    console.log("User:", existingUser);
      const { accessToken, refreshToken } = generateTokens(existingUser._id.toString());
      if (existingUser.tokens) {
        existingUser.tokens = [refreshToken];
      } else {
        existingUser.tokens.push(refreshToken);
      }
      await existingUser.save();
      res
        .status(200)
        .send({ accessToken: accessToken, refreshToken: refreshToken, userId: existingUser._id});
    }
  }
  catch (error) {
    console.error("Error saving user:", error);
    sendError(res, "Failed to create user");
  }
};


export default {
  login,
  register,
  refreshToken,
  logout,
  googleLogin
};
