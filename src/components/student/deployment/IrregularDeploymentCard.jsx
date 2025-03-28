import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "../../../styles/IrregularDeploymentCard.css";

const IrregularDeploymentCard = ({ student }) => {
  const navigate = useNavigate();

  const handleManageClick = () => {
    navigate(`/deployment/manage-student/${student.id}`, { state: { student } });
  };

  return (
    <div className="irregular-card">
      <div className="student-info">
        <h4 className="student-name">{student.first_name} {student.last_name}</h4>
        <p className="student-id"><strong>ID:</strong> {student.id}</p>
        <p className="student-department"><strong>Department:</strong> {student.department_name}</p>
        <p className="student-program"><strong>Program:</strong> {student.program_name}</p>
        <p className="student-year"><strong>Year Level:</strong> {student.year_level}</p>
        <p className="student-section"><strong>Section:</strong> {student.section_name}</p>
      </div>

      <Tooltip title="Manage Student">
        <Button
          type="default"
          icon={<SettingOutlined />}
          onClick={handleManageClick}
        >
          Manage
        </Button>
      </Tooltip>
    </div>
  );
};

export default IrregularDeploymentCard;
