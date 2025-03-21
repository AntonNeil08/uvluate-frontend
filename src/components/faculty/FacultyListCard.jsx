import React from "react";
import { KeyOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import "../../styles/facultylistcard.css";

const FacultyListCard = ({ faculty, onResetPassword, onEdit, onActivateDeactivateUser }) => {
  const { name, user_id, department, email, user_type } = faculty;

  // Convert user_type to a number
  const numericUserType = Number(user_type);

  // Apply positive (green) or negative (red) background based on user_type
  const cardClass = numericUserType > 0 ? "faculty-card positive" : "faculty-card negative";

  return (
    <div className="faculty-card-container">
      <div className={cardClass}>
        <div className="faculty-info">
          <h2 className="faculty-name">
            {name} <span className="faculty-id">({user_id})</span>
          </h2>
          <p className="faculty-details">
            <strong>Department:</strong> {department}
          </p>
          <p className="faculty-email">
            <strong>Email:</strong> {email}
          </p>
        </div>

        {/* Action Icons */}
        <div className="action-icons">
          <div className="action-button edit" onClick={onEdit}>
            <SettingOutlined />
          </div>
          <div className="action-button reset" onClick={onResetPassword}>
            <KeyOutlined />
          </div>
          <div className="action-button deactivate" onClick={onActivateDeactivateUser}>
            <UserOutlined />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyListCard;
