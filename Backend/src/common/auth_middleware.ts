import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  _id: string;
}

export type AuthRequest = Request & { user: JwtPayload };

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string, // Ensure non-null assertion or provide a fallback
      (err: any, decoded: any) => {
        if (err) {
          return res.sendStatus(403); // Token verification failed
        }
        req.user = decoded as JwtPayload;
        next();
      }
    );
  } catch (error) {
    // Log the error or handle it as per your error-handling logic
    console.error("Authentication Error:", error);
    res.sendStatus(500); // Internal Server Error
  }
};

export default authenticate;
