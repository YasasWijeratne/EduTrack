import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, BookOpen, FileText, Upload, Award, BarChart3, Users, Shield, LogOut, GraduationCap, Search, Bell, HelpCircle } from "lucide-react";

const studentLinks = [
  { path: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/student/courses", label: "Courses", icon: BookOpen },
  { path: "/student/assignments", label: "Assignments", icon: FileText },
  { path: "/student/submissions", label: "Submissions", icon: Upload },
  { path: "/student/grades", label: "Grades", icon: Award },
  { path: "/student/results", label: "Results", icon: BarChart3 },
];

const lecturerLinks = [
  { path: "/lecturer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lecturer/courses", label: "Courses", icon: BookOpen },
  { path: "/lecturer/assignments", label: "Assignments", icon: FileText },
  { path: "/lecturer/submissions", label: "Submissions", icon: Upload },
  { path: "/lecturer/grade", label: "Grade", icon: Award },
  { path: "/lecturer/results", label: "Results", icon: BarChart3 },
];

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/courses", label: "Courses", icon: BookOpen },
  { path: "/admin/lecturers", label: "Lecturers", icon: Users },
  { path: "/admin/admins", label: "Admins", icon: Shield },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "student" ? studentLinks
    : user?.role === "lecturer" ? lecturerLinks
    : user?.role === "admin" ? adminLinks
    : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userAvatarInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen left-0 w-64 bg-surface-container-low border-r border-outline-variant py-6 px-4 fixed z-20 shrink-0">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-xl font-black text-primary tracking-tight">EduTrack</h1>
          </div>
          <p className="font-body text-xs text-on-surface-variant opacity-70 font-semibold uppercase tracking-wider">University Portal</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Main Menu</p>
            <div className="space-y-1">
              {links.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all font-semibold active:scale-95 duration-150 ${
                      isActive
                        ? "bg-secondary-container text-on-secondary-container shadow-sm font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-outline-variant pt-6 space-y-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-error-container/20 transition-all active:scale-95 duration-150"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="mt-4 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-on-surface-variant">SYSTEM STATUS</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            All nodes operating normally. Secure SSL active.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* TopNavBar */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-10 shrink-0">
          <div className="flex justify-between items-center w-full px-6 max-w-container-max mx-auto h-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search courses, grades..."
                  className="w-full bg-surface-container h-10 pl-10 pr-4 rounded-lg border-none focus:ring-2 focus:ring-primary font-body text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant cursor-pointer">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-outline-variant mx-1"></div>

              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm text-on-surface leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-medium capitalize">
                    {user?.role} Portal
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm font-headline shadow-sm shrink-0">
                  {userAvatarInitials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Wrapper */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-container-max mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}