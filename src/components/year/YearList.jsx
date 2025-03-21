import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../utils/apiHelper";
import { Button, Spin, Tooltip, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/yearlist.css"; // ✅ External CSS

const YearList = ({ onYearChange }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [program, setProgram] = useState(
    JSON.parse(localStorage.getItem("program")) || null
  );

  // Fetch years when program changes
  const fetchYears = async (prog) => {
    if (!prog || !prog.id) return;

    setLoading(true);
    const response = await apiGet(`/academic/year-levels/by-program/${prog.id}`);
    if (response.success) {
      setYears(response.data);

      // ✅ Get year from localStorage or default to the first one
      const storedYear = JSON.parse(localStorage.getItem("year")) || {};
      const yearExists = response.data.some((yr) => yr.id === storedYear.id);

      const defaultYear = yearExists
        ? storedYear
        : response.data.length > 0
        ? { id: response.data[0].id, name: response.data[0].year_level }
        : null;

      setSelectedYear(defaultYear);

      // ✅ Trigger event if a default year is set
      if (defaultYear) {
        localStorage.setItem("year", JSON.stringify(defaultYear));
        if (onYearChange) {
          onYearChange(defaultYear);
        }

        const yearEvent = new CustomEvent("yearChange", {
          detail: defaultYear,
        });
        window.dispatchEvent(yearEvent);
      }
    }
    setLoading(false);
  };

  // Listen for program changes
  useEffect(() => {
    const handleProgramChange = (event) => {
      const newProgram = event.detail;
      setProgram(newProgram);
      fetchYears(newProgram);
    };

    window.addEventListener("programChange", handleProgramChange);

    return () => {
      window.removeEventListener("programChange", handleProgramChange);
    };
  }, []);

  useEffect(() => {
    if (program) {
      fetchYears(program);
    }
  }, [program]);

  const handleYearSelect = (yearId, yearLevel) => {
    if (selectedYear?.id !== yearId) {
      const newYear = { id: yearId, name: yearLevel };
      setSelectedYear(newYear);
      localStorage.setItem("year", JSON.stringify(newYear));

      // ✅ Broadcast CustomEvent when the year changes
      const yearEvent = new CustomEvent("yearChange", {
        detail: newYear,
      });
      window.dispatchEvent(yearEvent);

      if (onYearChange) {
        onYearChange(newYear);
      }
    }
  };

  const handleDeleteYear = async () => {
    if (years.length === 0) return;

    const lastYear = years[years.length - 1]; // Get the last year
    const response = await apiPost(`/academic/delete/year/${lastYear.id}`);

    if (response.success) {
      message.success(`Year ${lastYear.year_level} deleted successfully!`);
      fetchYears(program);
    } else {
      message.error(response.message || "Failed to delete year.");
    }
  };

  const handleAddYear = async () => {
    if (!program || !program.id) {
      message.error("No program selected.");
      return;
    }

    // ✅ Determine the next year based on the last year in the list
    const lastYear = years.length > 0 ? parseInt(years[years.length - 1].year_level) : 0;
    const newYearLevel = lastYear + 1;

    const response = await apiPost(`/academic/year-levels/create`, {
      program_id: program.id,
      year_level: newYearLevel,
    });

    if (response.success) {
      message.success(`Year ${newYearLevel} added successfully!`);
      fetchYears(program);
    } else {
      message.error(response.message || "Failed to add year.");
    }
  };

  return (
    <div className="year-container">
      <div className="year-header">
        <h3>Year Levels</h3>
      </div>

      {loading ? (
        <Spin className="year-spinner" />
      ) : (
        <div className="year-list">
          {years.map((yr, index) => (
            <div key={yr.id} className="year-item">
              <Button
                type={selectedYear?.id === yr.id ? "primary" : "default"}
                onClick={() => handleYearSelect(yr.id, yr.year_level)}
              >
                {yr.year_level}
              </Button>
            </div>
          ))}

          {/* Special Last Year Button with Delete */}
          {years.length > 0 && (
            <Tooltip title={`Delete Year "${years[years.length - 1].year_level}"`}>
              <Button danger onClick={handleDeleteYear} className="year-delete-button">
                 {years[years.length - 1].year_level} <DeleteOutlined /> 
              </Button>
            </Tooltip>
          )}

          {/* Add Year Button */}
          <Tooltip title="Add Year Level">
            <Button type="dashed" shape="circle" icon={<PlusOutlined />} onClick={handleAddYear} />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default YearList;
