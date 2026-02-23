import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// API URL - use environment variable in production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();
  //show password state
  const [showPassword, setShowPassword] = useState(false);
  //state for input fields
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  //state for confirming password
  const [confirmPassword, setConfirmPassword] = useState("");

  //function for handleing the form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !email || !password || !username) return;
    if (password !== confirmPassword) {
      document.getElementById("mismatch-password").style.display = "flex";
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      alert(data.message);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Poor Network Connection");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-4 items-center justify-center leading-loose h-screen"
    >
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-xl">Signup Here</h2>
        <h3 className="text-center">
          Lets Get Your CodeWithMe Account Created Today! &#128522;
        </h3>
      </div>
      <div className="flex flex-col">
        <label htmlFor="first-name" className=" font-semibold">
          Full Name:
        </label>
        <input
          type="text"
          placeholder="Abu Kofi"
          minLength={3}
          maxLength={50}
          required
          className="border-2 border-gray-300 rounded-md pl-1 outline-none w-[90vw] md:w-[26.5vw]"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className="flex flex-col ">
        <label htmlFor="email" className=" font-semibold">
          Email:
        </label>
        <input
          type="email"
          placeholder="example@gmail.com"
          minLength={3}
          maxLength={100}
          required
          className="border-2 border-gray-300 rounded-md pl-1 outline-none w-[90vw] md:w-[26.5vw]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col ">
        <label htmlFor="email" className="font-semibold">
          Username:
        </label>
        <input
          type="text"
          placeholder="guest"
          minLength={3}
          maxLength={100}
          required
          className="border-2 border-gray-300 rounded-md pl-1 outline-none w-[90vw] md:w-[26.5vw]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col ">
          <label htmlFor="first-name" className=" font-semibold">
            Password:
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            placeholder="**********"
            minLength={3}
            maxLength={20}
            required
            className="border-2 border-gray-300 rounded-md pl-1 outline-none w-[45vw] md:w-[13vw]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="first-name" className=" font-semibold">
            Confirm Password:
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            placeholder="*********"
            minLength={3}
            maxLength={20}
            required
            className="border-2 border-gray-300 rounded-md pl-1 outline-none w-[45vw] md:w-[13vw]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <p className="hidden" id="mismatch-password">
        Passwords do not match
      </p>
      <div className="flex justify-start gap-3  w-[90vw] md:w-[27vw] ml-2">
        <input
          type="checkbox"
          value={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <span>Show Password</span>
      </div>
      <button
        type="submit"
        className=" w-[90vw] md:w-[26vw] bg-[#FE5176] text-white rounded-md py-1"
      >
        Signup
      </button>
      <div className="flex justify-start w-[90vw] md:w-[26vw] font-semibold">
        <span>
          Already have an account? <Link to="/">Login</Link>
        </span>
      </div>
    </form>
  );
};

export default Signup;
