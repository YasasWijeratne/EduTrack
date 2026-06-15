import Assignment from "./assignment.model";
import Course from "../course/course.model";

export const createAssignment = async (
  title: string,
  description: string,
  dueDate: Date,
  courseId: string,
  lecturerId: string
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.lecturer.toString() !== lecturerId) {
    throw new Error(
      "You can only create assignments for your own courses"
    );
  }

  return await Assignment.create({
    title,
    description,
    dueDate,
    course: courseId,
    createdBy: lecturerId,
  });
};

export const getLecturerAssignments = async (
  lecturerId: string
) => {
  return await Assignment.find({
    createdBy: lecturerId,
  }).populate("course", "title code");
};

export const getAssignmentsByCourse = async (
  courseId: string
) => {
  return await Assignment.find({
    course: courseId,
  });
};

export const updateAssignment = async (
  assignmentId: string,
  lecturerId: string,
  data: any
) => {
  const assignment = await Assignment.findById(
    assignmentId
  );

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (
    assignment.createdBy.toString() !== lecturerId
  ) {
    throw new Error(
      "Not allowed to update this assignment"
    );
  }

  const safeData: {
    title?: string;
    description?: string;
    dueDate?: Date;
  } = {};

  if (typeof data.title === "string") {
    safeData.title = data.title;
  }

  if (typeof data.description === "string") {
    safeData.description = data.description;
  }

  if (data.dueDate) {
    safeData.dueDate = data.dueDate;
  }

  return await Assignment.findByIdAndUpdate(
    assignmentId,
    safeData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteAssignment = async (
  assignmentId: string,
  lecturerId: string
) => {
  const assignment = await Assignment.findById(
    assignmentId
  );

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (
    assignment.createdBy.toString() !== lecturerId
  ) {
    throw new Error(
      "Not allowed to delete this assignment"
    );
  }

  await assignment.deleteOne();

  return {
    message: "Assignment deleted",
  };
};