import { useEffect, useState } from "react";
import { Modal, Input, Card, Checkbox, Button, message } from "antd";
import { apiGet, apiPost } from "../../../utils/apiHelper";

const AssignEvaluationOverlay = ({ student_id, onClose, onRefetch }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState("");

  // ✅ Fetch deployed evaluations
  const fetchEvaluations = async () => {
    try {
      const res = await apiGet("/deployment/evaluations-deployed");
      if (res.success) {
        setEvaluations(res.data);
        setFiltered(res.data);
      } else {
        message.error("Failed to load evaluations.");
      }
    } catch (err) {
      message.error("Error fetching evaluations.");
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  // ✅ Search logic
  const handleSearch = (value) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const results = evaluations.filter(
      (e) =>
        e.subject_name.toLowerCase().includes(lower) ||
        e.subject_code.toLowerCase().includes(lower) ||
        e.instructor_name.toLowerCase().includes(lower) ||
        e.instructor_id.toLowerCase().includes(lower)
    );
    setFiltered(results);
  };

  // ✅ Toggle checkbox
  const handleCheck = (checked, item) => {
    const updated = { ...selected };
    const code = item.subject_code;

    if (checked) {
      updated[code] = item.section_assignment_id;
    } else {
      delete updated[code];
    }
    setSelected(updated);
  };

  const isSelected = (code, id) => selected[code] === id;

  return (
    <Modal
      open
      title="Assign Evaluation"
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="assign"
          type="primary"
          disabled={Object.keys(selected).length === 0}
          onClick={async () => {
            try {
              const payload = {
                student_id, // ✅ used directly
                section_assignment_ids: Object.values(selected),
              };

              const res = await apiPost("/deployment/assign-student", payload);

              if (res.success) {
                message.success("Evaluations assigned.");
                onClose();
                onRefetch();
              } else {
                message.error(res.message || "Assignment failed.");
              }
            } catch (err) {
              message.error("Server error.");
            }
          }}
        >
          Assign
        </Button>,
      ]}
    >
      {/* ✅ Search */}
      <Input
        placeholder="Search by subject, code, instructor..."
        id="evaluation-search"
        name="evaluation-search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        allowClear
        style={{ marginBottom: "1rem" }}
      />

      {/* ✅ Scrollable card list */}
      <div style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "0.5rem" }}>
        {filtered.map((item) => {
          if (
            selected[item.subject_code] &&
            selected[item.subject_code] !== item.section_assignment_id
          ) {
            return null;
          }

          return (
            <div
              key={item.section_assignment_id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                gap: "1rem",
              }}
            >
              {/* Checkbox */}
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <Checkbox
                  checked={isSelected(item.subject_code, item.section_assignment_id)}
                  onChange={(e) => handleCheck(e.target.checked, item)}
                />
              </div>

              {/* Evaluation Card */}
              <Card style={{ width: "100%" }} bodyStyle={{ padding: "0.75rem 1rem" }}>
                <div style={{ fontWeight: 600 }}>
                  {item.subject_name} ({item.subject_code})
                </div>
                <div style={{ marginBottom: "0.25rem" }}>
                  {item.instructor_name} ({item.instructor_id})
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  {item.school_year} – {item.semester}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  Starts On: {item.started_on} | Ends On: {item.ended_on}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default AssignEvaluationOverlay;
