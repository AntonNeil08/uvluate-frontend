import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../utils/apiHelper";
import { Button, Spin, Tooltip } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import CreateSectionOverlay from "./CreateSectionOverlay";
import EditSectionOverlay from "./EditSectionOverlay";
import "../../styles/sectionlist.css"; // ✅ External CSS

const SectionList = ({ onSectionChange }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [year, setYear] = useState(JSON.parse(localStorage.getItem("year")) || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const navigate = useNavigate(); // ✅ Add useNavigate for navigation

  const fetchSections = async (yr) => {
    if (!yr || !yr.id) return;
    setLoading(true);
    const response = await apiGet(`/academic/sections/by-year/${yr.id}`);
    if (response.success) {
      setSections(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleYearChange = (event) => {
      const newYear = event.detail;
      setYear(newYear);
      fetchSections(newYear);
      setSelectedSection(null);
      localStorage.removeItem("section");
    };

    window.addEventListener("yearChange", handleYearChange);
    return () => window.removeEventListener("yearChange", handleYearChange);
  }, []);

  useEffect(() => {
    if (year) {
      fetchSections(year);
      setSelectedSection(null);
    }
  }, [year]);

  // ✅ Navigate to the new tab when selecting a section
  const handleSectionSelect = (sectionId, sectionName) => {
    setSelectedSection({ id: sectionId, name: sectionName });
    localStorage.setItem("section", JSON.stringify({ id: sectionId, name: sectionName }));

    if (onSectionChange) {
      onSectionChange({ id: sectionId, name: sectionName });
    }

    navigate(`/deployment/section/${sectionId}`); // ✅ Redirect to the deployment page
  };

  const openEditOverlay = (section) => {
    setEditSection(section);
    setIsEditOpen(true);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>Sections</h3>
      </div>

      {loading ? (
        <Spin className="section-spinner" />
      ) : (
        <div className="section-list">
          {sections.map((sec) => (
            <div key={sec.id} className="section-item">
              <Button
                type={selectedSection?.id === sec.id ? "primary" : "default"}
                onClick={() => handleSectionSelect(sec.id, sec.section_name)}
              >
                {sec.section_name}
              </Button>
              <Tooltip title="Edit Section">
                <SettingOutlined className="edit-icon" onClick={() => openEditOverlay(sec)} />
              </Tooltip>
            </div>
          ))}

          <Tooltip title="Add Section">
            <Button type="dashed" shape="circle" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)} />
          </Tooltip>
        </div>
      )}

      {isCreateOpen && (
        <CreateSectionOverlay onClose={() => setIsCreateOpen(false)} onRefetch={() => fetchSections(year)} />
      )}

      {isEditOpen && (
        <EditSectionOverlay section={editSection} onClose={() => setIsEditOpen(false)} onRefetch={() => fetchSections(year)} />
      )}
    </div>
  );
};

export default SectionList;
