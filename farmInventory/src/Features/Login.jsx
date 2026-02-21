import React from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import toast from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();

  //state fpr showing password
  const [togglePassword, setTogglePassword] = useState(false);

  //state for tracking inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loginFunc } = useAuthStore();

  //form for sending request
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      if (data.token && data.refreshToken) {
        toast.success(data.message);
        loginFunc(data.token, data.refreshToken);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Poor network connection");
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200  shadow-sm p-4 shadow-black rounded-2xl leading-loose"
      >
        <h2 className="text-center text-xl font-bold text-orange-700">
          Welcome Back,Login
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            required
            className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type={togglePassword ? "text" : "password"}
            required
            className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-xl">
          <input
            type="checkbox"
            onClick={() => setTogglePassword(!togglePassword)}
          />
          <span>Show Password</span>
        </div>
        <div className="text-center  bg-linear-to-r rounded-md from-orange-600 via-orange-300   to-orange-600 ">
          <button type="submit" className="text-white font-bold text-xl">
            Login
          </button>
        </div>
        <span>
          <Link to="/signup">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
