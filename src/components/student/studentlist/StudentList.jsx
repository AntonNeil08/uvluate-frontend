import React, { useEffect, useState, useCallback } from "react";
import { Input, Select } from "antd";
import { apiGet } from "../../../utils/apiHelper";
import StudentListCard from "./StudentListCard";
import "../../../styles/StudentList.css";

const { Search } = Input;
const { Option } = Select;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Static Filters
  const [statusFilter, setStatusFilter] = useState("active");
  const [regularityFilter, setRegularityFilter] = useState("all");

  // Dynamic Filters
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("---");
  const [selectedProgram, setSelectedProgram] = useState("---");
  const [selectedYear, setSelectedYear] = useState("---");
  const [selectedSection, setSelectedSection] = useState("---");

  const fetchStudents = useCallback(async () => {
    const response = await apiGet("/student/list");
    if (response.success) {
      setStudents(response.data);
      setFilteredStudents(response.data);

      const departmentList = ["---", ...new Set(response.data.map((s) => s.department_name))];
      setDepartments(departmentList);

      const programList = ["---", ...new Set(response.data.map((s) => s.program_name))];
      setPrograms(programList);

      const yearList = ["---", ...new Set(response.data.map((s) => s.year_level))];
      setYears(yearList);

      const sectionList = ["---", ...new Set(response.data.map((s) => s.section_name))];
      setSections(sectionList);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Function to filter students
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.id.toString().includes(searchTerm.toLowerCase()) ||
          s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => (statusFilter === "active" ? s.user_type !== "-1" : s.user_type === "-1"));
    }

    if (regularityFilter !== "all") {
      filtered = filtered.filter((s) => (regularityFilter === "regular" ? s.is_regular === "Y" : s.is_regular === "N"));
    }

    if (selectedDepartment !== "---") {
      filtered = filtered.filter((s) => s.department_name === selectedDepartment);
    }

    if (selectedProgram !== "---") {
      filtered = filtered.filter((s) => s.program_name === selectedProgram);
    }

    if (selectedYear !== "---") {
      filtered = filtered.filter((s) => s.year_level === selectedYear);
    }

    if (selectedSection !== "---") {
      filtered = filtered.filter((s) => s.section_name === selectedSection);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, regularityFilter, selectedDepartment, selectedProgram, selectedYear, selectedSection, students]);

  return (
    <div className="student-list">
      <div className="filters">
        <Search
          placeholder="Search students by ID, Name"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <Select defaultValue="active" onChange={setStatusFilter} className="filter-dropdown">
          <Option value="active">Active</Option>
          <Option value="deactivated">Deactivated</Option>
          <Option value="all">All</Option>
        </Select>

        <Select defaultValue="all" onChange={setRegularityFilter} className="filter-dropdown">
          <Option value="all">All</Option>
          <Option value="regular">Regular</Option>
          <Option value="irregular">Irregular</Option>
        </Select>

        <Select
          value={selectedDepartment}
          onChange={(value) => {
            setSelectedDepartment(value);
            setSelectedProgram("---");
            setSelectedYear("---");
            setSelectedSection("---");
          }}
          className="filter-dropdown"
        >
          {departments.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedProgram}
          disabled={selectedDepartment === "---"}
          onChange={(value) => {
            setSelectedProgram(value);
            setSelectedYear("---");
            setSelectedSection("---");
          }}
          className="filter-dropdown"
        >
          {["---", ...programs.filter((p) => students.some((s) => s.program_name === p && s.department_name === selectedDepartment))]
            .map((prog) => (
              <Option key={prog} value={prog}>
                {prog}
              </Option>
            ))}
        </Select>

        <Select
          value={selectedYear}
          disabled={selectedProgram === "---"}
          onChange={(value) => {
            setSelectedYear(value);
            setSelectedSection("---");
          }}
          className="filter-dropdown"
        >
          {["---", ...years.filter((y) => students.some((s) => s.year_level === y && s.program_name === selectedProgram))]
            .map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
        </Select>

        <Select
          value={selectedSection}
          disabled={selectedYear === "---"}
          onChange={setSelectedSection}
          className="filter-dropdown"
        >
          {["---", ...sections.filter((sec) => students.some((s) => s.section_name === sec && s.year_level === selectedYear))]
            .map((section) => (
              <Option key={section} value={section}>
                {section}
              </Option>
            ))}
        </Select>
      </div>

      {filteredStudents.map((student) => (
        <StudentListCard key={student.id} student={student} refetch={fetchStudents} />
      ))}
    </div>
  );
};

export default StudentList;