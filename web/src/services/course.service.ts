import api from "./api";
import type { Course } from "../types/course";

// Lecturer: create course (POST /courses)
export const createCourse = async (body: { title: string; code: string; description: string }) => {
  const { data } = await api.post<Course>("/courses", body);
  return data;
};

// Lecturer: get my courses (GET /courses/my)
export const getMyCourses = async () => {
  const { data } = await api.get<Course[]>("/courses/my");
  return data;
};

// Any auth user: get single course (GET /courses/:id)
export const getCourseById = async (id: string) => {
  const { data } = await api.get<Course>(`/courses/${id}`);
  return data;
};

export const getAllCourses = async () => {
  const { data } = await api.get<Course[]>('/courses/all');
  return data;
};

export const getMyStudentCourses = async () => {
  const { data } = await api.get<Course[]>('/courses/mine');
  return data;
};

export const getCourseByCode = async (code: string) => {
  const { data } = await api.get<Course>(`/courses/code/${encodeURIComponent(code)}`);
  return data;
};

// Lecturer: update course (PUT /courses/:id)
export const updateCourse = async (id: string, body: Partial<{ title: string; code: string; description: string }>) => {
  const { data } = await api.put<Course>(`/courses/${id}`, body);
  return data;
};

// Lecturer: delete course (DELETE /courses/:id)
export const deleteCourse = async (id: string) => {
  await api.delete(`/courses/${id}`);
};

// Student: enroll (POST /courses/:id/enroll)
export const enrollCourse = async (id: string) => {
  const { data } = await api.post<Course>(`/courses/${id}/enroll`);
  return data;
};

// Student: unenroll (POST /courses/:id/unenroll)
export const unenrollCourse = async (id: string) => {
  await api.post(`/courses/${id}/unenroll`);
};

export const enrollCourseByCode = async (code: string) => {
  const { data } = await api.post<Course>('/courses/enroll', { code });
  return data;
};
