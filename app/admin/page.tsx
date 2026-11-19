// app/admin/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminSession } from "../lib/useAdminSession";

interface PendingResumeChange {
  id: string;
  targetType: "experience" | "skill" | "certification";
  targetId: string | null;
  changeType: "create" | "update";
  proposedData: Record<string, unknown>;
  previousData: Record<string, unknown> | null;
  sourceNote: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const { isAdmin, isLoading, setIsAdmin } = useAdminSession();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [resumeSourceText, setResumeSourceText] = useState("");
  const [resumeStatus, setResumeStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingResumeChange[]>(
    [],
  );
  const [showPdfReminder, setShowPdfReminder] = useState(false);

  const [coverRole, setCoverRole] = useState("");
  const [coverCompany, setCoverCompany] = useState("");
  const [coverJobUrl, setCoverJobUrl] = useState("");
  const [coverJobDescription, setCoverJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterStatus, setCoverLetterStatus] = useState("");
  const [coverLetterJobUrlWarning, setCoverLetterJobUrlWarning] = useState("");
  const [coverLetterCopied, setCoverLetterCopied] = useState(false);

  const router = useRouter();

  const loadPendingChanges = async () => {
    try {
      const res = await fetch("/api/admin/resume-changes?status=pending");
      if (res.ok) setPendingChanges(await res.json());
    } catch (error) {
      console.error("Error loading pending resume changes:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) loadPendingChanges();
  }, [isAdmin]);

  const handleGenerateChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResumeStatus("Generating proposed changes...");

    try {
      const res = await fetch("/api/admin/resume-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText: resumeSourceText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResumeStatus(data.error || "Failed to generate proposed changes");
      } else if (data.length === 0) {
        setResumeStatus(
          "No changes proposed — nothing in that text seemed to warrant an update.",
        );
        setResumeSourceText("");
      } else {
        setResumeStatus(`${data.length} change(s) proposed — review below.`);
        setResumeSourceText("");
        await loadPendingChanges();
      }
    } catch (error) {
      console.error("Error generating resume changes:", error);
      setResumeStatus("Failed to generate proposed changes");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDecision = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    try {
      const res = await fetch(`/api/admin/resume-changes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setPendingChanges((prev) => prev.filter((c) => c.id !== id));
        if (action === "approve") setShowPdfReminder(true);
      }
    } catch (error) {
      console.error(`Error applying ${action}:`, error);
    }
  };

  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCoverLetter(true);
    setCoverLetterStatus("Drafting cover letter...");
    setCoverLetterCopied(false);
    setCoverLetterJobUrlWarning("");

    try {
      const res = await fetch("/api/admin/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: coverRole,
          company: coverCompany,
          jobUrl: coverJobUrl,
          jobDescription: coverJobDescription,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCoverLetterStatus(data.error || "Failed to generate cover letter");
      } else {
        setCoverLetter(data.letter);
        setCoverLetterStatus("");
        setCoverLetterJobUrlWarning(data.jobUrlWarning || "");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setCoverLetterStatus("Failed to generate cover letter");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleCopyCoverLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCoverLetterCopied(true);
      setTimeout(() => setCoverLetterCopied(false), 2000);
    } catch (error) {
      console.error("Error copying cover letter:", error);
    }
  };

  const handleDownloadCoverLetter = () => {
    const slug = (coverCompany || coverRole || "cover-letter")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ayokunleogunfidodo-cover-letter-${slug || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAdmin(true);
        setPassword("");
      } else if (response.status === 429) {
        setLoginError("Too many attempts. Try again later.");
      } else {
        setLoginError("Wrong password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsAdmin(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          {loginError && (
            <p className="text-sm text-red-500 mb-4">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      console.log("Response from API:", data);

      if (response.ok) {
        setStatus("Saved successfully!");
        setTitle("");
        setContent("");
        setTimeout(() => setStatus(""), 3000);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setStatus("Error saving post");
        console.error("Error saving post:", data);
      }
    } catch (error) {
      setStatus("Error saving post");
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add Development Log</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Log out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What did you work on today?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Markdown supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Write your progress notes here... (supports markdown)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use markdown: **bold**, *italic*, - lists, etc.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Progress
          </button>

          {status && (
            <div className="text-center text-sm text-gray-600">{status}</div>
          )}
        </form>

        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-2">Resume Updates</h2>
          <p className="text-sm text-gray-500 mb-6">
            Paste new info to incorporate (LinkedIn export, new role, new
            certification, a notable post, etc.) — nothing changes on the
            live site until you approve a proposal below.
          </p>

          <form onSubmit={handleGenerateChanges} className="space-y-4">
            <textarea
              value={resumeSourceText}
              onChange={(e) => setResumeSourceText(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the new information here..."
              required
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Proposed Changes"}
            </button>
            {resumeStatus && (
              <div className="text-center text-sm text-gray-600">
                {resumeStatus}
              </div>
            )}
          </form>

          {showPdfReminder && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-6">
              Resume PDF may now be out of date — update{" "}
              <code>public/resume.pdf</code> yourself. To refresh the
              chatbot&apos;s knowledge, update{" "}
              <code>data/portfolio-data.txt</code> and re-run{" "}
              <code>npx tsx scripts/ingest-data.ts</code>.
            </p>
          )}

          {pendingChanges.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg">
                Pending Changes ({pendingChanges.length})
              </h3>
              {pendingChanges.map((change) => (
                <div
                  key={change.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                      {change.changeType} {change.targetType}
                    </span>
                  </div>

                  {change.previousData && (
                    <div className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">Before: </span>
                      {JSON.stringify(change.previousData)}
                    </div>
                  )}
                  <div className="text-sm text-gray-800 mb-3">
                    <span className="font-medium">Proposed: </span>
                    {JSON.stringify(change.proposedData)}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDecision(change.id, "approve")}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(change.id, "reject")}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-2">Cover Letter Generator</h2>
          <p className="text-sm text-gray-500 mb-6">
            Drafts a cover letter from your current experience/skills data for
            a specific role — review and edit before sending.
          </p>

          <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Role / job title
              </label>
              <input
                type="text"
                value={coverRole}
                onChange={(e) => setCoverRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior Frontend Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company (optional)
              </label>
              <input
                type="text"
                value={coverCompany}
                onChange={(e) => setCoverCompany(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Acme Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job posting URL (optional)
              </label>
              <input
                type="url"
                value={coverJobUrl}
                onChange={(e) => setCoverJobUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll read the requirements straight from the page. If a
                site won&apos;t let us read it (common on JS-heavy listings),
                paste the description below instead.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job description (optional, improves relevance)
              </label>
              <textarea
                value={coverJobDescription}
                onChange={(e) => setCoverJobDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the job posting here, or add extra notes alongside the URL above..."
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingCoverLetter}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isGeneratingCoverLetter ? "Drafting..." : "Generate Cover Letter"}
            </button>
            {coverLetterStatus && (
              <div className="text-center text-sm text-gray-600">
                {coverLetterStatus}
              </div>
            )}
          </form>

          {coverLetterJobUrlWarning && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-6">
              {coverLetterJobUrlWarning}
            </p>
          )}

          {coverLetter && (
            <div className="mt-6 space-y-3">
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={14}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCopyCoverLetter}
                  className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  {coverLetterCopied ? "Copied!" : "Copy to clipboard"}
                </button>
                <button
                  onClick={handleDownloadCoverLetter}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Download .txt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
