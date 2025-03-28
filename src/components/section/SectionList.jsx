import { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import { Button, Spin, Tooltip } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import CreateSectionOverlay from "./CreateSectionOverlay";
import EditSectionOverlay from "./EditSectionOverlay";
import "../../styles/sectionlist.css";

const SectionList = ({ onSectionChange }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [year, setYear] = useState(() => {
    const id = localStorage.getItem("year");
    const name = localStorage.getItem("year_name");
    return id && name ? { id: parseInt(id), name } : null;
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);

  const fetchSections = async (yr) => {
    if (!yr || !yr.id) return;
    setLoading(true);

    const response = await apiGet(`/academic/sections/by-year/${yr.id}`);
    if (response.success) setSections(response.data);

    setLoading(false);
  };

  useEffect(() => {
    const handleYearChange = (event) => {
      const newYear = event.detail;
      setYear(newYear);
      fetchSections(newYear);
      setSelectedSection(null);
      localStorage.removeItem("section");
      localStorage.removeItem("section_name");
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

  const handleSectionSelect = (sectionId, sectionName) => {
    setSelectedSection({ id: sectionId, name: sectionName });
    localStorage.setItem("section", sectionId);
    localStorage.setItem("section_name", sectionName);

    if (onSectionChange) {
      onSectionChange({ id: sectionId, name: sectionName });
    }

    // ✅ Open deployment link in new tab
    window.open(`/deployment/section/${sectionId}`, "_blank");
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
        <EditSectionOverlay
          section={editSection}
          onClose={() => setIsEditOpen(false)}
          onRefetch={() => fetchSections(year)}
        />
      )}
    </div>
  );
};

export default SectionList;
