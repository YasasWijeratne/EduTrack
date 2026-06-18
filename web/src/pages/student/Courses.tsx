import { useEffect, useMemo, useState } from "react";
import { enrollCourseByCode, unenrollCourse, getAllCourses, getMyStudentCourses } from "../../services/course.service";
import type { Course } from "../../types/course";
import { GraduationCap, XCircle } from "lucide-react";

export default function Courses() {
  const [selectedCode, setSelectedCode] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getAllCourses(), getMyStudentCourses()])
      .then(([allCourses, myCourses]) => {
        setAvailableCourses(allCourses);
        setEnrolledCourses(myCourses);
        const nextCourse = allCourses.find((course) => !myCourses.some((enrolled) => enrolled._id === course._id)) || allCourses[0];
        setSelectedCode(nextCourse?.code || "");
      })
      .catch(console.error);
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode.trim()) return;
    setLoading(true); setError(""); setMsg("");
    try {
      const course = await enrollCourseByCode(selectedCode.trim());
      setEnrolledCourses((prev) => [...prev.filter((c) => c._id !== course._id), course]);
      setMsg(`Enrolled in "${course.title}" successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (id: string) => {
    setLoading(true); setError(""); setMsg("");
    try {
      await unenrollCourse(id);
      setEnrolledCourses((prev) => prev.filter((c) => c._id !== id));
      setMsg("Unenrolled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unenroll");
    } finally {
      setLoading(false);
    }
  };

  const enrollmentOptions = useMemo(
    () => availableCourses.filter((course) => !enrolledCourses.some((enrolled) => enrolled._id === course._id)),
    [availableCourses, enrolledCourses]
  );

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Courses</h1>
        <p className="text-on-surface-variant text-sm">Enroll in classes or review your active enrolled courses.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant custom-shadow max-w-2xl">
        <h2 className="font-headline text-base font-bold text-on-surface mb-3">Enroll in a Course</h2>
        <form onSubmit={handleEnroll} className="flex gap-3">
          <select
            className="w-full bg-surface-container h-11 px-4 rounded-lg border-none focus:ring-2 focus:ring-primary font-body text-sm outline-none transition-all"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            required
            disabled={loading || enrollmentOptions.length === 0}
          >
            {enrollmentOptions.length === 0 && <option value="">No open courses available</option>}
            {enrollmentOptions.map((course) => (
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
            Enroll
          </button>
        </form>
        {msg && <p className="text-xs text-green-600 font-semibold mt-3">{msg}</p>}
        {error && <p className="text-xs text-red-600 font-semibold mt-3">{error}</p>}
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">Enrolled Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {enrolledCourses.map((c) => (
              <div key={c._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant custom-shadow card-hover flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-on-surface leading-tight">{c.title}</h3>
                    <span className="text-[10px] font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0 uppercase ml-2">
                      {c.code}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    {c.description || "No description provided."}
                  </p>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleUnenroll(c._id)}
                    className="text-[10px] font-bold text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Unenroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant text-center max-w-2xl">
          <GraduationCap className="w-8 h-8 text-outline mx-auto mb-2" />
          <p className="text-on-surface-variant text-xs font-semibold">You have not enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
}
