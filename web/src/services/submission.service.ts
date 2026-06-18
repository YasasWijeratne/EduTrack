import api from "./api";
import type { Submission } from "../types/submission";

// Student: submit (POST /submissions/:assignmentId) - multipart file
export const submitAssignment = async (assignmentId: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<Submission>(`/submissions/${assignmentId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Student: update submission (PUT /submissions/:assignmentId) - multipart file
export const updateSubmission = async (assignmentId: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.put<Submission>(`/submissions/${assignmentId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Student: get my submission for an assignment (GET /submissions/:assignmentId/my)
export const getMySubmission = async (assignmentId: string) => {
  const { data } = await api.get<Submission | null>(`/submissions/${assignmentId}/my`);
  return data;
};

// Lecturer: get all submissions for an assignment (GET /submissions/assignment/:assignmentId)
export const getAssignmentSubmissions = async (assignmentId: string) => {
  const { data } = await api.get<Submission[]>(`/submissions/assignment/${assignmentId}`);
  return data;
};

// Student: delete submission (DELETE /submissions/:assignmentId)
export const deleteSubmission = async (assignmentId: string) => {
  await api.delete(`/submissions/${assignmentId}`);
};
