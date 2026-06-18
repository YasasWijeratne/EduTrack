import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getCoursesForAdmin,
  getDashboardStats,
  getUsersByRole,
  createUserByAdmin,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "./admin.service";

const getUserIdFromParams = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user id");
  }

  return id;
};

export const dashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load admin stats",
    });
  }
};

export const usersByRole = async (req: Request, res: Response) => {
  try {
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const users = await getUsersByRole(role);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load users",
    });
  }
};

export const coursesForAdmin = async (_req: Request, res: Response) => {
  try {
    const courses = await getCoursesForAdmin();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load courses",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await createUserByAdmin(
      firstName,
      lastName,
      email,
      password,
      role
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create user",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromParams(req);
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to load user",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromParams(req);
    const user = await updateUserByAdmin(userId, req.user!.userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromParams(req);
    const result = await deleteUserByAdmin(userId, req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
};
