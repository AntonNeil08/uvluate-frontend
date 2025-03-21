import { useState } from "react";
import { Button, Tooltip, message } from "antd";
import { CheckOutlined, UserAddOutlined } from "@ant-design/icons";
import { apiPost } from "../../../utils/apiHelper";
import "../../../styles/IrregularDeploymentCard.css";// ✅ External CSS

const IrregularDeploymentCard = ({ student, onRefetch }) => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false); // ✅ Assume they are not assigned yet

  const handleAssign = async () => {
    setLoading(true);
    const response = await apiPost("/student/irregular/assign", {
      student_id: student.id,
      section_id: student.section_id,
    });

    if (response.success) {
      message.success(`${student.first_name} assigned successfully!`);
      setAssigned(true);
      onRefetch();
    } else {
      message.error(response.message || "Failed to assign student.");
    }

    setLoading(false);
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

      <Tooltip title={assigned ? "Already Assigned" : "Assign Student"}>
        <Button
          type="primary"
          icon={assigned ? <CheckOutlined /> : <UserAddOutlined />}
          onClick={handleAssign}
          loading={loading}
          disabled={assigned}
        >
          {assigned ? "Assigned" : "Assign"}
        </Button>
      </Tooltip>
    </div>
  );
};

export default IrregularDeploymentCard;
