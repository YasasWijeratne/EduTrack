import api from "./api";
import type { Grade, CourseResult } from "../types/grade";

// Lecturer: grade a submission (POST /grades/submission/:submissionId)
export const gradeSubmission = async (submissionId: string, marks: number) => {
  const { data } = await api.post<Grade>(`/grades/submission/${submissionId}`, { marks });
  return data;
};

// Lecturer: update grade (PUT /grades/submission/:submissionId)
export const updateGrade = async (submissionId: string, marks: number) => {
  const { data } = await api.put<Grade>(`/grades/submission/${submissionId}`, { marks });
  return data;
};

// Student: get my grades (GET /grades/my)
export const getMyGrades = async () => {
  const { data } = await api.get<Grade[]>("/grades/my");
  return data;
};

// Lecturer: get grades for an assignment (GET /grades/assignment/:assignmentId)
export const getAssignmentGrades = async (assignmentId: string) => {
  const { data } = await api.get<Grade[]>(`/grades/assignment/${assignmentId}`);
  return data;
};

// Any auth user: get course results (GET /grades/course/:courseId)
export const getCourseResults = async (courseId: string) => {
  const { data } = await api.get<CourseResult>(`/grades/course/${courseId}`);
  return data;
};

export const getCourseResultsByCode = async (code: string) => {
  const { data } = await api.get<CourseResult>(`/grades/course-code/${encodeURIComponent(code)}`);
  return data;
};
