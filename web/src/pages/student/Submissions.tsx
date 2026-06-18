import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { submitAssignment, updateSubmission, getMySubmission, deleteSubmission } from "../../services/submission.service";
import type { Submission } from "../../types/submission";
import { Upload, Trash2, CheckCircle2, FileText } from "lucide-react";
import { getAssignmentsByCourseCode } from "../../services/assignment.service";
import { getMyStudentCourses } from "../../services/course.service";
import type { Assignment } from "../../types/assignment";
import type { Course } from "../../types/course";

export default function Submissions() {
  const location = useLocation();
  const routeState = (location.state as { assignmentId?: string; assignmentTitle?: string; courseCode?: string } | null) || null;

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(routeState?.courseCode || "");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(routeState?.assignmentId || "");
  const [file, setFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyStudentCourses()
      .then((data) => {
        setCourses(data);
        if (!selectedCourseCode) {
          setSelectedCourseCode(data[0]?.code || "");
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCourseCode) return;
    getAssignmentsByCourseCode(selectedCourseCode)
      .then((data) => {
        setAssignments(data);
        if (!selectedAssignmentId) {
          setSelectedAssignmentId(data[0]?._id || "");
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load assignments"));
  }, [selectedCourseCode]);

  const handleFetch = async (targetId = selectedAssignmentId) => {
    if (!targetId.trim()) return;
    setLoading(true); setError(""); setMsg("");
    try {
      const data = await getMySubmission(targetId.trim());
      setSubmission(data);
      if (data) setMsg("Existing submission loaded.");
      else setMsg("No submission uploaded yet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submission details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssignmentId) {
      handleFetch(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment._id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedAssignmentId.trim()) return;
    setLoading(true); setError(""); setMsg("");
    try {
      if (submission) {
        const updated = await updateSubmission(selectedAssignmentId.trim(), file);
        setSubmission(updated);
        setMsg("Submission updated successfully!");
      } else {
        const created = await submitAssignment(selectedAssignmentId.trim(), file);
        setSubmission(created);
        setMsg("Uploaded successfully!");
      }
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssignmentId.trim() || !confirm("Are you sure you want to delete your submission?")) return;
    setLoading(true); setError(""); setMsg("");
    try {
      await deleteSubmission(selectedAssignmentId.trim());
      setSubmission(null);
      setMsg("Submission deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Submit Assignment</h1>
        <p className="text-on-surface-variant text-sm">Upload assignment documents (PDF, DOCX) to the evaluator.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant custom-shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-body text-xs font-semibold text-on-surface mb-1">Course</label>
            <select
              className="w-full bg-surface-container h-10 px-4 rounded-lg border-none focus:ring-2 focus:ring-primary font-body text-sm outline-none transition-all"
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              disabled={loading || courses.length === 0}
            >
              {courses.length === 0 && <option value="">No enrolled courses available</option>}
              {courses.map((course) => (
                <option key={course._id} value={course.code}>{course.title} ({course.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-on-surface mb-1">Assignment</label>
            <select
              className="w-full bg-surface-container h-10 px-4 rounded-lg border-none focus:ring-2 focus:ring-primary font-body text-sm outline-none transition-all"
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              disabled={loading || assignments.length === 0}
            >
              {assignments.length === 0 && <option value="">No assignments available</option>}
              {assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>{assignment.title}</option>
              ))}
            </select>
          </div>
        </div>

        {submission && (
          <div className="bg-green-50/50 p-4 rounded-lg border border-green-200/50 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-headline font-bold text-xs">Submission Live &amp; Saved</span>
            </div>
            <div className="text-xs text-on-surface-variant space-y-1 font-mono">
              <p className="truncate">File: {submission.filePath.split(/[\\/]/).pop()}</p>
              <p>Uploaded: {new Date(submission.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-[10px] font-bold text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 mt-1 border border-transparent"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Submission
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-semibold text-on-surface mb-1">
              {submission ? "Replace Submission File" : selectedAssignment?.title || "Upload Document"}
            </label>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:border-primary transition-all relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    if (selectedFile.size > 5 * 1024 * 1024) {
                      setError("File size exceeds 5MB limit.");
                      setFile(null);
                    } else if (
                      !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selectedFile.type) &&
                      !selectedFile.name.toLowerCase().match(/\.(pdf|doc|docx)$/)
                    ) {
                      setError("Only PDF, DOC, and DOCX files are allowed.");
                      setFile(null);
                    } else {
                      setError("");
                      setFile(selectedFile);
                    }
                  } else {
                    setFile(null);
                  }
                }}
                disabled={loading}
              />
              <Upload className="w-8 h-8 text-outline mx-auto mb-2" />
              <p className="text-xs font-bold text-on-surface">
                {file ? file.name : "Click or drag file here to select"}
              </p>
              <p className="text-[10px] text-outline mt-1 font-medium">Supports PDF, DOC, DOCX up to 5MB.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-primary text-on-primary font-bold text-xs py-2.5 rounded-lg hover:opacity-95 transition-all shadow-sm active:scale-[0.98] duration-150 cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {loading ? "Uploading..." : submission ? "Update Submission File" : "Submit Assignment"}
          </button>
        </form>

        {msg && <p className="text-xs text-green-600 font-semibold text-center">{msg}</p>}
        {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}
      </div>
    </div>
  );
}
