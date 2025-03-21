import React, { useState } from "react";
import { Button } from "antd";
import StudentPage from "../../pages/StudentPage";
import "../../styles/AdminManageUser.css"; // Import the CSS

export default function AdminManageUser() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="admin-manage-user">
      <h1 className="admin-title">Manage Users</h1>

      {/* User Role Tabs */}
      <div className="user-tabs">
        <Button type={activeTab === "admin" ? "primary" : "default"} onClick={() => setActiveTab("admin")}>Admin</Button>
        <Button type={activeTab === "dean" ? "primary" : "default"} onClick={() => setActiveTab("dean")}>Dean</Button>
        <Button type={activeTab === "coordinator" ? "primary" : "default"} onClick={() => setActiveTab("coordinator")}>Coordinator</Button>
        <Button type={activeTab === "faculty" ? "primary" : "default"} onClick={() => setActiveTab("faculty")}>Faculty</Button>
        <Button type={activeTab === "students" ? "primary" : "default"} onClick={() => setActiveTab("students")}>Students</Button>
      </div>

      {/* Content Container */}
      <div className="content-container">
        <div className="content-area">
          {activeTab === "students" && <StudentPage />}
          {activeTab === "admin" && <div className="placeholder-message">Admin Management Coming Soon...</div>}
          {activeTab === "dean" && <div className="placeholder-message">Dean Management Coming Soon...</div>}
          {activeTab === "coordinator" && <div className="placeholder-message">Coordinator Management Coming Soon...</div>}
          {activeTab === "faculty" && <div className="placeholder-message">Faculty Management Coming Soon...</div>}
        </div>
      </div>
    </div>
  );
}
