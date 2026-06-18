import { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createGrade,
  getStudentGrades,
  getAssignmentGrades,
  getCourseResult,
  getCourseResultByCode,
  updateGrade,
} from "./grade.service";


const getIdFromParams = (
  req: Request,
  key: string
): string => {
  const id = req.params[key];

  if (
    typeof id !== "string" ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new Error(`Invalid ${key}`);
  }

  return id;
};


export const grade = async (
  req: Request,
  res: Response
) => {
  try {
    const submissionId = getIdFromParams(
      req,
      "submissionId"
    );

    const { marks } = req.body;

    const result = await createGrade(
      submissionId,
      marks,
      req.user!.userId
    );

    res.json(result);

  } catch (err) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
};


export const updateGradeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const submissionId = getIdFromParams(req, "submissionId");
    const { marks } = req.body;

    const result = await updateGrade(
      submissionId,
      marks,
      req.user!.userId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
};


export const getMine = async (
  req: Request,
  res: Response
) => {
  try {

    const result = await getStudentGrades(
      req.user!.userId
    );

    res.json(result);

  } catch (err) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
};


export const getByAssignment = async (
  req: Request,
  res: Response
) => {
  try {

    const assignmentId = getIdFromParams(
      req,
      "assignmentId"
    );

    const result = await getAssignmentGrades(
      assignmentId,
      req.user!.userId
    );

    res.json(result);

  } catch (err) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
};

export const getCourseResults = async (
  req: Request,
  res: Response
) => {

  try {

    const courseId =
      getIdFromParams(
        req,
        "courseId"
      );


    const result =
      await getCourseResult(
        courseId,
        req.user!.userId,
        req.user!.role
      );


    res.json(result);


  } catch(err){

    res.status(400).json({
      message:(err as Error).message
    });

  }

};

export const getCourseResultsByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.params as { code: string };
    const result = await getCourseResultByCode(code, req.user!.userId, req.user!.role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};