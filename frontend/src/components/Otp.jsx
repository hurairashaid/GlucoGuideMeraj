import axios from "axios";
import React, { useState, useRef,useEffect } from "react";
import { BaseURL } from "../apiBaseURL/BaseURL";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export function Otp({ length = 6 }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow single digit input
    if (value.match(/^\d$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }

    // Move focus to previous input on backspace
    if (value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    console.log("OTP:", parseInt(otpString));
    const otpCode = parseInt(otpString);
    // Check for empty input fields
    if (otp.includes("")) {
      toast.error("All OTP fields must be filled.");
      return;
    }
    try {
      const response = await axios.post(`${BaseURL}/verify`, {
        code: otpCode,
        email: JSON.parse(localStorage.getItem("email")),
      });
      console.log("Verification response:", response.data);
      const token = response.data.token;
      const loginToken = localStorage.setItem("token", JSON.stringify(token));
      console.log("Token:", token);
      if (token) {
        toast.success("OTP Verified");
        navigate("/dashboard/patientHome");
      }
      if (response.data.error === "Invalid OTP") {
        toast.error("Invalid OTP");
        
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };
  useEffect(() => {
    toast.success("OTP sent to your email");
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-5 p-4 d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4" style={{ color: "#fff" }}>
          Enter OTP
        </h2>
        <div className="d-flex justify-content-center">
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputs.current[index] = el)}
              className="form-control mx-1 text-center"
              style={{
                width: "3rem",
                height: "3rem",
                fontSize: "1.5rem",
                borderRadius: "5px",
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "5px",
              transition: "background 0.3s ease",
            }}
          >
            Verify
          </button>
        </div>
      </div>
      {/* Toastify */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </form>
  );
}
