import { useEffect, useState } from "react";
import {
  FilePenIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Load all resumes
  const loadAllResumes = async () => {
    if (!token) {
      console.log("Token not available yet");
      return;
    }

    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resumes received:", data.resumes);

      setAllResumes(data.resumes || []);
    } catch (error) {
      console.error(
        "Error loading resumes:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Failed to load resumes"
      );
    }
  };

  // Create a new resume
  const createResume = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((previous) => [...previous, data.resume]);

      setTitle("");
      setShowCreateResume(false);

      toast.success("Resume created successfully");

      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.error("Create resume error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to create resume"
      );
    }
  };

  // Upload an existing PDF resume
  const uploadResume = async (event) => {
    event.preventDefault();

    if (!resume) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        {
          title,
          resumeText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);

      toast.success("Resume uploaded successfully");

      await loadAllResumes();

      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload resume error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to upload resume"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Edit resume title
  const editTitle = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((previous) =>
        previous.map((item) =>
          item._id === editResumeId
            ? { ...item, title }
            : item
        )
      );

      setTitle("");
      setEditResumeId("");

      toast.success(data.message || "Resume updated successfully");
    } catch (error) {
      console.error("Edit resume error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to update resume"
      );
    }
  };

  // Delete a resume
  const deleteResume = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      const { data } = await api.delete(
        `/api/resumes/delete/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((previous) =>
        previous.filter((item) => item._id !== resumeId)
      );

      toast.success(data.message || "Resume deleted successfully");
    } catch (error) {
      console.error("Delete resume error:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to delete resume"
      );
    }
  };

  // Load resumes when the token becomes available
  useEffect(() => {
    if (token) {
      loadAllResumes();
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome, {user?.name || "User"}
      </p>

      {/* Create and upload buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />

          <p className="text-sm group-hover:text-indigo-600">
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />

          <p className="text-sm group-hover:text-purple-600">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* Display saved resumes */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((item, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={item._id}
              onClick={() => navigate(`/app/builder/${item._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: `${baseColor}40`,
              }}
            >
              <FilePenIcon
                className="size-7 group-hover:scale-105 transition-all"
                style={{ color: baseColor }}
              />

              <p
                className="text-sm px-2 text-center"
                style={{ color: baseColor }}
              >
                {item.title}
              </p>

              <p
                className="absolute bottom-1 text-[11px] px-2 text-center"
                style={{ color: `${baseColor}90` }}
              >
                Updated on{" "}
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute top-1 right-1 hidden group-hover:flex items-center"
              >
                <TrashIcon
                  onClick={() => deleteResume(item._id)}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 cursor-pointer"
                />

                <PencilIcon
                  onClick={() => {
                    setEditResumeId(item._id);
                    setTitle(item.title);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 cursor-pointer"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Create resume modal */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              Create a Resume
            </h2>

            <input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              type="text"
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Resume
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 cursor-pointer"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* Upload resume modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => {
            setShowUploadResume(false);
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              Upload a Resume
            </h2>

            <input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              type="text"
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4"
              required
            />

            <label
              htmlFor="resume-input"
              className="block text-sm text-slate-700"
            >
              Select resume file

              <div className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 py-10 my-4 cursor-pointer">
                {resume ? (
                  <p className="text-green-700">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloudIcon className="size-14 stroke-1" />
                    <p>Upload PDF</p>
                  </>
                )}
              </div>
            </label>

            <input
              type="file"
              id="resume-input"
              accept=".pdf,application/pdf"
              hidden
              onChange={(event) =>
                setResume(event.target.files?.[0] || null)
              }
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4" />
              )}

              {isLoading ? "Uploading..." : "Upload Resume"}
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 cursor-pointer"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
            />
          </div>
        </form>
      )}

      {/* Edit resume title modal */}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              Edit Resume Title
            </h2>

            <input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              type="text"
              placeholder="Enter resume title"
              className="w-full px-4 py-2 mb-4"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Update
            </button>

            <XIcon
              className="absolute top-4 right-4 text-slate-400 cursor-pointer"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;