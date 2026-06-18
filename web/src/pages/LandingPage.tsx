import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  const dashboardPath = user
    ? user.role === "student" ? "/student/dashboard"
    : user.role === "lecturer" ? "/lecturer/dashboard"
    : "/admin/dashboard"
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body">
      {/* Nav */}
      <nav className="w-full bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-headline font-black text-primary tracking-tight">EduTrack</span>
          </div>
          <div className="flex items-center gap-4">
            {dashboardPath ? (
              <Link to={dashboardPath} className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant hover:text-on-surface font-semibold text-sm transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 max-w-6xl mx-auto px-8 py-20 text-center flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/50 text-xs font-bold text-primary mb-6">
          <GraduationCap className="w-4 h-4" />
          <span>v4.2.0-stable release active</span>
        </div>
        <h1 className="font-headline text-5xl font-extrabold text-on-background leading-tight mb-6 tracking-tight">
          Modern Education<br />
          <span className="text-primary">Management Platform</span>
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Streamline course management, assignments, submissions, and grading — all in one place.
          Built for students, lecturers, and administrators.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-md">
            Sign Up Free
          </Link>
          <Link to="/login" className="bg-surface-container-lowest text-on-surface px-8 py-3 rounded-lg font-bold border border-outline-variant hover:bg-surface-container-low active:scale-95 transition-all">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant custom-shadow card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Course Management</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Create courses, enroll students, and manage your entire curriculum effortlessly.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant custom-shadow card-hover">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-5 text-[#059669]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Assignments &amp; Submissions</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Assign work with deadlines, collect submissions, and track student progress.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant custom-shadow card-hover">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-5 text-[#D97706]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Grading &amp; Results</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Grade submissions, automatically calculate letter grades, and view course results.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant bg-surface-container-lowest text-center text-xs text-outline">
        © 2026 EduTrack LMS. Institutional access provided by University of Technology.
      </footer>
    </div>
  );
}
