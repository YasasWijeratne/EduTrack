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

export const getStudentGrades = async (
  studentId:string
) => {

  return await Grade.find({
    student: studentId
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