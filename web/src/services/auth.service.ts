import api from "./api";
import type { User } from "../types/user";

interface AuthResponse {
  token: string;
  user: User;
}

export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
};

export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/register", { firstName, lastName, email, password });
  return data;
};

export const adminLogin = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/admin/login", { email, password });
  return data;
};