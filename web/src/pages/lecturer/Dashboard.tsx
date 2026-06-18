import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses } from "../../services/course.service";
import type { Course } from "../../types/course";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Lecturer Dashboard</h2>
          <p className="text-on-surface-variant text-sm">Overview of your courses and academic activities.</p>
        </div>
        <Link
          to="/lecturer/assignments"
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 active:scale-95 transition-all shrink-0 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant custom-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline text-lg font-bold text-on-surface">Quick Course Overview</h3>
          <Link to="/lecturer/courses" className="text-primary font-bold text-xs hover:underline">
            Manage Courses
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-on-surface-variant">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-sm text-on-surface-variant italic">
              No courses created yet. Click "Create Course" in courses page to get started.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Course Title</th>
                  <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Code</th>
                  <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Students</th>
                  <th className="px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-xs text-on-surface">{course.title}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">{course.code}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {course.students?.length || 0} enrolled
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/lecturer/results?courseId=${course._id}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
