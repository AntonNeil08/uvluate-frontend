import { useEffect, useState } from "react";
import { Modal, Input, List, message, Button, Checkbox } from "antd";
import { apiGet, apiPost } from "../../utils/apiHelper";
import { useIndexedDB } from "../../utils/indexedDBHelper"; // ✅ IndexedDB helper
import "../../styles/selectsubjectoverlay.css"; // ✅ Separate CSS file

const SelectSubjectOverlay = ({ isOpen, onClose, sectionId, onRefetch }) => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]); // ✅ Stores selected subjects
  const [searchQuery, setSearchQuery] = useState("");
  const { getAll, add } = useIndexedDB("assignedSubjects"); // ✅ IndexedDB integration

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await apiGet("/academic/subjects");

        if (!response.success) {
          message.error("Failed to fetch subjects.");
          return;
        }

        let assignedSubjects = [];
        try {
          assignedSubjects = await getAll(); // ✅ Retrieve assigned subjects from IndexedDB
        } catch (error) {
          console.warn("IndexedDB error, defaulting to empty assigned subjects list.", error);
          assignedSubjects = []; // ✅ Prevents undefined errors
        }

        // ✅ Remove already assigned subjects from the selection
        const availableSubjects = response.data.filter(
          (subject) => subject.is_deleted === "N" && !assignedSubjects.some((assigned) => assigned.subject_code === subject.code)
        );

        setSubjects(availableSubjects);
        setFilteredSubjects(availableSubjects);
      } catch (error) {
        message.error("An error occurred while fetching subjects.");
        console.error("Fetch Subjects Error:", error);
      }
    };

    if (isOpen) fetchSubjects();
  }, [isOpen]);

  // Filter subjects based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubjects(subjects);
    } else {
      setFilteredSubjects(
        subjects.filter((subject) =>
          subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, subjects]);

  // Handle checkbox selection
  const handleCheckboxChange = (subjectCode) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectCode)
        ? prevSelected.filter((code) => code !== subjectCode) // ✅ Remove if already selected
        : [...prevSelected, subjectCode] // ✅ Add if newly selected
    );
  };

  // Handle bulk assignment
  const handleAssignSubjects = async () => {
    if (selectedSubjects.length === 0) {
      message.warning("Please select at least one subject to assign.");
      return;
    }
  
    try {
      const payload = {
        section: sectionId, // ✅ Ensure correct key name
        subject_codes: selectedSubjects, // ✅ Ensure this is an array
      };
  
      console.log("Sending payload:", payload); // ✅ Debugging
  
      const response = await apiPost("/deployment/add-subject", payload);
  
      if (response.success) {
        message.success("Subjects assigned successfully!");
  
        // ✅ Save assigned subjects to IndexedDB
        await Promise.all(
          selectedSubjects.map(async (subjectCode) => {
            const subject = subjects.find((s) => s.code === subjectCode);
            if (subject) {
              await add({ section_id: sectionId, subject_code: subject.code, subject_name: subject.subject_name });
            }
          })
        );
  
        onRefetch(); // ✅ Refresh deployment list
        onClose();
      } else {
        message.error(response.messages?.message || "Failed to assign subjects.");
      }
    } catch (error) {
      message.error("An error occurred while assigning subjects.");
      console.error("Assign Subjects Error:", error);
    }
  };  

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} closable={true} title="Select Subjects">
      {/* Search Bar */}
      <Input
        placeholder="Search subject..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="subject-search-bar"
      />

      {/* Subject List with Checkboxes */}
      <List
        className="subject-list"
        dataSource={filteredSubjects}
        renderItem={(subject) => (
          <List.Item className="subject-item">
            <Checkbox
              checked={selectedSubjects.includes(subject.code)}
              onChange={() => handleCheckboxChange(subject.code)}
            >
              {subject.code} - {subject.subject_name}
            </Checkbox>
          </List.Item>
        )}
      />

      {/* Assign Button */}
      <div className="assign-button-container">
        <Button type="primary" onClick={handleAssignSubjects} disabled={selectedSubjects.length === 0}>
          Assign Selected Subjects
        </Button>
      </div>
    </Modal>
  );
};

export default SelectSubjectOverlay;
