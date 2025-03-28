import { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import { Button, Spin, Tooltip } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import EditDepartmentOverlay from "./EditDepartmentOverlay";
import CreateDepartmentOverlay from "./CreateDepartmentOverlay";
import "../../styles/departmentlist.css"; // ✅ Import External CSS

const DepartmentList = ({ onDepartmentChange }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    const response = await apiGet("academic/departments");
    if (response.success) {
      setDepartments(response.data);

      // ✅ Get department ID and name separately from localStorage
      const storedId = localStorage.getItem("department");
      const storedName = localStorage.getItem("department_name");

      const departmentExists = response.data.some((dept) => dept.id === parseInt(storedId));
      const defaultDepartment = departmentExists
        ? { id: parseInt(storedId), name: storedName }
        : response.data.length > 0
        ? { id: response.data[0].id, name: response.data[0].department_name }
        : null;

      setSelectedDepartment(defaultDepartment);

      // ✅ Trigger event if a default department is set
      if (defaultDepartment) {
        localStorage.setItem("department", defaultDepartment.id);
        localStorage.setItem("department_name", defaultDepartment.name);
        if (onDepartmentChange) {
          onDepartmentChange(defaultDepartment);
        }

        const departmentEvent = new CustomEvent("departmentChange", {
          detail: defaultDepartment,
        });
        window.dispatchEvent(departmentEvent);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleDepartmentBroadcast = (event) => {
      const newDepartment = event.detail;
      setSelectedDepartment(newDepartment);
      if (onDepartmentChange) {
        onDepartmentChange(newDepartment);
      }
      window.removeEventListener("departmentChange", handleDepartmentBroadcast);
    };

    window.addEventListener("departmentChange", handleDepartmentBroadcast);

    return () => {
      window.removeEventListener("departmentChange", handleDepartmentBroadcast);
    };
  }, [onDepartmentChange]);

  const handleDepartmentSelect = (deptId, deptName) => {
    if (selectedDepartment?.id !== deptId) {
      const newDepartment = { id: deptId, name: deptName };
      setSelectedDepartment(newDepartment);
      localStorage.setItem("department", newDepartment.id);
      localStorage.setItem("department_name", newDepartment.name);

      // ✅ Broadcast CustomEvent when the department changes
      const departmentEvent = new CustomEvent("departmentChange", {
        detail: newDepartment,
      });
      window.dispatchEvent(departmentEvent);

      if (onDepartmentChange) {
        onDepartmentChange(newDepartment);
      }
    }
  };

  const openEditOverlay = (dept) => {
    setEditDepartment(dept);
    setIsEditOpen(true);
  };

  return (
    <div className="department-container">
      <div className="department-header">
        <h3>Departments</h3>
        <Tooltip title="Add Department">
          <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)} />
        </Tooltip>
      </div>

      {loading ? (
        <Spin className="department-spinner" />
      ) : (
        <div className="department-list">
          {departments.map((dept) => (
            <div key={dept.id} className="department-item">
              <Button
                type={selectedDepartment?.id === dept.id ? "primary" : "default"}
                onClick={() => handleDepartmentSelect(dept.id, dept.department_name)}
              >
                {dept.department_name}
              </Button>
              <Tooltip title="Edit Department">
                <SettingOutlined className="edit-icon" onClick={() => openEditOverlay(dept)} />
              </Tooltip>
            </div>
          ))}
        </div>
      )}

      {isEditOpen && (
        <EditDepartmentOverlay
          department={editDepartment}
          onClose={() => setIsEditOpen(false)}
          onRefetch={fetchDepartments}
        />
      )}

      {isCreateOpen && (
        <CreateDepartmentOverlay onClose={() => setIsCreateOpen(false)} onRefetch={fetchDepartments} />
      )}
    </div>
  );
};

export default DepartmentList;
