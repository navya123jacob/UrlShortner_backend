import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.body.user = await UserModel.findById(decoded.id).select("-password");
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
