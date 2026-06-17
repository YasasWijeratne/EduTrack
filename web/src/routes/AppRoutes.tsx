import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLogin from "../pages/auth/AdminLogin";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PLACEHOLDER DASHBOARD REDIRECTS */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/student/*" element={<DashboardLayout />}>
          <Route path="*" element={<div>Student Area</div>} />
        </Route>

        <Route path="/lecturer/*" element={<DashboardLayout />}>
          <Route path="*" element={<div>Lecturer Area</div>} />
        </Route>

        <Route path="/admin/*" element={<DashboardLayout />}>
          <Route path="*" element={<div>Admin Area</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}