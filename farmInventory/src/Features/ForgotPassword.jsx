import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // Step 1: Email entry
  // Step 2: OTP verification
  // Step 3: Password reset
  const [step, setStep] = useState(1);

  // Email state
  const [email, setEmail] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1: Request password reset - sends OTP
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
        toast.error(data.error || "Failed to send OTP");
        setIsLoading(false);
        return;
      }

      toast.success("OTP sent to your email!");
      // Start cooldown for resend
      setResendCooldown(60);
      setTimeout(() => setResendCooldown(0), 60000);

      // Move to OTP verification step
      setStep(2);
    } catch (error) {
      toast.error("Poor network connection");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
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
        toast.success("OTP sent again");
        setResendCooldown(60);
        setTimeout(() => setResendCooldown(0), 60000);
      } else {
        toast.error(data.error || "Failed to resend");
      }
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      toast.success("OTP verified!");
      setVerificationToken(data.verificationToken);

      // Move to password reset step
      setStep(3);
    } catch (error) {
      toast.error("Poor network connection");
      console.error(error.message);
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

  // Step 3: Reset password
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
        body: JSON.stringify({ verificationToken, newPassword }),
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

  // Handle OTP input - only allow numbers and max 6 digits
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
  };

  // Go back to OTP step
  const handleBackToOtp = () => {
    setStep(2);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
  };

  return (
    <div className="flex justify-center items-center h-full">
      {/* Step 1: Email Entry */}
      {step === 1 && (
        <form
          onSubmit={handleRequestReset}
          className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200 shadow-sm p-4 shadow-black rounded-2xl leading-loose"
        >
          <h2 className="text-center text-xl font-bold text-orange-700">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you an OTP.
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
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          <span>
            <Link to="/" className="text-orange-800 font-bold hover:underline">
              Back to Login
            </Link>
          </span>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <form
          onSubmit={handleVerifyOtp}
          className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200 shadow-sm p-4 shadow-black rounded-2xl leading-loose"
        >
          <h2 className="text-center text-xl font-bold text-orange-700">
            Enter OTP
          </h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="otp">One-Time Password</label>
            <input
              type="text"
              id="otp"
              required
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="border w-[80vw] md:w-[20vw] pl-2 py-1 outline-none rounded-md font-bold text-center text-2xl tracking-[0.5em]"
              value={otp}
              onChange={handleOtpChange}
            />
          </div>

          <div className="text-center bg-linear-to-r rounded-md from-orange-600 via-orange-300 to-orange-600">
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="text-white font-bold text-xl disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading || resendCooldown > 0}
              className="text-orange-700-500 text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-orange-500 text-sm hover:underline"
            >
              Change Email
            </button>
          </div>

          <span>
            <Link to="/" className="text-orange-600 hover:underline">
              Back to Login
            </Link>
          </span>
        </form>
      )}

      {/* Step 3: Password Reset */}
      {step === 3 && (
        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-2 opacity-90 bg-linear-to-r from-yellow-200 via-white to-yellow-200 shadow-sm p-4 shadow-black rounded-2xl leading-loose"
        >
          <h2 className="text-center text-xl font-bold text-orange-700">
            Create New Password
          </h2>
          <p className="text-sm text-gray-600">
            OTP verified! Now create a strong password.
          </p>

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

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToOtp}
              className="text-orange-600 text-sm hover:underline"
            >
              Back to OTP
            </button>
          </div>

          <span>
            <Link to="/" className="text-orange-800 hover:underline">
              Back to Login
            </Link>
          </span>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
