import { useEffect, useState } from "react";
import { getMyCourses, createCourse, updateCourse, deleteCourse } from "../../services/course.service";
import type { Course } from "../../types/course";
import { BookOpen, Copy, Check, Pencil, Trash2, X } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchCourses = () => {
    getMyCourses().then(setCourses).catch(console.error);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || !description.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await createCourse({ title, code, description });
      setTitle("");
      setCode("");
      setDescription("");
      fetchCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditCode(course.code);
    setEditDescription(course.description || "");
    setErrorMsg("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await updateCourse(editingCourse._id, {
        title: editTitle,
        code: editCode,
        description: editDescription,
      });
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Delete course "${course.title}"? This cannot be undone.`)) return;
    setErrorMsg("");
    try {
      await deleteCourse(course._id);
      fetchCourses();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Courses Management</h1>
        <p className="text-on-surface-variant text-sm">Create modules, view enrollment statistics, and retrieve Course IDs.</p>
      </div>

      {errorMsg && !editingCourse && (
        <div className="p-4 bg-error-container/20 border border-error-container/40 text-error rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleCreate} className="lg:col-span-1 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant custom-shadow space-y-4">
          <h2 className="font-headline text-base font-bold text-on-surface">Create New Course</h2>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Course Title</label>
            <input
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. Artificial Intelligence"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Course Code</label>
            <input
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. CS101"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description</label>
            <textarea
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[80px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              disabled={loading}
              placeholder="Provide a short synopsis..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline text-base font-bold text-on-surface">Active Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant custom-shadow card-hover flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-headline font-bold text-on-surface leading-tight truncate">{course.title}</h3>
                    <span className="text-[10px] font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase shrink-0">
                      {course.code}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                    {course.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                    {course.students?.length || 0} Student(s) Enrolled
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(course._id)}
                      className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
                      title="Copy Course ID"
                    >
                      {copiedId === course._id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(course)}
                      className="p-1.5 rounded-lg hover:bg-surface-container text-primary cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(course)}
                      className="p-1.5 rounded-lg hover:bg-error-container/20 text-error cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant text-center col-span-2">
                <BookOpen className="w-8 h-8 text-outline mx-auto mb-2" />
                <p className="text-on-surface-variant text-xs font-semibold">No active courses registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant custom-shadow w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-headline text-lg font-bold text-on-surface">Edit Course</h2>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Course Title</label>
                <input
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Course Code</label>
                <input
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={editCode}
                  onChange={e => setEditCode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description</label>
                <textarea
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 border border-outline-variant text-on-surface-variant font-bold text-xs py-2.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
