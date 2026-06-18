import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import StudentRoute from "./routes/StudentRoute";
import LecturerRoute from "./routes/LecturerRoute";
import AdminRoute from "./routes/AdminRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import LandingPage from "./pages/LandingPage";

import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/Assignments";
import StudentGrades from "./pages/student/Grades";
import StudentResults from "./pages/student/Results";
import StudentSubmissions from "./pages/student/Submissions";

import LecturerDashboard from "./pages/lecturer/Dashboard";
import LecturerCourses from "./pages/lecturer/Courses";
import LecturerAssignments from "./pages/lecturer/Assignments";
import LecturerSubmissions from "./pages/lecturer/Submissions";
import LecturerGradeSubmission from "./pages/lecturer/GradeSubmission";
import LecturerResults from "./pages/lecturer/Results";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminLecturers from "./pages/admin/Lecturers";
import AdminAdmins from "./pages/admin/Admins";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        {/* Public */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
        </Route>

        {/* Protected */}

        <Route element={<ProtectedRoute />}>

          {/* Student */}

          <Route element={<StudentRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/student/dashboard"
                element={<StudentDashboard />}
              />

              <Route
                path="/student/courses"
                element={<StudentCourses />}
              />

              <Route
                path="/student/assignments"
                element={<StudentAssignments />}
              />

              <Route
                path="/student/submissions"
                element={<StudentSubmissions />}
              />

              <Route
                path="/student/grades"
                element={<StudentGrades />}
              />

              <Route
                path="/student/results"
                element={<StudentResults />}
              />

            </Route>
          </Route>

          {/* Lecturer */}

          <Route element={<LecturerRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/lecturer/dashboard"
                element={<LecturerDashboard />}
              />

              <Route
                path="/lecturer/courses"
                element={<LecturerCourses />}
              />

              <Route
                path="/lecturer/assignments"
                element={<LecturerAssignments />}
              />

              <Route
                path="/lecturer/submissions"
                element={<LecturerSubmissions />}
              />

              <Route
                path="/lecturer/grade"
                element={<LecturerGradeSubmission />}
              />

              <Route
                path="/lecturer/results"
                element={<LecturerResults />}
              />

            </Route>
          </Route>

          {/* Admin */}

          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/courses"
                element={<AdminCourses />}
              />

              <Route
                path="/admin/lecturers"
                element={<AdminLecturers />}
              />

              <Route
                path="/admin/admins"
                element={<AdminAdmins />}
              />

            </Route>
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}