import React, { useEffect, useState } from "react";
import { Input, Select, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { apiGet } from "../../utils/apiHelper";
import FacultyListCard from "../faculty/FacultyListCard";
import "../../styles/facultylist.css";

const { Search } = Input;
const { Option } = Select;

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("---");

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const response = await apiGet("faculty/list");
        if (response.success) {
          setFaculty(response.data);

          // Extract unique department names for the filter
          const departmentList = ["---", ...new Set(response.data.map((f) => f.department_name))];
          setDepartments(departmentList);
        } else {
          setError(response.message || "Failed to load faculty members");
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchFaculty();
  }, []);

  // Filtering logic
  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch = `${member.first_name} ${member.middle_name || ""} ${member.last_name} ${member.suffix || ""} ${member.email} ${member.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? member.user_type !== "-1"
        : member.user_type === "-1";

    const matchesDepartment = selectedDepartment === "---" || member.department_name === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  if (loading)
    return (
      <div className="flex-center-screen">
        <Spin tip="Loading faculty..." />
      </div>
    );
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="faculty-list-container">
      <h1 className="faculty-list-title">Faculty List</h1>

      <div className="filters">
        {/* Search Input with Search Icon */}
        <Input
          placeholder="Search faculty by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          prefix={<SearchOutlined className="search-icon" />}
        />

        {/* Status Filter Dropdown (Default: All) */}
        <Select defaultValue="all" onChange={setStatusFilter} className="filter-dropdown">
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="deactivated">Deactivated</Option>
        </Select>

        {/* Department Filter Dropdown (Default: ---) */}
        <Select
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          className="filter-dropdown"
        >
          {departments.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
      </div>

      <div className="faculty-list-scroll">
        {filteredFaculty.length > 0 ? (
          filteredFaculty.map((member) => {
            const userTypeNumber = Number(member.user_type);
            return (
              <FacultyListCard
                key={member.id}
                faculty={{
                  name: `${member.first_name.trim()} ${member.middle_name || ""} ${member.last_name} ${member.suffix || ""}`.trim(),
                  user_id: member.id,
                  department: member.department_name,
                  email: member.email,
                  user_type: userTypeNumber,
                }}
              />
            );
          })
        ) : (
          <p className="faculty-list-empty">No faculty members found</p>
        )}
      </div>
    </div>
  );
};

export default FacultyList;
