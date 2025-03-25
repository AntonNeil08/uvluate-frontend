import { useState, useEffect } from "react";
import { apiPost } from "../../utils/apiHelper";
import { Input, Button, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons";
import "../../styles/loginform.css";

const LoginForm = ({ onSuccess }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const updateTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("themeChange", updateTheme);
    window.addEventListener("storage", updateTheme);

    return () => {
      window.removeEventListener("themeChange", updateTheme);
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("User ID and Password are required.");
      return;
    }

    setLoading(true);
    const response = await apiPost("auth/login", { user_id: userId, password });
    setLoading(false);

    if (response.success) {
      localStorage.setItem("user_id", userId);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("user_type", response.data.user_type);
      localStorage.setItem("first_name", response.data.first_name || "");
      localStorage.setItem("last_name", response.data.last_name || "");
      localStorage.setItem("middle_name", response.data.middle_name || "");
      localStorage.setItem("suffix", response.data.suffix || "");

      if (response.data.user_type !== "5") {
        localStorage.setItem("department", response.data.department ? response.data.department.toString() : "");
        localStorage.setItem("program", response.data.program ? response.data.program.toString() : "");
      }

      onSuccess();
    } else {
      setError(response.message || "Login failed");
    }
  };

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="login-title">LOGIN</h2>

      {error && <Alert message={error} type="error" showIcon className="login-alert" />}

      <form onSubmit={handleLogin} className="login-form">
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Username"
          size="large"
          autoComplete="username"
          disabled={loading}
          className="login-input"
        />

        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          size="large"
          autoComplete="current-password"
          disabled={loading}
          iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          className="login-input"
        />

        <Button type="primary" htmlType="submit" className="login-button" size="large" loading={loading}>
          {loading ? <LoadingOutlined /> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
