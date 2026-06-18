import { useEffect, useState } from "react";
import { getMyGrades } from "../../services/grade.service";
import type { Grade } from "../../types/grade";
import { Award, Calendar } from "lucide-react";

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGrades()
      .then(setGrades)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 font-body max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-1">My Grades</h1>
        <p className="text-on-surface-variant text-sm">Review evaluated task scores, feedback, and letters.</p>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-sm">Loading grades...</p>
      ) : grades.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-dashed border-outline-variant text-center max-w-2xl">
          <Award className="w-8 h-8 text-outline mx-auto mb-2" />
          <p className="text-on-surface-variant text-xs font-semibold">No grades recorded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {grades.map((g) => {
            const sub = g.submission && typeof g.submission === "object" ? g.submission : null;
            const assign = sub && typeof sub.assignment === "object" ? sub.assignment : null;
            const isPass = g.marks >= 45;

            return (
              <div key={g._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant custom-shadow card-hover flex items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface truncate">
                    {assign?.title || "Assignment"}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-outline font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Graded: {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-on-surface leading-none">{g.marks}/100</p>
                    <p className="text-[10px] text-outline mt-0.5 font-bold uppercase">Marks</p>
                  </div>
                  <span className={`w-11 h-11 rounded-lg flex items-center justify-center font-headline font-black text-sm border ${
                    isPass 
                      ? "bg-green-50 text-green-700 border-green-200/50" 
                      : "bg-red-50 text-red-700 border-red-200/50"
                  }`}>
                    {g.grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
