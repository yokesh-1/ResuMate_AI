import { Bot, CheckCircle2, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const scoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

const ResumeReviewAgent = ({ resumeId, onApplied }) => {
  const { token } = useSelector((state) => state.auth);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runAgent = async (applyFixes) => {
    try {
      setIsRunning(true);
      setResult(null);

      const { data } = await api.post(
        "/api/ai/review-agent",
        { resumeId, applyFixes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(data);

      if (data.applied) {
        toast.success("Agent applied improvements to your resume.");
        onApplied && onApplied();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mt-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Resume Reviewer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isRunning}
            onClick={() => runAgent(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Bot className="size-4" />
            )}
            Review
          </button>

          <button
            disabled={isRunning}
            onClick={() => runAgent(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Wand2 className="size-4" /> Review &amp; Fix
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Scores your resume for ATS readiness and suggests improvements.
      </p>

      {isRunning && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <Loader2 className="size-4 animate-spin" /> Agent is analyzing your
          resume...
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          {typeof result.score === "number" && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-600">ATS Score:</span>
              <span className={`text-3xl font-bold ${scoreColor(result.score)}`}>
                {result.score}
              </span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          )}

          {result.summary && (
            <p className="text-sm text-gray-700">{result.summary}</p>
          )}

          {Array.isArray(result.suggestions) &&
            result.suggestions.length > 0 && (
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}

          {result.applied && (
            <p className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="size-4" /> Improvements were applied to
              your resume.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeReviewAgent;
