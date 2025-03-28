import { useEffect, useState } from "react";
import { Modal, Input, Button, Tooltip, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { apiPost } from "../../utils/apiHelper";
import "../../styles/createprogram.css"; // ✅ External CSS

const CreateProgram = ({ onClose, onRefetch }) => {
  const [programName, setProgramName] = useState("");
  const [department, setDepartment] = useState(
    JSON.parse(localStorage.getItem("department")) || null
  );
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!programName.trim()) {
      message.error("Program name cannot be empty.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/programs/create", {
      program_name: programName,
      department_id: department.id,
    });

    if (response.success) {
      message.success("Program created successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch programs
    } else {
      message.error(response.message || "Failed to create program.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false} className="create-program-modal">
      {/* Close Button at Top Right */}
      <div className="modal-header">
        <h3>Create New Program</h3>
        <Tooltip title="Close">
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </Tooltip>
      </div>

      {/* Department Name (Read-Only) */}
      <div className="modal-content">
        <label className="input-label">Department</label>
        <Input value={department?.name || "No Department Selected"} readOnly className="readonly-field" />
      </div>

      {/* Program Name Input */}
      <div className="modal-content">
        <label className="input-label">Program Name</label>
        <Input
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          placeholder="Enter program name"
        />
      </div>

      {/* Action Buttons */}
      <div className="modal-footer">
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleCreate} loading={loading}>
          Create Program
        </Button>
      </div>
    </Modal>
  );
};

export default CreateProgram;
