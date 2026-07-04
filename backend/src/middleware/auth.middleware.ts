import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../modules/user/user.model";

type UserToken = {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
};

const VALID_ROLES = ["student", "lecturer", "admin"];

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = "";
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token && typeof req.query.token === "string") {
      token = req.query.token;
    }

    if (!token || !token.trim()) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & UserToken;

    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("isActive role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    if (!VALID_ROLES.includes(user.role)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
