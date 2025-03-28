import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../utils/apiHelper";
import LoginForm from "../components/authentication/LoginForm";
import OTPForm from "../components/authentication/OTPForm";
import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import "../styles/loginpage.css";
import logo from "../assets/uv_logo.png"; // Import logo image

const LoginPage = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("themeChange", { detail: newMode ? "dark" : "light" }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleOTPVerified = async () => {
      const userId = localStorage.getItem("user_id");
      const userType = localStorage.getItem("user_type");

      if (!userId || !userType) return;

      const jwtResponse = await apiPost("auth/generate-jwt", { user_id: userId, user_type: userType });

      if (jwtResponse.success) {
        localStorage.setItem("token", jwtResponse.data.token);

        const userRoutes = {
          "1": "/admin-dashboard",
          "2": "/dean-dashboard",
          "3": "/coordinator-dashboard",
          "4": "/faculty-dashboard",
          "5": "/student-dashboard",
          "6": "/privileged-faculty-dashboard",
        };

        navigate(userRoutes[userType] || "/login");
      }
    };

    window.addEventListener("otpVerified", handleOTPVerified);
    return () => {
      window.removeEventListener("otpVerified", handleOTPVerified);
    };
  }, [navigate]);

  return (
    <div className={`login-page ${darkMode ? "login-page-dark" : "login-page-light"}`}>
      <div className="login-content">
        <div className="welcome-text">
          <img src={logo} alt="UVluate Logo" className="welcome-logo" /> {/* Logo added */}
          <h1>Hi! Welcome to UVluate</h1>
          <p>An AI-powered platform for faculty performance assessment, fostering feedback-driven improvement.</p>
          <p className="copyright-text">© 2025 UVluate</p>
        </div>

        <div className={`form-container ${darkMode ? "form-dark" : "form-light"}`}>
          {!showOTP ? <LoginForm onSuccess={() => setShowOTP(true)} /> : <OTPForm />}
        </div>
      </div>

      <div className="theme-toggle">
        <Switch
          checked={darkMode}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className="theme-switch"
        />
      </div>
    </div>
  );
};

export default LoginPage;
