import { useState } from "react";
import { Modal, Input, Button, Tooltip, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { apiPost } from "../../utils/apiHelper";
import "../../styles/createdepartmentoverlay.css";

const CreateDepartmentOverlay = ({ onClose, onRefetch }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!departmentName.trim()) {
      message.error("Department name cannot be empty.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/departments/create", {
      department_name: departmentName,
    });

    if (response.success) {
      message.success("Department created successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch departments after creation
    } else {
      message.error(response.message || "Failed to create department.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false} className="create-department-modal">
      {/* Close Button at Top Right */}
      <div className="modal-header">
        <h3>Create New Department</h3>
        <Tooltip title="Close">
          <Button type="text" icon={<CloseOutlined />} className="close-btn" onClick={onClose} />
        </Tooltip>
      </div>

      {/* Department Name Input */}
      <div className="modal-content">
        <label className="input-label">Department Name</label>
        <Input
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Enter department name"
        />
      </div>

      {/* Action Buttons */}
      <div className="modal-footer">
        <Button type="primary" onClick={handleCreate} loading={loading}>
          Create Department
        </Button>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default CreateDepartmentOverlay;
