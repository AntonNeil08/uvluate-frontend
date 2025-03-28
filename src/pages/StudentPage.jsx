import React, { useState } from "react";
import { Button } from "antd";
import StudentList from "../components/student/studentlist/StudentList";
const StudentPage = () => {
  const [activeButton, setActiveButton] = useState("show");

  return (
    <div className="student-page">
      {/* Buttons Always Stay on Top */}
      <div className="button-container">
        <Button
          type={activeButton === "show" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveButton("show")}
        >
          Show Students
        </Button>
        <Button
          type={activeButton === "create" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveButton("create")}
        >
          Create Student
        </Button>
      </div>

      {/* Content Section */}
      <div className="content-area">
        {activeButton === "show" && <StudentList/>}
        {activeButton === "create" && <div className="placeholder-message">Create Student Form Coming Soon...</div>}
      </div>
    </div>
  );
};

export default StudentPage;
