import { useEffect, useState } from "react";
import { getCourseResultsByCode } from "../../services/grade.service";
import { getMyStudentCourses } from "../../services/course.service";
import type { Course } from "../../types/course";
import type { CourseResult } from "../../types/grade";
import { Percent, Award, ClipboardList, ShieldAlert, Sparkles } from "lucide-react";

export default function Results() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [result, setResult] = useState<CourseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyStudentCourses()
      .then((data) => {
        setCourses(data);
        setSelectedCourseCode(data[0]?.code || "");
      })
      .catch(console.error);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseCode.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await getCourseResultsByCode(selectedCourseCode.trim());
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Course Results</h1>
        <p className="text-on-surface-variant text-sm">Retrieve final aggregated outcomes for a specific enrolled class.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant custom-shadow">
        <form onSubmit={handleSearch} className="flex gap-3">
          <select
            className="w-full bg-surface-container h-11 px-4 rounded-lg border-none focus:ring-2 focus:ring-primary font-body text-sm outline-none transition-all"
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            required
            disabled={courses.length === 0}
          >
            {courses.length === 0 && <option value="">No enrolled courses available</option>}
            {courses.map((course) => (
              <option key={course._id} value={course.code}>
                {course.title} ({course.code})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary px-6 h-11 rounded-lg text-xs font-bold hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Calculating..." : "View Results"}
          </button>
        </form>
        {error && <p className="text-xs text-red-600 font-semibold mt-3">{error}</p>}
      </div>

      {result && (
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant custom-shadow space-y-6">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">{result.course}</h2>
              <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-0.5">Final Outcome Statement</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
              result.status === "Pass" 
                ? "bg-green-50 text-green-600 border-green-200/50" 
                : "bg-red-50 text-red-600 border-red-200/50"
            }`}>
              {result.status}
            </span>
          </div>

          {result.message && (
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 flex items-center gap-2 text-amber-700 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{result.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 border border-outline-variant/30 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-bold tracking-wider">Average Marks</p>
                <p className="text-lg font-black text-on-surface">{result.marks}%</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-outline-variant/30 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-bold tracking-wider">Final Grade</p>
                <p className="text-lg font-black text-green-700">{result.grade}</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-outline-variant/30 rounded-lg p-4 flex items-center gap-3 col-span-2">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-outline uppercase font-bold tracking-wider">Performance Rating</p>
                <p className="text-sm font-bold text-on-surface">{result.performance}</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-outline bg-slate-50 p-2.5 rounded-lg text-center font-mono border border-outline-variant/20 flex items-center justify-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Aggregated across {result.assignmentsGraded} graded assignments</span>
          </div>
        </div>
      )}
    </div>
  );
}
