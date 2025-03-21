import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/apiHelper";
import { Spin, message } from "antd";
import IrregularDeploymentCard from "../components/student/deployment/IrregularDeploymentCard";
import "../styles/irregularstudentpage.css"; // ✅ External CSS

const IrregularStudentAssignmentPage = () => {
  const { sectionId } = useParams(); // ✅ Get section ID from URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch irregular students by section
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

  return (
    <div className="irregular-student-container">
      <h3 className="text-lg font-semibold">Assign Irregular Students</h3>

      {loading ? (
        <Spin className="irregular-spinner" />
      ) : students.length > 0 ? (
        <div className="irregular-student-list">
          {students.map((student) => (
            <IrregularDeploymentCard key={student.id} student={student} onRefetch={fetchIrregularStudents} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No irregular students found for this section.</p>
      )}
    </div>
  );
};

export default IrregularStudentAssignmentPage;
