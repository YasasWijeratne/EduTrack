import mongoose from "mongoose";
import Grade from "./grade.model";
import Submission from "../submission/submission.model";
import Assignment from "../assignment/assignment.model";
import Course from "../course/course.model";


const calculateGrade = (marks:number) => {

  if(marks >= 90) return "A+";
  if(marks >= 80) return "A";
  if(marks >= 75) return "A-";
  if(marks >= 70) return "B+";
  if(marks >= 65) return "B";
  if(marks >= 60) return "B-";
  if(marks >= 55) return "C+";
  if(marks >= 45) return "C";
  if(marks >= 40) return "C-";
  if(marks >= 35) return "D+";
  if(marks >= 30) return "D";

  return "E";
};


export const createGrade = async (
  submissionId:string,
  marks:number,
  lecturerId:string
) => {

  const submission =
    await Submission.findById(submissionId);


  if(!submission){
    throw new Error("Submission not found");
  }

  if (marks < 0 || marks > 100) {
     throw new Error("Marks must be between 0 and 100");
  }


  const assignment =
    await Assignment.findById(
      submission.assignment
    );


  if(!assignment){
    throw new Error("Assignment not found");
  }


  const course =
    await Course.findById(
      assignment.course
    );


  if(!course){
    throw new Error("Course not found");
  }


  if(course.lecturer.toString() !== lecturerId){
    throw new Error(
      "Not allowed to grade this submission"
    );
  }


  const existing =
    await Grade.findOne({
      submission: submissionId
    });


  if(existing){
    throw new Error(
      "Already graded"
    );
  }


  return await Grade.create({
    submission: submissionId,
    marks,
    grade: calculateGrade(marks),
    gradedBy: lecturerId
  });

};


export const updateGrade = async (
  submissionId: string,
  marks: number,
  lecturerId: string
) => {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  if (marks < 0 || marks > 100) {
    throw new Error("Marks must be between 0 and 100");
  }

  const assignment = await Assignment.findById(submission.assignment);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const course = await Course.findById(assignment.course);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.lecturer.toString() !== lecturerId) {
    throw new Error("Not allowed to grade this submission");
  }

  const existing = await Grade.findOne({
    submission: submissionId,
  });

  if (!existing) {
    throw new Error("Grade not found");
  }

  existing.marks = marks;
  existing.grade = calculateGrade(marks);
  existing.gradedBy = new mongoose.Types.ObjectId(lecturerId);

  await existing.save();

  return existing;
};

export const getStudentGrades = async (
  studentId:string
) => {

  const submissions =
    await Submission.find({
      student: studentId
    });


  const submissionIds =
    submissions.map(
      submission => submission._id
    );


  if (submissionIds.length === 0) {
    return [];
  }


  return await Grade.find({
    submission:{
      $in: submissionIds
    }
  })
  .populate({
    path:"submission",
    populate:{
      path:"assignment",
      select:"title"
    }
  });

};


export const getAssignmentGrades = async (
  assignmentId:string,
  lecturerId:string
) => {

  const assignment =
    await Assignment.findById(
      assignmentId
    );


  if(!assignment){
    throw new Error(
      "Assignment not found"
    );
  }


  const course =
    await Course.findById(
      assignment.course
    );


  if(!course){
    throw new Error(
      "Course not found"
    );
  }


  if(
    course.lecturer.toString() !== lecturerId
  ){
    throw new Error(
      "Not allowed"
    );
  }


  const submissions =
    await Submission.find({
      assignment: assignmentId
    });


  const submissionIds =
    submissions.map(
      submission => submission._id
    );


  return await Grade.find({
    submission:{
      $in: submissionIds
    }
  })
  .populate(
    "submission"
  );

};

export const getCourseResult = async (
  courseId: string,
  userId: string,
  role: string
) => {

  const course =
    await Course.findById(courseId);


  if (!course) {
    throw new Error(
      "Course not found"
    );
  }


  if (role === "student") {

    const enrolled =
      course.students.some(
        id => id.toString() === userId
      );


    if (!enrolled) {
      throw new Error(
        "You are not enrolled in this course"
      );
    }

  }


  if (role === "lecturer") {

    if (
      course.lecturer.toString() !== userId
    ) {
      throw new Error(
        "Not allowed to view this course results"
      );
    }
  }


  const assignments =
    await Assignment.find({
      course: courseId
    });


  if (assignments.length === 0) {
    return {
      marks: 0,
      grade: "E",
      status: "Fail",
      message: "No assignments available"
    };
  }


  const assignmentIds =
    assignments.map(
      assignment => assignment._id
    );


  const submissions =
    await Submission.find({
      assignment: {
        $in: assignmentIds
      }
    });


  const submissionIds =
    submissions.map(
      submission => submission._id
    );


  const grades =
    await Grade.find({
      submission: {
        $in: submissionIds
      }
    });


  if (grades.length === 0) {
    return {
      marks: 0,
      grade: "E",
      status: "Fail",
      message: "No grades available"
    };
  }


  const total =
    grades.reduce(
      (sum, item) => sum + item.marks,
      0
    );


  const average =
    total / grades.length;


  const finalGrade =
    calculateGrade(average);


  let status =
    "Fail";


  if (average >= 45) {
    status = "Pass";
  }


  let performance = "";


  if (average >= 90) {
    performance = "Excellent";
  }
  else if (average >= 75) {
    performance = "Very Good";
  }
  else if (average >= 60) {
    performance = "Good";
  }
  else if (average >= 45) {
    performance = "Satisfactory";
  }
  else {
    performance = "Needs Improvement";
  }


  return {
    course: course.title,
    assignmentsGraded: grades.length,
    marks: Number(average.toFixed(2)),
    grade: finalGrade,
    status,
    performance
  };

};

export const getCourseResultByCode = async (
  courseCode: string,
  userId: string,
  role: string
) => {
  const course = await Course.findOne({ code: courseCode });

  if (!course) {
    throw new Error("Course not found");
  }

  return await getCourseResult(course._id.toString(), userId, role);
};