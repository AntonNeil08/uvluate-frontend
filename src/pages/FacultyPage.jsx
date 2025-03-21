import React, { useState } from "react";
import FacultyList from "../components/faculty/FacultyList";
import FacultyForm from "../components/faculty/FacultyForm";
import "../styles/facultypage.css";
import { Button } from "antd";

const FacultyPage = () => {
  const [activeButton, setActiveButton] = useState("show");

  return (
    <div className="faculty-page">
      {/* Buttons Always Stay on Top */}
      <div className="faculty-button-container">
        <Button
          type={activeButton === "show" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveButton("show")}
        >
          View Faculty
        </Button>
        <Button
          type={activeButton === "create" ? "primary" : "default"}
          size="large"
          onClick={() => setActiveButton("create")}
        >
          Add Faculty
        </Button>
      </div>

      {/* Content Section */}
      <div className="faculty-content-area">
        {activeButton === "show" && <FacultyList/>}
        {activeButton === "create" && <FacultyForm/>}
      </div>
    </div>
  );
};

export default FacultyPage;
