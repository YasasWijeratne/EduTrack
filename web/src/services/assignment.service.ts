import api from "./api";
import type { Assignment } from "../types/assignment";

// Lecturer: create assignment (POST /assignments)
export const createAssignment = async (body: { title: string; description: string; dueDate: string; courseId: string }) => {
  const { data } = await api.post<Assignment>("/assignments", body);
  return data;
};

// Lecturer: get my assignments (GET /assignments/my)
export const getMyAssignments = async () => {
  const { data } = await api.get<Assignment[]>("/assignments/my");
  return data;
};

// Any auth user: get assignments by course (GET /assignments/course/:courseId)
export const getAssignmentsByCourse = async (courseId: string) => {
  const { data } = await api.get<Assignment[]>(`/assignments/course/${courseId}`);
  return data;
};

export const getAssignmentsByCourseCode = async (code: string) => {
  const { data } = await api.get<Assignment[]>(`/assignments/course-code/${encodeURIComponent(code)}`);
  return data;
};

// Lecturer: update assignment (PUT /assignments/:id)
export const updateAssignment = async (id: string, body: Partial<{ title: string; description: string; dueDate: string }>) => {
  const { data } = await api.put<Assignment>(`/assignments/${id}`, body);
  return data;
};

// Lecturer: delete assignment (DELETE /assignments/:id)
export const deleteAssignment = async (id: string) => {
  await api.delete(`/assignments/${id}`);
};
