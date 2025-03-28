import { useState } from "react";
import { Button, Tooltip, message } from "antd";
import { DeleteOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { apiPost, apiDelete } from "../../utils/apiHelper";
import SelectInstructorOverlay from "./SelectInstructorOverlay";
import { useIndexedDB } from "../../utils/indexedDBHelper";
import "../../styles/deploymentmenucard.css";

const DeploymentMenuCard = ({ deployment, onRefetch }) => {
  const [selectedInstructor, setSelectedInstructor] = useState(deployment.instructor_name || "---");
  const [loading, setLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { remove } = useIndexedDB("assignedSubjects");

  const handleDelete = async () => {
    setLoading(true);

    const response = await apiDelete(`/deployment/delete/${deployment.section_assignment_id}`);

    if (response.success) {
      message.success("Deployment removed successfully!");

      try {
        await remove(deployment.subject_code);
      } catch (error) {
        console.warn("IndexedDB removal failed", error);
      }

      onRefetch();
    } else {
      message.error(response.message || "Failed to remove deployment.");
    }

    setLoading(false);
  };

  const handleInstructorChange = async (newInstructor) => {
    setLoading(true);

    const response = await apiPost("/deployment/assign-instructor", {
      section_assignment_id: deployment.section_assignment_id,
      instructor_id: newInstructor.id,
    });

    if (response.success) {
      message.success("Instructor updated successfully!");
      setSelectedInstructor(newInstructor.name);
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

      {/* Instructor */}
      <div className="deployment-column">
        <label className="deployment-label">Assigned Instructor</label>
        <Tooltip title={deployment.is_deployed === "Y" ? "Already Deployed" : "Change Instructor"}>
          <Button
            type="link"
            icon={<UserSwitchOutlined />}
            onClick={() => setIsOverlayOpen(true)}
            disabled={deployment.is_deployed === "Y"} // ✅ Disable if deployed
          >
            {selectedInstructor}
          </Button>
        </Tooltip>
      </div>

      {/* Start / End Dates */}
      <div className="deployment-column">
        <label className="deployment-label">Started On</label>
        <span className="deployment-date">{deployment.started_on || "N/A"}</span>
      </div>
      <div className="deployment-column">
        <label className="deployment-label">Ends On</label>
        <span className="deployment-date">{deployment.ended_on || "N/A"}</span>
      </div>

      {/* Delete Button (Only for Non-Deployed) */}
      {deployment.is_deployed === "N" && (
        <Tooltip title="Remove Deployment">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={loading}
            disabled={loading}
          />
        </Tooltip>
      )}

      {/* Instructor Overlay */}
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
