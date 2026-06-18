import mongoose from "mongoose";
import Course from "./course.model";

export const createCourse = async (
  title: string,
  code: string,
  description: string,
  lecturerId: string
) => {
  const existing = await Course.findOne({ code });

  if (existing) {
    throw new Error("Course code already exists");
  }

  return await Course.create({
    title,
    code,
    description,
    lecturer: lecturerId,
  });
};

export const getLecturerCourses = async (lecturerId: string) => {
  return await Course.find({ lecturer: lecturerId });
};

export const getAllCourses = async () => {
  return await Course.find().populate("lecturer", "firstName lastName email role");
};

export const getStudentCourses = async (studentId: string) => {
  return await Course.find({ students: studentId }).populate("lecturer", "firstName lastName email role");
};

export const getCourseByCode = async (code: string) => {
  const course = await Course.findOne({ code }).populate("lecturer", "firstName lastName email role");

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

export const getCourseById = async (courseId: string, userId: string, userRole: string) => {
  const course = await Course.findById(courseId)
    .populate("lecturer", "firstName lastName");

  if (!course) {
    throw new Error("Course not found");
  }

  // lecturers can always view their own course
  if (userRole === "lecturer") {
    return course;
  }

  // students must be enrolled
  const isEnrolled = course.students.some(
    (id) => id.toString() === userId
  );

  if (!isEnrolled) {
    throw new Error("You are not enrolled in this course");
  }

  return course;
};

export const updateCourse = async (
  courseId: string,
  lecturerId: string,
  data: any
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.lecturer.toString() !== lecturerId) {
    throw new Error("Not allowed to update this course");
  }

  const safeData: {
    title?: string;
    code?: string;
    description?: string;
  } = {};

  if (typeof data.title === "string") {
    safeData.title = data.title;
  }

  if (typeof data.code === "string") {
    safeData.code = data.code;
  }

  if (typeof data.description === "string") {
    safeData.description = data.description;
  }

  return await Course.findByIdAndUpdate(courseId, safeData, {
    new: true,
    runValidators: true,
  });
};

export const deleteCourse = async (
  courseId: string,
  lecturerId: string
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.lecturer.toString() !== lecturerId) {
    throw new Error("Not allowed to delete this course");
  }

  await course.deleteOne();

  return { message: "Course deleted" };
};

export const enrollCourse = async (
  courseId: string,
  studentId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const alreadyEnrolled = course.students.some(
    (id) => id.toString() === studentId
  );

  if (alreadyEnrolled) {
    throw new Error("Already enrolled");
  }

  course.students.push(new mongoose.Types.ObjectId(studentId));

  await course.save();

  return course;
};

export const enrollCourseByCode = async (
  courseCode: string,
  studentId: string
) => {
  const course = await Course.findOne({ code: courseCode });

  if (!course) {
    throw new Error("Course not found");
  }

  return await enrollCourse(course._id.toString(), studentId);
};

export const unenrollCourse = async (
  courseId: string,
  studentId: string
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  course.students = course.students.filter(
    (id) => id.toString() !== studentId
  );

  await course.save();

  return { message: "Unenrolled successfully" };
};