import { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createSubmission,
  updateSubmission,
  getMySubmission,
  getAssignmentSubmissions,
  deleteSubmission,
} from "./submission.service";


const getIdFromParams = (req: Request, key: string): string => {
  const value = req.params[key];

  if (
    typeof value !== "string" ||
    !mongoose.Types.ObjectId.isValid(value)
  ) {
    throw new Error(`Invalid ${key}`);
  }

  return value;
};

const getFilePath = (req: Request) => {
  if (!req.file) {
    throw new Error("File is required");
  }

  return req.file.path;
};

export const submit = async (req: Request, res: Response) => {
  try {
    const assignmentId = getIdFromParams(req, "assignmentId");
    const filePath = getFilePath(req);

    const result = await createSubmission(
      req.user!.userId,
      assignmentId,
      filePath
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const assignmentId = getIdFromParams(req, "assignmentId");
    const filePath = getFilePath(req);

    const result = await updateSubmission(
      req.user!.userId,
      assignmentId,
      filePath
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getMine = async (req: Request, res: Response) => {
  try {
    const assignmentId = getIdFromParams(req, "assignmentId");

    const result = await getMySubmission(
      req.user!.userId,
      assignmentId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllForAssignment = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = getIdFromParams(req, "assignmentId");

    const result = await getAssignmentSubmissions(
      assignmentId,
      req.user!.userId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    const assignmentId = getIdFromParams(
      req,
      "assignmentId"
    );

    const result = await deleteSubmission(
      req.user!.userId,
      assignmentId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
};