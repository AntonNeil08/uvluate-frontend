import { useState, useEffect } from "react";
import { apiPost } from "../../utils/apiHelper";
import { Input, Button, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons";
import "../../styles/LoginForm.css";

const LoginForm = ({ onSuccess }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    // Function to update dark mode state dynamically
    const updateTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };
    
    console.log("login form listining for theme change");
    // Listen for theme changes
    window.addEventListener("themeChange", updateTheme);
    window.addEventListener("storage", updateTheme);

    return () => {
      console.log("login form listining for theme change");
      window.removeEventListener("themeChange", updateTheme);
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent blank submission
    if (!userId.trim() || !password.trim()) {
      setError("User ID and Password are required.");
      return;
    }

    setLoading(true);
    const response = await apiPost("auth/login", { user_id: userId, password });
    setLoading(false);

    if (response.success) {
      localStorage.setItem("user_id", userId);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("user_type", response.data.user_type);
      localStorage.setItem("first_name", response.data.first_name || "");
      localStorage.setItem("last_name", response.data.last_name || "");
      localStorage.setItem("middle_name", response.data.middle_name || "");
      localStorage.setItem("suffix", response.data.suffix || "");
    
      // Only store department and program if user is NOT a student (user_type !== "5")
      if (response.data.user_type !== "5") {
        localStorage.setItem("department", response.data.department !== null ? response.data.department.toString() : "");
        localStorage.setItem("program", response.data.program !== null ? response.data.program.toString() : "");
      }
    
      onSuccess(); // ✅ Now executes correctly
    } else {
      setError(response.message || "Login failed");
    }
  };

  return (
    <div className={`login-container ${darkMode ? "login-dark" : "login-light"}`}>
      <h2 className="login-title">Login</h2>

      {error && <Alert message={error} type="error" showIcon className="login-alert" />}

      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label className="login-label">User ID</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            size="large"
            autoComplete="username"
            disabled={loading}
            status={!userId.trim() ? "error" : ""}
            className={`login-input ${darkMode ? "login-input-dark" : "login-input-light"}`}
          />
        </div>

        <div>
          <label className="login-label">Password</label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            size="large"
            autoComplete="current-password"
            disabled={loading}
            status={!password.trim() ? "error" : ""}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined className={`ant-input-password-icon ${darkMode ? "text-white" : "text-black"}`} />
              ) : (
                <EyeInvisibleOutlined className={`ant-input-password-icon ${darkMode ? "text-white" : "text-black"}`} />
              )
            }
            type={showPassword ? "text" : "password"}
            className={`login-input ${darkMode ? "login-input-dark" : "login-input-light"}`}
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className={`login-button ${darkMode ? "login-button-dark" : "login-button-primary"}`}
          size="large"
          loading={loading}
          disabled={!userId.trim() || !password.trim()} // Prevents blank submit
        >
          {loading ? <LoadingOutlined /> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
