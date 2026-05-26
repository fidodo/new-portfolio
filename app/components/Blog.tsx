// components/Blog.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const current = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = (current / maxScroll) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  <div
    className="reading-progress"
    style={{ transform: `scaleX(${readingProgress / 100})` }}
  />;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/blog");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("API did not return an array:", data);
        setPosts([]);
        setError("Received invalid data from server");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load blog posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPost.id,
          title: editTitle,
          content: editContent,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((post) =>
            post.id === editingPost.id ? updatedPost : post,
          ),
        );
        setEditingPost(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <section id="blog" className="section">
        <div className="flex flex-col relative min-h-screen text-center items-center justify-center">
          <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
            Dev Log
          </h3>
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="section">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col relative min-h-screen text-center md:text-left max-w-7xl px-10 justify-evenly mx-auto items-center"
      >
        <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
          Dev Log
        </h3>

        <div className="w-full mt-32 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center">
              <h4 className="text-4xl font-semibold mb-4">
                Blogging my development journey! 🚀
              </h4>
              <p className="text-gray-500">
                I&apos;ll be documenting my progress here as I build and learn.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="blog-card"
                >
                  <div className="p-6 md:p-8">
                    {/* Header with better spacing */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        {post.title}
                      </h3>

                      <div className="flex items-center gap-3">
                        {/* Date with better styling */}
                        <span className="blog-meta !mb-0">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(post.createdAt)}
                        </span>

                        {/* Admin actions (only visible to admin) */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            aria-label="Edit post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            aria-label="Delete post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content with improved readability */}
                    <div
                      className={`prose prose-lg dark:prose-invert max-w-none blog-content
            ${expandedPost === post.id ? "" : "line-clamp-3"}`}
                      onClick={() =>
                        setExpandedPost(
                          expandedPost === post.id ? null : post.id,
                        )
                      }
                    >
                      <ReactMarkdown
                        components={{
                          // Custom markdown rendering for better UX
                          p: ({ children }) => (
                            <p className="leading-relaxed">{children}</p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mt-8 mb-4">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-2xl font-bold mt-6 mb-3">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xl font-semibold mt-5 mb-2">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-6 my-4 space-y-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 my-4 space-y-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary pl-5 my-6 italic text-muted-foreground">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {post.content}
                      </ReactMarkdown>
                    </div>

                    {/* Improved read more button */}
                    <button
                      onClick={() =>
                        setExpandedPost(
                          expandedPost === post.id ? null : post.id,
                        )
                      }
                      className="read-more-btn mt-6"
                    >
                      <span>
                        {expandedPost === post.id ? "Show less" : "Read more"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${expandedPost === post.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Edit Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content (Markdown)
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono dark:bg-gray-700"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;
