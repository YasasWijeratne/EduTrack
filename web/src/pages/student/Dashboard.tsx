import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyGrades } from "../../services/grade.service";
import type { Grade } from "../../types/grade";
import { BookOpen, FileText, Upload, Award, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGrades()
      .then(setGrades)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalSubmissions = grades.length; // Approximate from graded items
  const averageMarks = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.marks, 0) / grades.length) 
    : 0;

  const getPerformanceMessage = (avg: number) => {
    if (avg >= 85) return "Keep up the excellent work!";
    if (avg >= 70) return "You are doing great this semester.";
    if (avg >= 50) return "Good progress, keep improving.";
    return "Consider scheduling study hours to boost grades.";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      {/* Welcome Section */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-on-surface-variant text-sm">
          {grades.length > 0 
            ? `Your overall average is ${averageMarks}%. ${getPerformanceMessage(averageMarks)}`
            : "Access your courses, assignments, and grades directly from your dashboard."
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">Active</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">My Portal</p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">EduTrack</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tasks</p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">Assignments</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-[#D97706]">
              <Upload className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Evaluations</p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">{totalSubmissions} Graded</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow card-hover">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-700">
              <Award className="w-5 h-5" />
            </div>
            {averageMarks > 0 && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {averageMarks >= 45 ? "Passing" : "Critical"}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Average Score</p>
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            {grades.length > 0 ? `${averageMarks}%` : "No Grades"}
          </h3>
        </div>
      </div>

      {/* Bento Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions panel (Left Column) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface">Quick Links</h3>
            </div>
            <div className="space-y-3">
              <Link to="/student/courses" className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-outline-variant hover:border-primary transition-all group">
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">Course Enrollment</h4>
                  <p className="text-[11px] text-on-surface-variant">Join classes with a course code</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/student/submissions" className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-outline-variant hover:border-primary transition-all group">
                <Upload className="w-5 h-5 text-[#D97706] shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">Upload Submission</h4>
                  <p className="text-[11px] text-on-surface-variant">Turn in assignment drafts</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/student/grades" className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-outline-variant hover:border-primary transition-all group">
                <Award className="w-5 h-5 text-green-700 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">Grade History</h4>
                  <p className="text-[11px] text-on-surface-variant">Review scores and comments</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Grades (Right Column) */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant custom-shadow overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-on-surface">Recent Evaluations</h3>
              <Link to="/student/grades" className="text-primary font-bold text-xs hover:underline">
                View All
              </Link>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-on-surface-variant">Loading grades...</div>
              ) : grades.length === 0 ? (
                <div className="p-8 text-center text-sm text-on-surface-variant italic">
                  No graded items recorded yet.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F1F5F9]">
                      <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase">Assignment</th>
                      <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase">Date</th>
                      <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase">Score</th>
                      <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {grades.slice(0, 5).map((g) => {
                      const sub = typeof g.submission === "object" ? g.submission : null;
                      const assign = sub && typeof sub.assignment === "object" ? sub.assignment : null;
                      const isPass = g.marks >= 45;

                      return (
                        <tr key={g._id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-xs text-on-surface block">
                              {assign?.title || "Assignment"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-on-surface-variant">
                            {new Date(g.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-bold text-xs text-on-surface">
                            {g.marks}/100
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                              isPass 
                                ? "bg-green-50 text-green-600" 
                                : "bg-red-50 text-red-600"
                            }`}>
                              {g.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
