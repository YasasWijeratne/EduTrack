import Submission from "./submission.model";
import Assignment from "../assignment/assignment.model";
import Course from "../course/course.model";

export const createSubmission = async (
  studentId: string,
  assignmentId: string,
  filePath: string
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  // deadline check
  if (new Date() > assignment.dueDate) {
    throw new Error("Deadline has passed");
  }

  // check course exists
  const course = await Course.findById(assignment.course);

  if (!course) {
    throw new Error("Course not found");
  }

  // check if already submitted (your unique index also protects this)
  const existing = await Submission.findOne({
    student: studentId,
    assignment: assignmentId,
  });

  if (existing) {
    throw new Error("You already submitted this assignment");
  }

  return await Submission.create({
    student: studentId,
    assignment: assignmentId,
    filePath,
  });
};

export const updateSubmission = async (
  studentId: string,
  assignmentId: string,
  filePath: string
) => {
  const submission = await Submission.findOne({
    student: studentId,
    assignment: assignmentId,
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (new Date() > assignment.dueDate) {
    throw new Error("Deadline has passed");
  }

  submission.filePath = filePath;

  await submission.save();

  return submission;
};

export const getMySubmission = async (
  studentId: string,
  assignmentId: string
) => {
  return await Submission.findOne({
    student: studentId,
    assignment: assignmentId,
  }).populate("assignment");
};

export const getAssignmentSubmissions = async (
  assignmentId: string,
  lecturerId: string
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const course = await Course.findById(assignment.course);

  if (!course) {
    throw new Error("Course not found");
  }

  // only lecturer of course can view
  if (course.lecturer.toString() !== lecturerId) {
    throw new Error("Not allowed");
  }

  return await Submission.find({
    assignment: assignmentId,
  }).populate("student", "firstName lastName email");
};