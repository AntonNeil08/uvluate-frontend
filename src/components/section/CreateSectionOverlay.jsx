import { useState } from "react";
import { Modal, Input, Button, Tooltip, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { apiPost } from "../../utils/apiHelper";

const CreateSectionOverlay = ({ onClose, onRefetch }) => {
  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve department, program, and year from localStorage
  const department = JSON.parse(localStorage.getItem("department")) || null;
  const program = JSON.parse(localStorage.getItem("program")) || null;
  const year = JSON.parse(localStorage.getItem("year")) || null;

  const handleCreate = async () => {
    if (!sectionName.trim()) {
      message.error("Section name cannot be empty.");
      return;
    }

    if (!year || !year.id) {
      message.error("No year selected.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/sections/create", {
      year_id: year.id,
      section_name: sectionName,
    });

    if (response.success) {
      message.success("Section created successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch sections
    } else {
      message.error(response.message || "Failed to create section.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false}>
      {/* Header */}
      <div className="modal-header flex justify-between items-center">
        <h3 className="text-lg font-semibold">Create Section</h3>
        <Tooltip title="Close">
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </Tooltip>
      </div>

      {/* Read-Only Fields */}
      <div className="modal-content">
        <label className="block font-medium">Department</label>
        <Input value={department?.name || "No Department Selected"} readOnly className="bg-gray-100" />

        <label className="block font-medium mt-2">Program</label>
        <Input value={program?.name || "No Program Selected"} readOnly className="bg-gray-100" />

        <label className="block font-medium mt-2">Year Level</label>
        <Input value={year?.name || "No Year Selected"} readOnly className="bg-gray-100" />
      </div>

      {/* Section Name Input */}
      <div className="modal-content">
        <label className="block font-medium mt-2">Section Name</label>
        <Input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="Enter section name" />
      </div>

      {/* Action Buttons */}
      <div className="modal-footer flex justify-end gap-2 mt-4">
        <Button type="primary" onClick={handleCreate} loading={loading}>
          Create Section
        </Button>
      </div>
    </Modal>
  );
};

export default CreateSectionOverlay;
