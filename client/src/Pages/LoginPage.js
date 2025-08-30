import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email, password } = formData;

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // --- THIS IS THE MODIFIED REDIRECTION LOGIC ---
      // This will now always navigate to the homepage after login.
      navigate("/");

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80 disabled:opacity-50";

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-bg-paper shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="p-3 bg-red-500/20 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
              className={inputClasses}
              placeholder="Email address"
            />
          </div>
          <div className="pt-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              required
              className={inputClasses}
              placeholder="Password"
            />
          </div>
          <div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
