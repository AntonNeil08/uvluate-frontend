import { Tooltip } from "antd";
import {
  SettingOutlined,
  KeyOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "../../../styles/StudentListCard.css";

const StudentListCard = ({ student, refetch }) => {
  const {
    id,
    first_name,
    middle_name,
    last_name,
    suffix,
    email,
    is_regular,
    user_type,
    department_name,
    program_name,
    year_level,
    section_name,
  } = student;

  const statusClass =
    user_type === "-5" ? "bg-deactivated" : is_regular === "Y" ? "bg-regular" : "bg-irregular";

  return (
    <div className={`student-card ${statusClass}`}>
      {/* Student Details Section */}
      <div className="student-info">
        <p className="student-name">
          {first_name} {middle_name && middle_name} {last_name} {suffix && suffix}
          <span className="student-id">({id})</span>
        </p>
        <p className="student-details">
          {department_name} {program_name} {year_level} (year) {section_name}(section)
        </p>
        <p className="student-email">{email}</p>
      </div>

      {/* Action Buttons Section */}
      <div className="student-actions">
        <Tooltip title="Edit" placement="top" zIndex={1000} mouseEnterDelay={0} mouseLeaveDelay={0.1}>
          <button className="action-button edit">
            <SettingOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Reset Password" placement="top" zIndex={1000} mouseEnterDelay={0} mouseLeaveDelay={0.1}>
          <button className="action-button reset">
            <KeyOutlined />
          </button>
        </Tooltip>

        <Tooltip
          title={user_type === "-5" ? "Reactivate" : "Deactivate"}
          placement="top"
          zIndex={1000}
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
        >
          <button className={`action-button ${user_type === "-5" ? "reactivate" : "deactivate"}`}>
            {user_type === "-5" ? <UserAddOutlined /> : <UserDeleteOutlined />}
          </button>
        </Tooltip>

        <Tooltip
          title={is_regular === "Y" ? "Set as Irregular" : "Set as Regular"}
          placement="top"
          zIndex={1000}
          mouseEnterDelay={0}
          mouseLeaveDelay={0.1}
        >
          <button className={`action-button ${is_regular === "Y" ? "regular" : "irregular"}`}>
            {is_regular === "Y" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default StudentListCard;
