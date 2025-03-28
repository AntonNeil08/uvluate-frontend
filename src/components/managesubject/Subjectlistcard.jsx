import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/subjectlistcard.css";

const SubjectListCard = ({ data, onEdit, onDelete }) => {
  const { code, subject_name } = data;

  return (
    <div className="subject-card">
      <h3>{subject_name}</h3>
      <p><strong>Code:</strong> {code}</p>

      <div className="action-icons">
        <span title="Edit" onClick={() => onEdit(data)}>
          <EditOutlined />
        </span>
        <span title="Delete" onClick={() => onDelete(data)}>
          <DeleteOutlined />
        </span>
      </div>
    </div>
  );
};

export default SubjectListCard;
