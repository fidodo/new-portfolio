// app/admin/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminSession } from "../lib/useAdminSession";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const { isAdmin, isLoading, setIsAdmin } = useAdminSession();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

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
      </div>
    </div>
  );
}
