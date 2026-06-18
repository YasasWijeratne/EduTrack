import { useEffect, useState } from "react";
import { getMyCourses } from "../../services/course.service";
import { getCourseResultsByCode } from "../../services/grade.service";
import type { Course } from "../../types/course";
import type { CourseResult } from "../../types/grade";
import { BookOpen, TrendingUp, Award, CheckCircle, AlertCircle, BarChart3, ChevronRight } from "lucide-react";

export default function Results() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [results, setResults] = useState<CourseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getMyCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseCode(data[0].code);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCourseCode) return;
    setLoading(true);
    setErrorMsg("");
    setResults(null);
    getCourseResultsByCode(selectedCourseCode)
      .then(setResults)
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load results");
      })
      .finally(() => setLoading(false));
  }, [selectedCourseCode]);

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
          Course Insights
        </h1>
        <p className="text-on-surface-variant text-sm">
          Review academic performance distribution, averages, and grade summaries.
        </p>
      </div>

      {/* Selector Widget */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow max-w-xl space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-headline text-base font-bold text-on-surface">
            Select Course to Evaluate
          </h2>
        </div>
        <select
          className="w-full border border-outline-variant bg-surface rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          value={selectedCourseCode}
          onChange={(e) => setSelectedCourseCode(e.target.value)}
          disabled={courses.length === 0}
        >
          {courses.length === 0 && <option>No courses available</option>}
          {courses.map((course) => (
            <option key={course._id} value={course.code}>
              {course.title} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-on-surface-variant text-xs font-semibold">
          <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
          <span>Aggregating statistics from student grades...</span>
        </div>
      )}

      {/* Error notification */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-error-container/20 border border-error-container/40 text-error rounded-2xl text-xs font-semibold max-w-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results View */}
      {results && !loading && (
        <div className="space-y-6">
          {/* Big Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Average Marks
              </p>
              <h3 className="font-headline text-3xl font-extrabold text-on-surface">
                {results.marks}%
              </h3>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Course Grade
              </p>
              <h3 className="font-headline text-3xl font-extrabold text-secondary">
                {results.grade}
              </h3>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-green-50 rounded-xl text-green-700">
                  {results.status === "Pass" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-error" />
                  )}
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Overall Status
              </p>
              <span
                className={`inline-block font-headline text-2xl font-extrabold ${
                  results.status === "Pass" ? "text-green-600" : "text-error"
                }`}
              >
                {results.status}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#D97706]">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Classification
              </p>
              <h3 className="font-headline text-lg font-bold text-on-surface truncate">
                {results.performance}
              </h3>
            </div>
          </div>

          {/* Details Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between text-xs text-on-surface-variant max-w-2xl font-medium">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-outline" />
              <span>
                Calculated across{" "}
                <strong className="text-on-surface font-bold">
                  {results.assignmentsGraded}
                </strong>{" "}
                graded assignment(s) in this course.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

