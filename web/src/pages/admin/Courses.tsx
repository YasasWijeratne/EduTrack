import { useState, useEffect } from "react";
import { getAllCourses } from "../../services/course.service";
import type { Course } from "../../types/course";
import { Search, BookOpen, Users, ClipboardList, FolderOpen } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllCourses()
      .then(setCourses)
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load courses");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
            Course Registry
          </h1>
          <p className="text-on-surface-variant text-sm">
            Audit and review all courses registered in the EduTrack platform.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all custom-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-error-container/20 border border-error-container/40 text-error rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <p className="text-on-surface-variant text-sm">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const lecturerName =
              course.lecturer && typeof course.lecturer === "object"
                ? `${(course.lecturer as any).firstName} ${(course.lecturer as any).lastName}`
                : "Unknown Lecturer";

            return (
              <div
                key={course._id}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {course.code}
                      </span>
                      <h3 className="font-headline text-lg font-extrabold text-on-surface mt-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>
                    <BookOpen className="w-5 h-5 text-outline shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-3 line-clamp-3">
                    {course.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-outline-variant/30 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    <span>Lecturer</span>
                    <span className="text-on-surface truncate ml-2">
                      {lecturerName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 bg-surface p-2.5 rounded-xl border border-outline-variant flex items-center justify-center gap-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-bold text-on-surface">
                        {course.students?.length || 0}
                      </span>
                    </div>
                    <div className="flex-1 bg-surface p-2.5 rounded-xl border border-outline-variant flex items-center justify-center gap-2">
                      <ClipboardList className="w-4 h-4 text-[#D97706]" />
                      <span className="text-xs font-bold text-on-surface">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="col-span-full bg-surface-container-lowest p-8 rounded-2xl border border-dashed border-outline-variant text-center">
              <FolderOpen className="w-8 h-8 text-outline mx-auto mb-2.5" />
              <h3 className="font-headline text-sm font-bold text-on-surface mb-1">
                No Courses Found
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                {searchQuery
                  ? "No courses match your search criteria."
                  : "There are no courses registered in the platform yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
