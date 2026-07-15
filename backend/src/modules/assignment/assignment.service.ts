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
  courseId: string,
  userId: string,
  userRole: string
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (userRole === "student") {
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId
    );

    if (!isEnrolled) {
      throw new Error("You are not enrolled in this course");
    }

    return await Assignment.find({
      course: courseId,
    });
  }

  if (userRole === "lecturer") {
    if (course.lecturer.toString() !== userId) {
      throw new Error("Not allowed to view assignments for this course");
    }

    return await Assignment.find({
      course: courseId,
    });
  }

  if (userRole === "admin") {
    return await Assignment.find({
      course: courseId,
    });
  }

  throw new Error("Not allowed to view assignments for this course");
};

export const getAssignmentsByCourseCode = async (
  courseCode: string,
  userId: string,
  userRole: string
) => {
  const course = await Course.findOne({ code: courseCode });

  if (!course) {
    throw new Error("Course not found");
  }

  return await getAssignmentsByCourse(
    course._id.toString(),
    userId,
    userRole
  );
};

export const getAssignmentById = async (
  assignmentId: string,
  userId: string,
  userRole: string
) => {
  const assignment = await Assignment.findById(assignmentId).populate(
    "course",
    "title code lecturer students"
  );

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const course = await Course.findById(assignment.course);

  if (!course) {
    throw new Error("Course not found");
  }

  if (userRole === "admin") {
    return assignment;
  }

  if (userRole === "lecturer") {
    if (course.lecturer.toString() !== userId) {
      throw new Error("Not allowed to view this assignment");
    }

    return assignment;
  }

  if (userRole === "student") {
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId
    );

    if (!isEnrolled) {
      throw new Error("You are not enrolled in this course");
    }

    return assignment;
  }

  throw new Error("Not allowed");
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