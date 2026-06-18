import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Shield, Activity, Terminal, ArrowRight, Settings, Server } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboardStats, type AdminDashboardStats } from "../../services/admin.service";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      {/* Welcome Section */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
          LMS Control Center
        </h2>
        <p className="text-on-surface-variant text-sm">
          System Administration • Welcome back, {user?.firstName || "Administrator"}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {loading ? "Loading" : `${stats?.totalCourses ?? 0} Total`}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Global Directory
          </p>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              {loading ? "..." : `${stats?.totalCourses ?? 0} Courses`}
            </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
              {loading ? "Loading" : `${stats?.totalLecturers ?? 0} Faculty`}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Academic Staff
          </p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            {loading ? "..." : `${stats?.totalLecturers ?? 0} Lecturers`}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 rounded-xl text-[#D97706]">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {loading ? "Loading" : `${stats?.totalAdmins ?? 0} Total`}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Security Groups
          </p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            {loading ? "..." : `${stats?.totalAdmins ?? 0} Admins`}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-green-50 rounded-xl text-green-700">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
              {loading ? "Loading" : `${stats?.totalActiveUsers ?? 0} Active`}
            </span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            System Status
          </p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            {loading ? "..." : "Healthy"}
          </h3>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow flex-1">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">
              Control Panel
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/courses"
                className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant hover:border-primary transition-all group cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                    Course Registry
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Search and audit database courses
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/lecturers"
                className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant hover:border-primary transition-all group cursor-pointer"
              >
                <Users className="w-5 h-5 text-secondary shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                    Manage Lecturers
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Faculty rosters and assignments
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/admin/admins"
                className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant hover:border-primary transition-all group cursor-pointer"
              >
                <Shield className="w-5 h-5 text-[#D97706] shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                    Administrator Group
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Superusers access credentials
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Logs / Settings panel */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-outline" />
                  <span>Activity Logs & Audits</span>
                </h3>
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                  Real-time
                </span>
              </div>

              <div className="space-y-3 font-mono text-[11px] text-on-surface-variant bg-surface p-4 rounded-xl border border-outline-variant">
                <div className="flex justify-between text-outline">
                  <span>[INFO] Dashboard synced with live admin API</span>
                  <span>OK</span>
                </div>
                <div className="flex justify-between">
                  <span>[AUTH] Admin session initialized successfully</span>
                  <span className="text-green-600 font-bold">GRANTED</span>
                </div>
                <div className="flex justify-between">
                  <span>[API] Users: {stats?.totalActiveUsers ?? 0} active account(s)</span>
                  <span className="text-primary font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between">
                  <span>[API] Courses: {stats?.totalCourses ?? 0}, Lecturers: {stats?.totalLecturers ?? 0}</span>
                  <span className="text-primary font-bold">LIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4 flex items-center justify-between text-xs text-outline">
              <span className="flex items-center gap-1.5 font-medium">
                <Server className="w-3.5 h-3.5" />
                EduTrack Cluster Nodes (Active: 1/1)
              </span>
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer font-bold">
                <Settings className="w-3.5 h-3.5" />
                Service Settings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

