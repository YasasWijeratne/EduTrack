import { useEffect, useState } from "react";
import { getMyCourses } from "../../services/course.service";
import { getMyAssignments, createAssignment, updateAssignment, deleteAssignment } from "../../services/assignment.service";
import type { Course } from "../../types/course";
import type { Assignment } from "../../types/assignment";
import { Calendar, Folder, Pencil, Trash2, X } from "lucide-react";

export default function Assignments() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const fetchAssignments = () => {
    getMyAssignments().then(setAssignments).catch(console.error);
  };

  useEffect(() => {
    getMyCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0]._id);
        }
      })
      .catch(console.error);

    fetchAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !title.trim() || !description.trim() || !dueDate) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await createAssignment({
        courseId: selectedCourseId,
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchAssignments();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditTitle(assignment.title);
    setEditDescription(assignment.description);
    const date = new Date(assignment.dueDate);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setEditDueDate(local.toISOString().slice(0, 16));
    setErrorMsg("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await updateAssignment(editingAssignment._id, {
        title: editTitle,
        description: editDescription,
        dueDate: new Date(editDueDate).toISOString(),
      });
      setEditingAssignment(null);
      fetchAssignments();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignment: Assignment) => {
    if (!window.confirm(`Delete assignment "${assignment.title}"? This cannot be undone.`)) return;
    setErrorMsg("");
    try {
      await deleteAssignment(assignment._id);
      fetchAssignments();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete assignment");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Assignments Management</h1>
        <p className="text-on-surface-variant text-sm">Assign homework items, set absolute deadlines, and distribute to student courses.</p>
      </div>

      {errorMsg && !editingAssignment && (
        <div className="p-4 bg-error-container/20 border border-error-container/40 text-error rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleCreate} className="lg:col-span-1 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant custom-shadow space-y-4">
          <h2 className="font-headline text-base font-bold text-on-surface">Create Assignment</h2>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Select Course</label>
            <select
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              required
              disabled={loading || courses.length === 0}
            >
              {courses.length === 0 && <option>No courses registered yet</option>}
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Assignment Title</label>
            <input
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. Lab Report 1"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description</label>
            <textarea
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[80px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              disabled={loading}
              placeholder="Detail assignment criteria..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Due Date &amp; Time</label>
            <input
              type="datetime-local"
              className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || courses.length === 0}
            className="w-full bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline text-base font-bold text-on-surface">Created Assignments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant custom-shadow card-hover flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-headline font-bold text-on-surface leading-tight truncate">{assignment.title}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                    {assignment.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-outline">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(assignment)}
                      className="p-1.5 rounded-lg hover:bg-surface-container text-primary cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(assignment)}
                      className="p-1.5 rounded-lg hover:bg-error-container/20 text-error cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {assignments.length === 0 && (
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant text-center col-span-2">
                <Folder className="w-8 h-8 text-outline mx-auto mb-2" />
                <p className="text-on-surface-variant text-xs font-semibold">No homework assignments created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant custom-shadow w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-headline text-lg font-bold text-on-surface">Edit Assignment</h2>
              <button
                type="button"
                onClick={() => setEditingAssignment(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Assignment Title</label>
                <input
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
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
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Due Date &amp; Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
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
