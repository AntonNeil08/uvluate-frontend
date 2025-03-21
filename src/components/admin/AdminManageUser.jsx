@ -1,25 +1,34 @@
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import React from "react";
import DeanStudentList from "../deanlist/DeanList";
import CreateDeanForm from "../deanlist/CreateDeanForm"; // Corrected import
import CreateAdminForm from "../deanlist/CreateAdminForm";
=======
=======
>>>>>>> Stashed changes
import React, { useState } from "react";
import { Button } from "antd";
import StudentPage from "../../pages/StudentPage";
import "../../styles/AdminManageUser.css"; // Import the CSS
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default function AdminManageUser() {
  const [activeTab, setActiveTab] = useState("students");

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div>
      <CreateDeanForm /> 
      <CreateAdminForm /> {/* Inserted Dean Form */}
      <DeanStudentList />
=======
=======
>>>>>>> Stashed changes
    <div className="admin-manage-user">
      <h1 className="admin-title">Manage Users</h1>

@ -42,6 +51,9 @@ export default function AdminManageUser() {
          {activeTab === "faculty" && <div className="placeholder-message">Faculty Management Coming Soon...</div>}
        </div>
      </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </div>
  );
