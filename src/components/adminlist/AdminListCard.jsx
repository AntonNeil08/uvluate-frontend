import React from "react";
import { SettingOutlined, KeyOutlined, UserSwitchOutlined } from "@ant-design/icons";
import "../../styles/adminlistcard.css";

const AdminListCard = ({ data, onEdit, onResetPassword, onToggleStatus }) => {
  const { first_name, middle_name, last_name, suffix, email, user_type, id } = data;

  // Dynamic background based on user_type
  const cardClass = user_type > 0 ? "admin-card positive" : "admin-card negative";

  return (
    <div className={cardClass}>
      <h3>
        {first_name} {middle_name} {last_name} {suffix}
      </h3>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>User Type:</strong> {user_type}</p>

      <div className="action-icons">
        <span title="Edit" onClick={() => onEdit(data)}>
          <SettingOutlined />
        </span>
        <span title="Reset Password" onClick={() => onResetPassword(data)}>
          <KeyOutlined />
        </span>
        <span title="Deactivate / Reactivate" onClick={() => onToggleStatus(data)}>
          <UserSwitchOutlined />
        </span>
      </div>
    </div>
  );
};

export default AdminListCard;
