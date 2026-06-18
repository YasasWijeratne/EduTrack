import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignmentsByCourseCode } from "../../services/assignment.service";
import { getMyStudentCourses } from "../../services/course.service";
import type { Assignment } from "../../types/assignment";
import type { Course } from "../../types/course";
import { Calendar, ExternalLink, Inbox } from "lucide-react";

export default function Assignments() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
    setLoading(true);
    setError("");
    try {
      const data = await getAssignmentsByCourseCode(selectedCourseCode.trim());
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = useMemo(
    () => courses.find((course) => course.code === selectedCourseCode),
    [courses, selectedCourseCode]
  );

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Assignments</h1>
        <p className="text-on-surface-variant text-sm">Find and complete homework tasks assigned by your lecturers.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant custom-shadow max-w-2xl">
        <h2 className="font-headline text-base font-bold text-on-surface mb-3">View Assignments by Course</h2>
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
            className="bg-primary text-on-primary px-6 h-11 rounded-lg text-xs font-bold hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer shadow-sm animate-all"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p className="text-xs text-red-600 font-semibold mt-3">{error}</p>}
      </div>

      <div className="space-y-4">
        {assignments.map((a) => {
          const overdue = new Date() > new Date(a.dueDate);
          return (
            <div key={a._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant custom-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline font-bold text-on-surface">{a.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    overdue ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    {overdue ? "Overdue" : "Active"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xl">
                  {a.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] text-outline font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {new Date(a.dueDate).toLocaleDateString()} at {new Date(a.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <Link
                  to="/student/submissions"
                  state={{ assignmentId: a._id, assignmentTitle: a.title, courseCode: selectedCourse?.code }}
                  className="bg-primary-container hover:bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 duration-150"
                >
                  <span>Submit Work</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && !loading && selectedCourseCode && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant text-center max-w-2xl">
            <Inbox className="w-8 h-8 text-outline mx-auto mb-2" />
            <p className="text-on-surface-variant text-xs font-semibold">No assignments found for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
}
