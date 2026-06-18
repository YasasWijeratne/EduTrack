import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { gradeSubmission, updateGrade } from "../../services/grade.service";
import { ArrowLeft, Award, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function GradeSubmission() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get("submissionId") || "";
  const isRegrade = searchParams.get("regrade") === "true";

  const [marks, setMarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const existingMarks = searchParams.get("marks");
    if (existingMarks) {
      setMarks(existingMarks);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId || !marks) return;
    setLoading(true);
    setStatus("");
    setErrorMsg("");
    try {
      if (isRegrade) {
        await updateGrade(submissionId, Number(marks));
        setStatus("Grade updated successfully!");
      } else {
        try {
          await gradeSubmission(submissionId, Number(marks));
          setStatus("Submission graded successfully!");
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (message.includes("Already graded")) {
            await updateGrade(submissionId, Number(marks));
            setStatus("Grade updated successfully!");
          } else {
            throw err;
          }
        }
      }
      setMarks("");
      if (submissionId) {
        setTimeout(() => {
          navigate("/lecturer/submissions");
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit grade.");
    } finally {
      setLoading(false);
    }
  };


  // Grade helper
  const numMarks = Number(marks);
  let gradeLetter = "-";
  let gradeColor = "text-outline";
  let gradeBg = "bg-surface-container";
  let gradeDescription = "Enter a valid score to view classification";

  if (marks !== "" && !isNaN(numMarks)) {
    if (numMarks >= 85) {
      gradeLetter = "A+";
      gradeColor = "text-green-700";
      gradeBg = "bg-green-50 border-green-200";
      gradeDescription = "Outstanding performance with high distinction.";
    } else if (numMarks >= 75) {
      gradeLetter = "A";
      gradeColor = "text-green-600";
      gradeBg = "bg-green-50/50 border-green-100";
      gradeDescription = "Excellent mastery of course objectives.";
    } else if (numMarks >= 65) {
      gradeLetter = "B";
      gradeColor = "text-primary";
      gradeBg = "bg-primary/5 border-primary/15";
      gradeDescription = "Good performance, above average standard.";
    } else if (numMarks >= 50) {
      gradeLetter = "C";
      gradeColor = "text-secondary";
      gradeBg = "bg-secondary/5 border-secondary/15";
      gradeDescription = "Satisfactory fulfillment of requirements.";
    } else {
      gradeLetter = "F";
      gradeColor = "text-error";
      gradeBg = "bg-error-container/20 border-error-container/30";
      gradeDescription = "Does not meet passing criteria. Needs review.";
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/lecturer/submissions")}
          className="p-2 bg-surface-container-lowest border border-outline-variant hover:border-outline hover:bg-surface rounded-xl transition-all cursor-pointer text-on-surface-variant flex items-center justify-center"
          title="Back to Submissions"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">
            {isRegrade ? "Update Grade" : "Grade Evaluation"}
          </h1>
          <p className="text-on-surface-variant text-sm">
            Evaluate student submission drafts and assign final marks.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Form (2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant custom-shadow space-y-6"
          >
            {/* Submission Selection Header */}
            {!submissionId ? (
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-amber-800 text-sm font-bold">No Submission Selected</p>
                <p className="text-amber-700/80 text-xs mt-1">Please select a student's submission from the Submissions page first.</p>
              </div>
            ) : (
              <div className="bg-surface p-4 rounded-xl border border-outline-variant flex justify-between items-center">
                <div className="min-w-0">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-0.5">
                    Target Submission ID
                  </span>
                  <span className="font-mono text-xs text-on-surface font-bold truncate block">
                    {submissionId}
                  </span>
                </div>
              </div>
            )}

            {/* Marks Input & Grade Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-on-surface">
                  Marks (0 - 100)
                </label>
                <span className="text-xs font-bold text-on-surface-variant">
                  Range: 0% - 100%
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  className="w-full border border-outline-variant bg-surface rounded-xl p-3.5 pl-10 text-base font-bold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  required
                  disabled={loading}
                />
                <Award className="w-5 h-5 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Slider helper */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  value={marks || "0"}
                  onChange={(e) => setMarks(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 bg-error-container/20 border border-error-container/40 text-error rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status && (
              <div className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{status}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading || !submissionId || marks === ""}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm p-3.5 rounded-xl transition-all active:scale-95 duration-150 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Evaluation...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Grade & Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Preview Card (1 Column) */}
        <div className="md:col-span-1">
          <div className={`p-6 rounded-2xl border ${gradeBg} custom-shadow text-center space-y-4 transition-all duration-300`}>
            <div className="w-16 h-16 rounded-full bg-surface-container-lowest mx-auto flex items-center justify-center border border-outline-variant shadow-inner">
              <span className={`text-2xl font-extrabold ${gradeColor}`}>
                {gradeLetter}
              </span>
            </div>
            <div>
              <h4 className="font-headline text-lg font-bold text-on-surface">
                Grade Summary
              </h4>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">
                Marks: {marks !== "" ? `${numMarks}%` : "Not set"}
              </p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {gradeDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

