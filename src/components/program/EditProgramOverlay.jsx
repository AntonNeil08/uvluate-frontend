import { useEffect, useState } from "react";
import { Modal, Input, Button, Select, Tooltip, message } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiGet, apiPost } from "../../utils/apiHelper";

const EditProgramOverlay = ({ program, onClose, onRefetch }) => {
  const [programName, setProgramName] = useState(program?.program_name || "");
  const [departmentId, setDepartmentId] = useState(program?.department_id || null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(""); // ✅ Delete confirmation input
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ Show delete input only after clicking delete

  // Fetch available departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await apiGet("/academic/departments");
      if (response.success) {
        setDepartments(response.data);
      }
    };

    fetchDepartments();
  }, []);

  const handleEdit = async () => {
    if (!programName.trim() || !departmentId) {
      message.error("Both department and program name are required.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/programs/edit", {
      id: program.id,
      program_name: programName,
      department_id: departmentId,
    });

    if (response.success) {
      message.success("Program updated successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch programs
    } else {
      message.error(response.message || "Failed to update program.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== program.program_name) {
      message.error("Program name does not match. Please type it correctly.");
      return;
    }

    setLoading(true);
    const response = await apiPost(`/academic/delete/program/${program.id}`);

    if (response.success) {
      message.success("Program deleted successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch programs
    } else {
      message.error(response.message || "Failed to delete program.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false} className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
      {/* Close Button at Top Right */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Program</h3>
        <Tooltip title="Close">
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </Tooltip>
      </div>

      {/* Department Dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Department</label>
        <Select
          value={departmentId}
          onChange={setDepartmentId}
          className="w-full"
          placeholder="Select Department"
        >
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.id}>
              {dept.department_name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Program Name Input */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Program Name</label>
        <Input
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          placeholder="Enter new program name"
        />
      </div>

      {/* Delete Confirmation Input (Only Appears After Clicking Delete) */}
      {showDeleteConfirm && (
        <div className="mb-4">
          <label className="block font-medium mb-1 text-red-500">Type the program name to confirm delete:</label>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={`Type "${program.program_name}"`}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="primary" onClick={handleEdit} loading={loading}>
          Save Changes
        </Button>
        {!showDeleteConfirm ? (
          <Button danger icon={<DeleteOutlined />} onClick={() => setShowDeleteConfirm(true)}>
            Delete Program
          </Button>
        ) : (
          <Button danger onClick={handleDelete} loading={loading} disabled={deleteConfirm !== program.program_name}>
            Confirm Delete
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default EditProgramOverlay;
