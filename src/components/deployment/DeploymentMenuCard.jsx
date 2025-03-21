import { useState, useEffect } from "react";
import { Button, Tooltip, message } from "antd";
import { DeleteOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { apiPost, apiDelete } from "../../utils/apiHelper";
import SelectInstructorOverlay from "./SelectInstructorOverlay"; // ✅ New overlay for instructor selection
import { useIndexedDB } from "../../utils/indexedDBHelper"; // ✅ Import IndexedDB helper
import "../../styles/deploymentmenucard.css"; // ✅ External CSS

const DeploymentMenuCard = ({ deployment, onRefetch }) => {
const [selectedInstructor, setSelectedInstructor] = useState(deployment.instructor_name || "---");
const [loading, setLoading] = useState(false);
const [isOverlayOpen, setIsOverlayOpen] = useState(false); // ✅ Controls overlay visibility
const { remove } = useIndexedDB("assignedSubjects"); // ✅ Get remove function from IndexedDB

const handleDelete = async () => {
  setLoading(true);

  const response = await apiDelete(`/deployment/delete/${deployment.evaluation_id}`);

  if (response.success) {
    message.success("Deployment removed successfully!");


    try {
      await remove(deployment.subject_code);
    } catch (error) {
    }

    onRefetch(); // ✅ Refresh UI
  } else {
    message.error(response.message || "Failed to remove deployment.");
  }

  setLoading(false);
};

  const handleInstructorChange = async (newInstructor) => {
    setLoading(true);

    const response = await apiPost("/deployment/deploy-instructor", {
      evaluation_id: deployment.evaluation_id,
      instructor_id: newInstructor.id,
    });

    if (response.success) {
      message.success("Instructor updated successfully!");
      setSelectedInstructor(newInstructor.name); // ✅ Update displayed instructor name
      onRefetch();
    } else {
      message.error("Failed to update instructor.");
    }

    setLoading(false);
  };

  return (
    <div className="deployment-card">
      {/* Subject Name */}
      <div className="deployment-column">
        <label className="deployment-label">Subject Name</label>
        <span className="deployment-subject">{deployment.subject_name}</span>
      </div>

      {/* Instructor Selection - Opens Overlay */}
      <div className="deployment-column">
        <label className="deployment-label">Assigned Instructor</label>
        <Button type="link" icon={<UserSwitchOutlined />} onClick={() => setIsOverlayOpen(true)}>
          {selectedInstructor}
        </Button>
      </div>

      {/* Start On and Ends On Dates */}
      <div className="deployment-column">
        <label className="deployment-label">Started On</label>
        <span className="deployment-date">{deployment.started_on ? deployment.started_on : "N/A"}</span>
      </div>
      <div className="deployment-column">
        <label className="deployment-label">Ends On</label>
        <span className="deployment-date">{deployment.end_on ? deployment.end_on : "N/A"}</span>
      </div>

      {/* Delete Button (Only if NOT deployed) */}
      {deployment.is_deployed === "N" && (
        <Tooltip title="Remove Deployment">
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={loading} />
        </Tooltip>
      )}

      {/* Instructor Selection Overlay */}
      {isOverlayOpen && (
        <SelectInstructorOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          onSelect={handleInstructorChange}
        />
      )}
    </div>
  );
};

export default DeploymentMenuCard;
