import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import "../../styles/NavSidebar.css";

const NavSidebar = ({ navigationItems, children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState(navigationItems[0]?.path || "");

  const user = {
    first_name: localStorage.getItem("first_name") || "Unknown",
    middle_name: localStorage.getItem("middle_name") || "",
    last_name: localStorage.getItem("last_name") || "User",
    suffix: localStorage.getItem("suffix") || "",
    user_id: localStorage.getItem("user_id") || "",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h1 className="navbar-title">UVluate</h1>
        </div>
        <div className="navbar-actions">
          <Button type="primary" className="logout-button" onClick={handleLogout}>
            <LogoutOutlined /> Logout
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="layout-container">
        {/* Sidebar */}
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <div className="sidebar-menu">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                className={`sidebar-button ${activePage === item.path ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.path);
                  navigate(item.path);
                }}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {/* User Card */}
          <div className="sidebar-footer">
            {!collapsed ? (
              <div className="user-card">
                <div className="user-info">
                  <p className="user-name">
                    {user.first_name} {user.middle_name && user.middle_name + " "} {user.last_name} {user.suffix}
                  </p>
                  <p className="user-id">ID: {user.user_id}</p>
                </div>
                <Button shape="circle" icon={<SettingOutlined />} className="settings-button" />
              </div>
            ) : (
              <Button shape="circle" icon={<SettingOutlined />} className="settings-button" />
            )}
            <div className="sidebar-footer-text">© 2025 UVluate</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;
