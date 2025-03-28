import { useState } from "react";
import { Modal, Input, Button, Tooltip, message } from "antd";
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { apiPost } from "../../utils/apiHelper"; // ✅ Use POST as it's a soft delete
import "../../styles/editdepartmentoverlay.css";

const EditDepartmentOverlay = ({ department, onClose, onRefetch }) => {
  const [newName, setNewName] = useState(department?.department_name || "");
  const [showDeleteField, setShowDeleteField] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!newName.trim()) {
      message.error("Department name cannot be empty.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/departments/edit", {
      id: department.id,
      department_name: newName,
    });

    if (response.success) {
      message.success("Department updated successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch departments
    } else {
      message.error(response.message || "Failed to update department.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== department.department_name) {
      message.error("Department name does not match. Please type it correctly.");
      return;
    }

    setLoading(true);
    // ✅ Send POST request with type and id in the URL
    const response = await apiPost(`/academic/delete/department/${department.id}`);

    if (response.success) {
      message.success("Department deleted successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch departments
    } else {
      message.error(response.message || "Failed to delete department.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false} className="edit-department-modal">
      {/* Close Button at Top Right */}
      <div className="modal-header">
        <h3>Edit Department</h3>
        <Tooltip title="Close">
          <Button type="text" icon={<CloseOutlined />} className="close-btn" onClick={onClose} />
        </Tooltip>
      </div>

      {/* Rename Field */}
      <div className="modal-content">
        <label className="input-label">Department Name</label>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new department name" />
      </div>

      {/* Action Buttons */}
      <div className="modal-footer">
        <Button type="primary" onClick={handleEdit} loading={loading}>
          Save Changes
        </Button>
        {!showDeleteField ? (
          <Button danger onClick={() => setShowDeleteField(true)}>
            Delete Department
          </Button>
        ) : (
          <Tooltip title="Type the department name to confirm delete">
            <Button danger disabled={deleteConfirm !== department.department_name} onClick={handleDelete} loading={loading}>
              Confirm Delete
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Delete Confirmation Field (Only Shows After Clicking Delete) */}
      {showDeleteField && (
        <div className="delete-confirm">
          <ExclamationCircleOutlined className="warning-icon" />
          <span>Type the department name to confirm deletion:</span>
          <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={`Type "${department.department_name}"`} />
        </div>
      )}
    </Modal>
  );
};

export default EditDepartmentOverlay;
