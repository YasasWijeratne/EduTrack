import api from "./api";
import type { Course } from "../types/course";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courseCount?: number;
}

export interface AdminDashboardStats {
  totalCourses: number;
  totalLecturers: number;
  totalAdmins: number;
  totalActiveUsers: number;
}

export interface AdminCourse extends Omit<Course, "lecturer"> {
  lecturer: string | { _id: string; firstName: string; lastName: string; email: string; role: string };
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "lecturer" | "admin";
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export const getAdminDashboardStats = async () => {
  const { data } = await api.get<AdminDashboardStats>("/admin/dashboard/stats");
  return data;
};

export const getUsersByRole = async (role?: "student" | "lecturer" | "admin") => {
  const { data } = await api.get<AdminUser[]>("/admin/users", {
    params: role ? { role } : undefined,
  });
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get<AdminUser>(`/admin/users/${id}`);
  return data;
};

export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await api.post<AdminUser>("/admin/users", payload);
  return data;
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const { data } = await api.put<AdminUser>(`/admin/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/admin/users/${id}`);
};

export const getAdminCourses = async () => {
  const { data } = await api.get<AdminCourse[]>("/admin/courses");
  return data;
};
