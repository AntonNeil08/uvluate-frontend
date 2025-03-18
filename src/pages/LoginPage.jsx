import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../utils/apiHelper";
import LoginForm from "../components/authentication/LoginForm";
import OTPForm from "../components/authentication/OTPForm";
import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  // Handles theme toggle and dispatches an event
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("themeChange", { detail: newMode ? "dark" : "light" }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Event listener for mode changes
    const handleThemeChange = (event) => {
      console.log(`Theme changed to: ${event.detail}`);
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Listen for OTP verification event
    const handleOTPVerified = async () => {
      const userId = localStorage.getItem("user_id");
      const userType = localStorage.getItem("user_type");

      if (!userId || !userType) {
        console.error("User ID or User Type is missing");
        return;
      }

      // Generate JWT
      const jwtResponse = await apiPost("auth/generate-jwt", { user_id: userId, user_type: userType });

      if (jwtResponse.success) {
        localStorage.setItem("token", jwtResponse.data.token);

        // Redirect based on user type
        switch (userType) {
          case "1":
            navigate("/admin-dashboard");
            break;
          case "2":
            navigate("/dean-dashboard");
            break;
          case "3":
            navigate("/coordinator-dashboard");
            break;
          case "4":
            navigate("/faculty-dashboard");
            break;
          case "5":
            navigate("/student-dashboard");
            break;
          case "6":
            navigate("/privileged-faculty-dashboard");
            break;
          default:
            navigate("/login"); // Fallback if user type is invalid
        }
      } else {
        console.error("Failed to generate JWT:", jwtResponse.message);
      }
    };

    window.addEventListener("otpVerified", handleOTPVerified);
    return () => {
      window.removeEventListener("otpVerified", handleOTPVerified);
    };
  }, [navigate]);

  return (
    <div className={`login-page ${darkMode ? "login-page-dark" : "login-page-light"}`}>
      {/* Dark Mode Toggle */}
      <div className="theme-toggle">
        <Switch
          checked={darkMode}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          className="theme-switch"
        />
      </div>

      {/* Form Switching */}
      {!showOTP ? (
        <div className={`form-container ${darkMode ? "form-dark" : "form-light"}`}>
          <LoginForm onSuccess={() => setShowOTP(true)} />
        </div>
      ) : (
        <div className={`form-container ${darkMode ? "form-dark" : "form-light"}`}>
          <OTPForm />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
