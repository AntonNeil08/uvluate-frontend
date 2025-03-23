import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../utils/apiHelper";
import { Spin, message, Button, Tooltip, DatePicker, Modal, Alert } from "antd";
import { PlusOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import DeploymentMenuCard from "../components/deployment/deploymentMenuCard";
import SelectSubjectOverlay from "../components/deployment/SelectSubjectOverlay";
import { useIndexedDB } from "../utils/indexedDBHelper";
import "../styles/deploymentmenupage.css";

const DeploymentMenuPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [startDate, setStartDate] = useState(null); // ✅ Start Date
  const [endDate, setEndDate] = useState(null); // ✅ End Date
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Controls the modal visibility
  const { getAll, add, remove, clear } = useIndexedDB("assignedSubjects");
  const department = JSON.parse(localStorage.getItem("department"));
  const program = JSON.parse(localStorage.getItem("program"));
  const year = JSON.parse(localStorage.getItem("year"));
  const section = JSON.parse(localStorage.getItem("section"));


  // Fetch deployments by section
  const fetchDeployments = async () => {
    if (!sectionId) {
      message.error("Invalid section ID.");
      navigate("/");
      return;
    }
  
    setLoading(true);
  
    try {
      // ✅ Clear the IndexedDB store before inserting new data
      await clear();
  
      // ✅ Fetch deployments from the backend
      const response = await apiGet(`/deployment/evaluations-by-section/${sectionId}`);
  
      if (response.success) {
        const deploymentsData = response.data;
  
        // ✅ Update React state with deployments
        setDeployments(deploymentsData);
  
        // ✅ Add each subject to IndexedDB after clearing
        await Promise.all(
          deploymentsData.map((deployment) =>
            add({
              section_id: sectionId,
              subject_code: deployment.subject_code,
              subject_name: deployment.subject_name,
            })
          )
        );
      } else {
        message.error("Failed to fetch evaluations.");
      }
    } catch (error) {
      console.error("Error fetching deployments:", error);
      message.error("An error occurred while fetching evaluations.");
    }
  
    setLoading(false);
  };
  

  useEffect(() => {
    fetchDeployments();
  }, [sectionId]);

  const handleAddSubject = async (subject) => {
    setLoading(true);
    const response = await apiPost("/deployment/assign-subject", {
      section: sectionId,
      subject_codes: [subject.code],
    }); // ✅ updated endpoint
  
    if (response.success) {
      message.success(`Subject "${subject.subject_name}" added successfully!`);
      await add({
        section_id: sectionId,
        subject_code: subject.code,
        subject_name: subject.subject_name,
      });
      fetchDeployments();
    } else {
      message.error("Failed to assign subject.");
    }
  
    setLoading(false);
  };  

  // ✅ Handle Deploy Evaluation Request
  const handleDeployEvaluation = async () => {
    if (!startDate || !endDate) {
      message.error("Please select both start and end dates.");
      return;
    }
  
    setLoading(true);
    const response = await apiPost("/deployment/deploy", {
      section_id: sectionId,
      started_on: startDate.format("YYYY-MM-DD"),
      ended_on: endDate.format("YYYY-MM-DD"),
    }); // ✅ updated endpoint
  
    if (response.success) {
      message.success("Evaluation deployed successfully!");
      fetchDeployments();
    } else {
      message.error("Failed to deploy evaluation.");
    }
  
    setLoading(false);
    setIsModalOpen(false);
  };  

  return (
    <div className="deployment-menu-container">
      <h3 className="text-lg font-semibold">
        Deployment Menu for {department?.name}, {program?.name}, Year {year?.name}, Section {section?.name}
      </h3>
  
      {loading ? (
        <Spin className="deployment-spinner" />
      ) : (
        <div className="deployment-menu-list">
          {deployments.length > 0 ? (
            deployments.map((deployment) => (
              <DeploymentMenuCard
              key={deployment.section_assignment_id}
                deployment={deployment}
                onRefetch={fetchDeployments}
              />
            ))
          ) : (
            <p className="text-gray-500">No deployments found for this section.</p>
          )}
  
          {/* Add Subject Button */}
          <div className="add-subject-button">
            <Tooltip title="Assign Subject">
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => setIsOverlayOpen(true)}
              />
            </Tooltip>
          </div>
  
          {/* Centered Deploy Evaluation Button */}
          <div className="deploy-evaluation-container">
            <Tooltip title="Deploy Evaluation">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Deploy Evaluation
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
  
      {/* Select Subject Overlay */}
      {isOverlayOpen && (
        <SelectSubjectOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          onSelect={handleAddSubject}
          sectionId={sectionId}
          onRefetch={fetchDeployments}
        />
      )}
  
      {/* Deploy Evaluation Modal */}
      <Modal
        title="Deploy Evaluation"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="deploy"
            type="primary"
            onClick={handleDeployEvaluation}
            disabled={!startDate || !endDate}
          >
            Deploy
          </Button>,
        ]}
      >
        <p>Select Start and End Date for the Evaluation:</p>
        <div className="calendar-container">
          <div className="date-picker">
            <label>Start Date:</label>
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              format="YYYY-MM-DD"
              suffixIcon={<CalendarOutlined />}
            />
          </div>
  
          <div className="date-picker">
            <label>End Date:</label>
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              format="YYYY-MM-DD"
              suffixIcon={<CalendarOutlined />}
            />
          </div>
        </div>
      </Modal>
      {/* Deploy Irregular Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
        <Tooltip title="Assign Irregular Students">
          <Button
            type="default"
            onClick={() => navigate(`/deployment/irregular/${sectionId}`)}
          >
            Deploy Irregular
          </Button>
        </Tooltip>
      </div>
      {/* Notice for Irregular Students */}
      <div className="evaluation-notice">
        <Alert
          message="Note"
          description="Irregular students' evaluation needs to be assigned manually."
          type="warning"
          showIcon
          />
        </div>
    </div>
  );
};

export default DeploymentMenuPage;