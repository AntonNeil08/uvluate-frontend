import { useEffect, useState } from "react";
import { Modal, Input, List, message } from "antd";
import { apiGet } from "../../utils/apiHelper";
import "../../styles/deploymentmenupage.css"; // ✅ External CSS

const SelectInstructorOverlay = ({ isOpen, onClose, onSelect }) => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInstructors = async () => {
      const response = await apiGet("/faculty/list");
      if (response.success) {
        const formattedInstructors = response.data.map((instructor) => ({
          id: instructor.id,
          name: `${instructor.id}---${instructor.first_name} ${instructor.last_name}`, // ✅ Format: id---fullname
        }));
        setInstructors(formattedInstructors);
        setFilteredInstructors(formattedInstructors); // ✅ Default list
      } else {
        message.error("Failed to fetch instructors.");
      }
    };

    if (isOpen) fetchInstructors();
  }, [isOpen]);

  // Filter instructors based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInstructors(instructors);
    } else {
      setFilteredInstructors(
        instructors.filter((instructor) =>
          instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, instructors]);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} closable={true} title="Select Instructor">
      {/* Search Bar */}
      <Input
        placeholder="Search instructor..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Instructor List */}
      <List
        className="instructor-list"
        dataSource={filteredInstructors}
        renderItem={(instructor) => (
          <List.Item
            className="instructor-item"
            onClick={() => {
              onSelect(instructor);
              onClose();
            }}
          >
            {instructor.name}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default SelectInstructorOverlay;
