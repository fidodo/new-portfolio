"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";
// import { Github, Linkedin, Mail, Globe } from "lucide-react";

const Globe = dynamic(() => import("lucide-react").then((mod) => mod.Globe), {
  ssr: false,
});
const Mail = dynamic(() => import("lucide-react").then((mod) => mod.Mail), {
  ssr: false,
});
const Github = dynamic(() => import("lucide-react").then((mod) => mod.Github), {
  ssr: false,
});
const Linkedin = dynamic(
  () => import("lucide-react").then((mod) => mod.Linkedin),
  { ssr: false },
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Response:", response, formData);
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="heading">Get in Touch</h2>

        <div className="bg-gray-900 p-6 rounded-lg font-mono text-gray-100 overflow-x-auto">
          <p>
            <span className="text-purple-400">.socials</span> &#123;
          </p>

          <div className="ml-4 mt-2 space-y-2">
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-400" />
              <p>
                website:{" "}
                <a
                  href="https://ogunfidodoayokunle.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  ogunfidodoayokunle.vercel.app
                </a>
                ;
              </p>
            </div>

            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-red-400" />
              <p>
                email:{" "}
                <a
                  href="mailto:ayokunleogunfidodo@gmail.com"
                  className="text-blue-400 hover:underline"
                >
                  ayokunleogunfidodo@gmail.com
                </a>
                ;
              </p>
            </div>

            <div className="flex items-center">
              <Github className="h-5 w-5 mr-2 text-gray-400" />
              <p>
                github:{" "}
                <a
                  href="https://github.com/Fidodo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Fidodo
                </a>
                ;
              </p>
            </div>

            <div className="flex items-center">
              <Linkedin className="h-5 w-5 mr-2 text-blue-500" />
              <p>
                linkedin:{" "}
                <a
                  href="https://www.linkedin.com/in/ayokunle-ogunfidodo-a862a0153/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  ayokunle-ogunfidodo-a862a0153
                </a>
                ;
              </p>
            </div>
          </div>

          <p className="mt-2">&#125;</p>
        </div>

        <p className="subheading">
          Interested in working together? Let&apos;s connect!
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="button w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>

          {submitStatus === "success" && (
            <p className="text-green-600">Message sent successfully!</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-600">
              Failed to send message. Please try again.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
