import { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createAssignment,
  getLecturerAssignments,
  getAssignmentsByCourse,
  getAssignmentsByCourseCode,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "./assignment.service";

const getIdFromParams = (
  req: Request,
  paramName: string
): string => {
  const id = req.params[paramName];

  if (
    typeof id !== "string" ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(`Invalid ${paramName}`);
  }

  return id;
};

export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      dueDate,
      courseId,
    } = req.body;

    const assignment = await createAssignment(
      title,
      description,
      dueDate,
      courseId,
      req.user!.userId
    );

    res.status(201).json(assignment);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};

export const getMyAssignments = async (
  req: Request,
  res: Response
) => {
  try {
    const assignments =
      await getLecturerAssignments(
        req.user!.userId
      );

    res.json(assignments);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};

export const getByCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const courseId = getIdFromParams(
      req,
      "courseId"
    );

    const assignments =
      await getAssignmentsByCourse(
        courseId,
        req.user!.userId,
        req.user!.role
      );

    res.json(assignments);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};

export const getByCourseCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.params as { code: string };
    const assignments = await getAssignmentsByCourseCode(
      code,
      req.user!.userId,
      req.user!.role
    );
    res.json(assignments);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getOne = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = getIdFromParams(req, "id");

    const assignment = await getAssignmentById(
      assignmentId,
      req.user!.userId,
      req.user!.role
    );

    res.json(assignment);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};

export const update = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = getIdFromParams(
      req,
      "id"
    );

    const assignment =
      await updateAssignment(
        assignmentId,
        req.user!.userId,
        req.body
      );

    res.json(assignment);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};

export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = getIdFromParams(
      req,
      "id"
    );

    const result = await deleteAssignment(
      assignmentId,
      req.user!.userId
    );

    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ message: (err as Error).message });
  }
};