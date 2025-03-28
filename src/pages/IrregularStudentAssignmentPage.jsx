import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/apiHelper";
import { Spin, message } from "antd";
import IrregularDeploymentCard from "../components/student/deployment/IrregularDeploymentCard";
import "../styles/irregularstudentpage.css";

const IrregularStudentAssignmentPage = () => {
  const { sectionId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIrregularStudents = async () => {
    setLoading(true);
    try {
      const response = await apiGet(`/student/irregular/by-section/${sectionId}`);
      if (response.success) {
        setStudents(response.data);
      } else {
        message.error("Failed to fetch irregular students.");
      }
    } catch (error) {
      message.error("An error occurred while fetching students.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIrregularStudents();
  }, [sectionId]);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.middle_name || ""} ${student.last_name} ${student.suffix || ""}`.toLowerCase();
    return (
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="irregular-student-container">
      <h3 className="text-lg font-semibold">Assign Irregular Students</h3>

      <div className="search-bar-container">
      <input
        type="text"
        id="student-search"
        name="studentSearch"
        placeholder="Search by ID or name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      </div>

      {loading ? (
        <Spin className="irregular-spinner" />
      ) : filteredStudents.length > 0 ? (
        <div className="irregular-student-list">
          {filteredStudents.map((student) => (
            <IrregularDeploymentCard
              key={student.id}
              student={student}
              onRefetch={fetchIrregularStudents}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No irregular students found for this section.</p>
      )}
    </div>
  );
};

export default IrregularStudentAssignmentPage;
