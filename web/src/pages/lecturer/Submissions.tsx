import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAssignments } from "../../services/assignment.service";
import { getAssignmentSubmissions } from "../../services/submission.service";
import { getAssignmentGrades } from "../../services/grade.service";
import type { Assignment } from "../../types/assignment";
import type { Submission } from "../../types/submission";
import type { Grade } from "../../types/grade";
import { FolderOpen, ExternalLink, Calendar, Award } from "lucide-react";

export default function Submissions() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    getMyAssignments()
      .then((data) => {
        setAssignments(data);
        if (data.length > 0) {
          setSelectedAssignmentId(data[0]._id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedAssignmentId) return;
    setLoading(true);
    setErrorMsg("");
    setSubmissions([]);
    setGrades([]);
    Promise.all([
      getAssignmentSubmissions(selectedAssignmentId),
      getAssignmentGrades(selectedAssignmentId),
    ])
      .then(([subs, grds]) => {
        setSubmissions(subs);
        setGrades(grds);
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load submissions");
      })
      .finally(() => setLoading(false));
  }, [selectedAssignmentId]);

  const getGradeForSubmission = (submissionId: string) => {
    return grades.find((g) => {
      const sub = g.submission;
      const subId = typeof sub === "object" && sub !== null ? sub._id : sub;
      return subId === submissionId;
    });
  };



  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Student Submissions</h1>
        <p className="text-on-surface-variant text-sm">Select an assignment to view uploaded documents and issue grades.</p>
      </div>
      
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant custom-shadow max-w-lg">
        <label className="block text-xs font-semibold text-on-surface-variant mb-2">Select Assignment</label>
        <select
          className="w-full border border-outline-variant bg-surface rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          value={selectedAssignmentId}
          onChange={e => setSelectedAssignmentId(e.target.value)}
          disabled={assignments.length === 0}
        >
          {assignments.length === 0 && <option>No assignments available</option>}
          {assignments.map(assign => (
            <option key={assign._id} value={assign._id}>
              {assign.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-on-surface-variant text-xs">Loading submissions...</p>}
      {errorMsg && <p className="text-xs text-red-600 font-semibold mb-4">{errorMsg}</p>}

      <div className="space-y-4">
        {submissions.map((submission) => {
          const student = submission.student && typeof submission.student === "object" ? submission.student : null;
          const studentName = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
          const studentEmail = student ? student.email : "No email";
          const fileUrl = `http://localhost:5000/${submission.filePath.replace(/\\/g, "/")}`;
          const existingGrade = getGradeForSubmission(submission._id);

          return (
            <div key={submission._id} className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant custom-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
              <div className="space-y-1.5 min-w-0">
                <h3 className="font-headline text-base font-bold text-on-surface truncate">{studentName}</h3>
                <p className="text-xs text-on-surface-variant font-medium">{studentEmail}</p>
                <div className="flex items-center gap-4 text-[10px] text-outline font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Submitted: {new Date(submission.createdAt).toLocaleString()}
                  </span>
                  {existingGrade && (
                    <span className="text-green-700 font-bold">
                      Graded: {existingGrade.marks}% ({existingGrade.grade})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-bold text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95 duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <span>View File</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  to={
                    existingGrade
                      ? `/lecturer/grade?submissionId=${submission._id}&regrade=true&marks=${existingGrade.marks}`
                      : `/lecturer/grade?submissionId=${submission._id}`
                  }
                  className="bg-primary text-on-primary font-bold text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95 duration-150 flex items-center gap-1.5 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{existingGrade ? "Update Grade" : "Grade"}</span>
                </Link>
              </div>
            </div>
          );
        })}
        {submissions.length === 0 && !loading && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-dashed border-outline-variant text-center max-w-2xl">
            <FolderOpen className="w-8 h-8 text-outline mx-auto mb-2" />
            <p className="text-on-surface-variant text-xs font-semibold">No submissions recorded for this assignment yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
