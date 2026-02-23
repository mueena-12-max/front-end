import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

// API URL - use environment variable in production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Password requirements for display
const PASSWORD_REQUIREMENTS = [
  "At least 8 characters long",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
  "At least one special character (!@#$%^&*...)",
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(searchParams.get("token") ? 2 : 1);
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      toast.success(data.message);
      // Start cooldown for resend
      setResendCooldown(60);
      setTimeout(() => setResendCooldown(0), 60000);
    } catch (error) {
      toast.error("Poor network connection");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend token
  const handleResendToken = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Reset email sent again");
        setResendCooldown(60);
        setTimeout(() => setResendCooldown(0), 60000);
      } else {
        toast.error(data.error || "Failed to resend");
      }
    } catch (error) {
      toast.error("Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate password in real-time
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("One special character");
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  // Step 2: Reset password with token
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Show specific errors if provided
        if (data.requirements) {
          data.requirements.forEach((err) => toast.error(err));
        } else {
          toast.error(data.error || "Failed to reset password");
        }
        setIsLoading(false);
        return;
      }

      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error("Poor network connection");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      {step === 1 ? (
        <form
          onSubmit={handleRequestReset}
          className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200 shadow-sm p-4 shadow-black rounded-2xl leading-loose"
        >
          <h2 className="text-center text-xl font-bold text-orange-700">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a reset link.
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-center bg-linear-to-r rounded-md from-orange-600 via-orange-300 to-orange-600">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white font-bold text-xl disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendToken}
              disabled={isLoading || resendCooldown > 0 || !email}
              className="text-blue-500 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Email"}
            </button>
          </div>

          <span>
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </span>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200 shadow-sm p-4 shadow-black rounded-2xl leading-loose"
        >
          <h2 className="text-center text-xl font-bold text-orange-700">
            Enter New Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter the token from your email and create a strong password.
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="token">Reset Token</label>
            <input
              type="text"
              id="token"
              required
              className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              required
              className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div className="text-xs">
              <p className="font-bold">Password Requirements:</p>
              <ul className="list-disc list-inside">
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <li
                    key={index}
                    className={
                      passwordErrors.includes(
                        req.split(" ")[0] + " " + req.split(" ")[1],
                      )
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Password match indicator */}
          {confirmPassword && (
            <p
              className={`text-xs ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`}
            >
              {newPassword === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}

          <div className="text-center bg-linear-to-r rounded-md from-orange-600 via-orange-300 to-orange-600">
            <button
              type="submit"
              disabled={
                isLoading ||
                passwordErrors.length > 0 ||
                newPassword !== confirmPassword
              }
              className="text-white font-bold text-xl disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <span>
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </span>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
