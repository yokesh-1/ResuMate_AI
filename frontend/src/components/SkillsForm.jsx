import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const SkillsForm = ({ data, onChange, profession, experience }) => {
  const { token } = useSelector((state) => state.auth);
  const [newSkill, setNewSkill] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSuggestion = (skill) => {
    if (!data.includes(skill)) {
      onChange([...data, skill]);
    }
    setSuggestions((prev) => prev.filter((s) => s !== skill));
  };

  const suggestSkills = async () => {
    try {
      setIsSuggesting(true);
      const { data: res } = await api.post(
        "/api/ai/suggest-skills",
        { profession, experience, existingSkills: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fresh = (res.skills || []).filter((s) => !data.includes(s));
      setSuggestions(fresh);

      if (fresh.length === 0) {
        toast("No new skills to suggest.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Skills
          </h3>
          <p className="text-sm text-gray-500">
            Add your technical and soft skills
          </p>
        </div>

        <button
          disabled={isSuggesting}
          onClick={suggestSkills}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isSuggesting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isSuggesting ? "Suggesting..." : "AI Suggest"}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript, Project Management)"
          className="flex-1 px-3 py-2 text-sm"
          onChange={(e) => setNewSkill(e.target.value)}
          value={newSkill}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-purple-50 p-3 rounded-lg space-y-2">
          <p className="text-sm text-purple-800 font-medium">
            AI Suggestions (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((skill, index) => (
              <button
                key={index}
                onClick={() => addSuggestion(skill)}
                className="flex items-center gap-1 px-3 py-1 bg-white text-purple-700 border border-purple-300 rounded-full text-sm hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-3 h-3" /> {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Add your technical and soft skills above.</p>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical
          skills (programming languages, tools) and soft skills (leadership,
          communication).
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;
