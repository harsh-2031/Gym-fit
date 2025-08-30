import React, { useState } from "react";
import axios from "axios";
import {
  FiSend,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // Use null as initial state
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "sending", message: "Sending your message..." });
    try {
      const res = await axios.post(`${API_URL}/api/contact`, formData);
      setStatus({ type: "success", message: res.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to send message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field) =>
    `w-full px-4 py-3 pl-11 border rounded-lg transition-all duration-200 ease-in-out ${
      focusedField === field
        ? "border-primary shadow-lg shadow-primary/20"
        : "border-gray-700 hover:border-gray-600"
    } bg-bg-default text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30`;

  const labelClasses = (field) =>
    `block text-sm font-medium mb-2 transition-all duration-200 ${
      focusedField === field ? "text-primary" : "text-text-secondary"
    }`;

  const buttonClasses = `w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-secondary font-medium transition-all duration-300 ease-in-out ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-primary hover:bg-primary/80 hover:shadow-lg transform hover:-translate-y-0.5"
  }`;

  return (
    <div className="min-h-[85vh] bg-bg-default py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-bg-paper rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-secondary p-6 text-center">
          <h1 className="text-3xl font-bold text-text-primary">Get in Touch</h1>
          <p className="text-text-secondary/90 mt-2">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={labelClasses("name")}>
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser
                    className={`${
                      focusedField === "name"
                        ? "text-primary"
                        : "text-text-secondary"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={inputClasses("name")}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClasses("email")}>
                Your Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail
                    className={`${
                      focusedField === "email"
                        ? "text-primary"
                        : "text-text-secondary"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={inputClasses("email")}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClasses("message")}>
                Message
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3 pointer-events-none">
                  <FiMessageSquare
                    className={`${
                      focusedField === "message"
                        ? "text-primary"
                        : "text-text-secondary"
                    }`}
                  />
                </div>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={onChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField("")}
                  required
                  className={`${inputClasses("message")}`}
                  placeholder="Your message here..."
                />
              </div>
            </div>

            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {status && (
            <div
              className={`mt-6 p-4 rounded-lg border text-center text-sm ${
                status.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : status.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              <div className="flex items-center justify-center">
                {status.type === "success" ? (
                  <FiCheckCircle className="mr-2" size={20} />
                ) : status.type === "error" ? (
                  <FiAlertCircle className="mr-2" size={20} />
                ) : null}
                <p className="font-medium">{status.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
