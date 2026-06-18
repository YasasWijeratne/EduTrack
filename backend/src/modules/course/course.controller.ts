import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createCourse,
  getLecturerCourses,
  getAllCourses,
  getStudentCourses,
  getCourseById,
  getCourseByCode,
  updateCourse,
  deleteCourse,
  enrollCourse,
  enrollCourseByCode,
  unenrollCourse,
} from "./course.service";

const getCourseIdFromParams = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid course id");
  }

  return id;
};

export const create = async (req: Request, res: Response) => {
  try {
    const { title, code, description } = req.body;

    const course = await createCourse(
      title,
      code,
      description,
      req.user!.userId
    );

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getMyCourses = async (req: Request, res: Response) => {
  const courses = await getLecturerCourses(req.user!.userId);
  res.json(courses);
};

export const getAll = async (_req: Request, res: Response) => {
  const courses = await getAllCourses();
  res.json(courses);
};

export const getMineAsStudent = async (req: Request, res: Response) => {
  const courses = await getStudentCourses(req.user!.userId);
  res.json(courses);
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id as string;

    const course = await getCourseById(
      courseId,
      req.user!.userId,
      req.user!.role
    );

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getOneByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params as { code: string };
    const course = await getCourseByCode(code);
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const courseId = getCourseIdFromParams(req);

    const course = await updateCourse(
      courseId,
      req.user!.userId,
      req.body
    );

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const courseId = getCourseIdFromParams(req);

    const result = await deleteCourse(
      courseId,
      req.user!.userId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const enroll = async (req: Request, res: Response) => {
  try {
    const courseId = getCourseIdFromParams(req);
    const course = await enrollCourse(
      courseId,
      req.user!.userId
    );

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const enrollByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const course = await enrollCourseByCode(code, req.user!.userId);
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const unenroll = async (req: Request, res: Response) => {
  try {
    const courseId = getCourseIdFromParams(req);
    const result = await unenrollCourse(
      courseId,
      req.user!.userId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};