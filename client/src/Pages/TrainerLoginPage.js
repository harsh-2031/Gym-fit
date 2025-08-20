import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const TrainerLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note the new API endpoint for trainers
      const res = await axios.post(
        "http://localhost:5000/api/trainers/login",
        formData
      );

      // It's a good practice to store the trainer token with a different name
      localStorage.setItem("trainerToken", res.data.token);
      localStorage.setItem("trainer", JSON.stringify(res.data));

      navigate("/trainer/dashboard"); // Redirect to the future trainer dashboard
    } catch (err) {
      console.error(err.response.data);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Trainer Login</h1>
      <form onSubmit={onSubmit}>
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
        <input type="submit" value="Login as Trainer" />
      </form>
      <p>
        Don't have a trainer account?{" "}
        <Link to="/trainer/register">Register Here</Link>
      </p>
    </div>
  );
};

export default TrainerLoginPage;
