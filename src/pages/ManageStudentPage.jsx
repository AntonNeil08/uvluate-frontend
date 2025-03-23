import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/apiHelper";
import {
  Spin,
  message,
  Card,
  Collapse,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import AssignEvaluationOverlay from "../components/student/deployment/AssignEvaluationOverlay";
import "../styles/managestudentpage.css";

const { Panel } = Collapse;

const ManageStudentPage = () => {
  const location = useLocation();
  const params = useParams();
  const student = location.state?.student;
  const studentId = student?.id || params.studentId;

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYearKey, setActiveYearKey] = useState(null);
  const [activeSemesterKey, setActiveSemesterKey] = useState(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const getCurrentSemester = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 8 && month <= 12) return "1st sem";
    if (month >= 1 && month <= 5) return "2nd sem";
    return "summer";
  };

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await apiGet(`/deployment/evaluations-by-student/${studentId}`);
      if (response.success) {
        const data = response.data;
        setEvaluations(data);

        const sortedYears = [...new Set(data.map((e) => e.school_year))].sort().reverse();
        const latestYear = sortedYears[0];
        const currentSemester = getCurrentSemester();

        setActiveYearKey(latestYear);
        setActiveSemesterKey(`${latestYear}-${currentSemester}`);
      } else {
        message.error("Failed to fetch student evaluations.");
      }
    } catch (error) {
      message.error("An error occurred while loading data.");
    }
    setLoading(false);
  };

  const handleRemoveEvaluation = async (student_assignment_id) => {
    try {
      setLoading(true);
      const response = await apiDelete(`/deployment/remove-student-evaluation/${student_assignment_id}`, {
        student_id: studentId,
      });

      if (response.success) {
        message.success("Evaluation removed.");
        fetchEvaluations();
      } else {
        message.error(response.message || "Failed to remove evaluation.");
      }
    } catch (err) {
      message.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [studentId]);

  const grouped = {};
  evaluations.forEach((item) => {
    if (!grouped[item.school_year]) grouped[item.school_year] = {};
    if (!grouped[item.school_year][item.semester]) grouped[item.school_year][item.semester] = [];
    grouped[item.school_year][item.semester].push(item);
  });

  const isLatest = (year, semester) =>
    year === activeYearKey && `${year}-${semester}` === activeSemesterKey;

  return (
    <div className="manage-student-page">
      <div className="manage-student-header">
        <h3 className="manage-student-title">
          Manage Evaluations for {student?.first_name} {student?.last_name}
        </h3>
        <Button type="primary" onClick={() => setIsAssignOpen(true)}>
          Add Evaluation
        </Button>
      </div>
  
      {loading ? (
        <Spin />
      ) : (
        <Collapse
          accordion
          activeKey={activeYearKey}
          onChange={setActiveYearKey}
          className="manage-student-collapse"
          items={Object.entries(grouped).map(([year, semesters]) => ({
            key: year,
            label: year,
            children: (
              <Collapse
                accordion
                activeKey={activeSemesterKey}
                onChange={setActiveSemesterKey}
                items={Object.entries(semesters).map(([semester, items]) => {
                  const panelKey = `${year}-${semester}`;
                  return {
                    key: panelKey,
                    label: <span className="font-medium">{semester}</span>,
                    children: items.map((evalItem) => (
                      <Card
                        key={evalItem.section_assignment_id}
                        className="manage-student-card"
                        title={
                          <div
                            className="manage-student-card-title"
                            style={{ display: "flex", justifyContent: "space-between" }}
                          >
                            <span>{evalItem.subject_name}</span>
                            <Tooltip
                              title={
                                evalItem.is_completed === "Y"
                                  ? "Completed"
                                  : "Remove Evaluation"
                              }
                            >
                              <div>
                                <Popconfirm
                                  title="Remove this evaluation?"
                                  onConfirm={() =>
                                    handleRemoveEvaluation(evalItem.student_assignment_id)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                  disabled={evalItem.is_completed === "Y"}
                                >
                                  <Button
                                    type="text"
                                    icon={
                                      <DeleteOutlined
                                        style={{
                                          color:
                                            evalItem.is_completed === "Y"
                                              ? "#aaa"
                                              : "red",
                                          cursor:
                                            evalItem.is_completed === "Y"
                                              ? "not-allowed"
                                              : "pointer",
                                        }}
                                      />
                                    }
                                    disabled={evalItem.is_completed === "Y"}
                                  />
                                </Popconfirm>
                              </div>
                            </Tooltip>
                          </div>
                        }
                        size="small"
                      >
                        <div className="manage-student-card-body">
                          <p>
                            <strong>Subject Code:</strong> {evalItem.subject_code}
                          </p>
                          <p>
                            <strong>Instructor:</strong> {evalItem.instructor_name}
                          </p>
                          <p>
                            <strong>Start:</strong> {evalItem.started_on}
                          </p>
                          <p>
                            <strong>End:</strong> {evalItem.ended_on}
                          </p>
                          <p>
                            <strong>Completed:</strong>{" "}
                            {evalItem.is_completed === "Y" ? "Yes" : "No"}
                          </p>
                          {evalItem.is_completed === "Y" && (
                            <p>
                              <strong>Timestamp:</strong> {evalItem.timestamp}
                            </p>
                          )}
                        </div>
                      </Card>
                    )),
                  };
                })}
              />
            ),
          }))}
        />
      )}
  
      {isAssignOpen && (
        <AssignEvaluationOverlay
          student_id={studentId}
          onClose={() => setIsAssignOpen(false)}
          onRefetch={fetchEvaluations}
        />
      )}
    </div>
  );  
};

export default ManageStudentPage;