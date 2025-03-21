import { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import { Button, Spin, Tooltip } from "antd";
import { SettingOutlined, PlusOutlined } from "@ant-design/icons";
import EditProgramOverlay from "./EditProgramOverlay";
import CreateProgramOverlay from "./CreateProgram";
import "../../styles/programlist.css"; // ✅ Import External CSS

const ProgramList = ({ onProgramChange }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [department, setDepartment] = useState(
    JSON.parse(localStorage.getItem("department")) || null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProgram, setEditProgram] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch programs when department changes
  const fetchPrograms = async (dept) => {
    if (!dept || !dept.id) return;

    setLoading(true);
    const response = await apiGet(`/academic/programs/by-department/${dept.id}`);
    if (response.success) {
      setPrograms(response.data);

      // ✅ Get program from localStorage or default to the first one
      const storedProgram = JSON.parse(localStorage.getItem("program")) || {};
      const programExists = response.data.some((prog) => prog.id === storedProgram.id);

      const defaultProgram = programExists
        ? storedProgram
        : response.data.length > 0
        ? { id: response.data[0].id, name: response.data[0].program_name }
        : null;

      setSelectedProgram(defaultProgram);

      // ✅ Trigger event if a default program is set
      if (defaultProgram) {
        localStorage.setItem("program", JSON.stringify(defaultProgram));
        if (onProgramChange) {
          onProgramChange(defaultProgram);
        }

        const programEvent = new CustomEvent("programChange", {
          detail: defaultProgram,
        });
        window.dispatchEvent(programEvent);
      }
    }
    setLoading(false);
  };

  // Listen for department changes
  useEffect(() => {
    const handleDepartmentChange = (event) => {
      const newDepartment = event.detail;
      setDepartment(newDepartment);
      fetchPrograms(newDepartment);
    };

    window.addEventListener("departmentChange", handleDepartmentChange);

    return () => {
      window.removeEventListener("departmentChange", handleDepartmentChange);
    };
  }, []);

  useEffect(() => {
    if (department) {
      fetchPrograms(department);
    }
  }, [department]);

  const handleProgramSelect = (progId, progName) => {
    if (selectedProgram?.id !== progId) {
      const newProgram = { id: progId, name: progName };
      setSelectedProgram(newProgram);
      localStorage.setItem("program", JSON.stringify(newProgram));

      // ✅ Broadcast CustomEvent when the program changes
      const programEvent = new CustomEvent("programChange", {
        detail: newProgram,
      });
      window.dispatchEvent(programEvent);

      if (onProgramChange) {
        onProgramChange(newProgram);
      }
    }
  };

  const openEditOverlay = (program) => {
    setEditProgram(program);
    setIsEditOpen(true);
  };

  return (
    <div className="program-container">
      <h3 className="text-lg font-semibold mb-4">Programs</h3>

      {loading ? (
        <Spin className="program-spinner" />
      ) : (
        <div className="program-list">
          {programs.map((prog) => (
            <div key={prog.id} className="program-item">
              <Button
                type={selectedProgram?.id === prog.id ? "primary" : "default"}
                onClick={() => handleProgramSelect(prog.id, prog.program_name)}
                className="program-button"
              >
                {prog.program_name}
              </Button>
              <Tooltip title="Edit Program">
                <SettingOutlined className="edit-icon" onClick={() => openEditOverlay(prog)} />
              </Tooltip>
            </div>
          ))}

          {/* Add Program Button */}
          <div className="add-program">
            <Tooltip title="Add Program">
              <Button type="dashed" shape="circle" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)} />
            </Tooltip>
          </div>
        </div>
      )}

      {/* Edit Program Overlay */}
      {isEditOpen && (
        <EditProgramOverlay
          program={editProgram}
          onClose={() => setIsEditOpen(false)}
          onRefetch={() => fetchPrograms(department)}
        />
      )}

      {/* Create Program Overlay */}
      {isCreateOpen && (
        <CreateProgramOverlay
          onClose={() => setIsCreateOpen(false)}
          onRefetch={() => fetchPrograms(department)}
        />
      )}
    </div>
  );
};

export default ProgramList;
