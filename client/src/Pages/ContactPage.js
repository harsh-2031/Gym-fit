import React, { useState } from "react";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      setStatus(res.data.message);
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send message.");
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-bg-paper shadow-lg rounded-lg text-text-primary">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Get in Touch
      </h1>
      <p className="text-center text-text-secondary mb-8">
        Have questions or feedback? Drop a message below or email us directly at{" "}
        <a
          href="mailto:harsh.baghel.2111@gmail.com"
          className="text-primary hover:underline"
        >
          harsh.baghel.2111@gmail.com
        </a>
        .
      </p>

      <form onSubmit={onSubmit} className="max-w-lg mx-auto space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-secondary"
          >
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-secondary"
          >
            Your Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text-secondary"
          >
            Message
          </label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={onChange}
            required
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <button type="submit" className={buttonClasses}>
          Send Message
        </button>
        {status && <p className="text-center mt-4 text-sm">{status}</p>}
      </form>
    </div>
  );
};

export default ContactPage;
