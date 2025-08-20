import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const TrainerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note the new API endpoint for trainers
      const res = await axios.post(
        "http://localhost:5000/api/trainers/register",
        formData
      );
      console.log(res.data);
      alert("Registration successful! Please log in.");
      navigate("/trainer/login"); // Redirect to trainer login page
    } catch (err) {
      console.error(err.response.data);
      alert("Registration failed. Email may already be in use.");
    }
  };

  return (
    <div>
      <h1>Trainer Registration</h1>
      <p>Sign up to start managing your clients.</p>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <input type="submit" value="Register as Trainer" />
      </form>
      <p>
        Already have a trainer account?{" "}
        <Link to="/trainer/login">Login Here</Link>
      </p>
    </div>
  );
};

export default TrainerRegisterPage;
