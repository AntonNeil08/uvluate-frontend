import { useEffect, useState } from "react";
import { Modal, Input, Button, Select, Tooltip, message } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiGet, apiPost } from "../../utils/apiHelper";

const EditSectionOverlay = ({ section, onClose, onRefetch }) => {
  const [sectionName, setSectionName] = useState(section?.section_name || "");
  const [yearId, setYearId] = useState(section?.year_id || null);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Retrieve department & program from localStorage
  const department = JSON.parse(localStorage.getItem("department")) || null;
  const program = JSON.parse(localStorage.getItem("program")) || null;

  // ✅ Fetch available years for the selected program (Runs once when `program.id` changes)
  useEffect(() => {
    const fetchYears = async () => {
      if (!program || !program.id) return;

      try {
        const response = await apiGet(`/academic/year-levels/by-program/${program.id}`);
        if (response.success) {
          setYears(response.data);
        }
      } catch (error) {
        message.error("Failed to fetch years.");
      }
    };

    fetchYears();
  }, [program?.id]); // ✅ Only re-fetch when `program.id` changes

  const handleEdit = async () => {
    if (!sectionName.trim() || !yearId) {
      message.error("Year level and section name are required.");
      return;
    }

    setLoading(true);
    const response = await apiPost("/academic/sections/edit", {
      id: section.id,
      section_name: sectionName,
      year_id: yearId,
    });

    if (response.success) {
      message.success("Section updated successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch sections
    } else {
      message.error(response.message || "Failed to update section.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== section.section_name) {
      message.error("Section name does not match. Please type it correctly.");
      return;
    }

    setLoading(true);
    const response = await apiPost(`/academic/delete/section/${section.id}`);

    if (response.success) {
      message.success("Section deleted successfully!");
      onClose();
      onRefetch(); // ✅ Re-fetch sections
    } else {
      message.error(response.message || "Failed to delete section.");
    }

    setLoading(false);
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} closable={false}>
      {/* Header */}
      <div className="modal-header flex justify-between items-center">
        <h3 className="text-lg font-semibold">Edit Section</h3>
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
      </div>

      {/* Year Dropdown */}
      <div className="modal-content">
        <label className="block font-medium mt-2">Year Level</label>
        <Select
          value={yearId}
          onChange={setYearId}
          className="w-full"
          placeholder="Select Year Level"
        >
          {years.map((year) => (
            <Select.Option key={year.id} value={year.id}>
              {year.year_level}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Section Name Input */}
      <div className="modal-content">
        <label className="block font-medium mt-2">Section Name</label>
        <Input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="Enter section name" />
      </div>

      {/* Delete Confirmation Input (Only Appears After Clicking Delete) */}
      {showDeleteConfirm && (
        <div className="modal-content">
          <label className="block font-medium mt-2 text-red-500">Type the section name to confirm delete:</label>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={`Type "${section.section_name}"`}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="modal-footer flex justify-end gap-2 mt-4">
        <Button type="primary" onClick={handleEdit} loading={loading}>
          Save Changes
        </Button>
        {!showDeleteConfirm ? (
          <Button danger icon={<DeleteOutlined />} onClick={() => setShowDeleteConfirm(true)}>
            Delete Section
          </Button>
        ) : (
          <Button danger onClick={handleDelete} loading={loading} disabled={deleteConfirm !== section.section_name}>
            Confirm Delete
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default EditSectionOverlay;
