import { useEffect, useState } from "react";
import NavSidebar from "../components/common/NavSideBar";
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  BookOutlined,
  BarChartOutlined,
  TeamOutlined,
  ScheduleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { apiGet } from "../utils/apiHelper";

const DashboardLayout = ({ children }) => {
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const userType = parseInt(localStorage.getItem("user_type"), 10);
    const userId = localStorage.getItem("user_id");
    let items = [];

    const loadStudentEvaluations = async () => {
      const response = await apiGet(`deployment/active-evaluations-by-student/${userId}`);
      if (response.success && Array.isArray(response.data)) {
        const dynamicSubjectButtons = response.data.map((evaluation) => ({
          label: evaluation.subject_code,
          path: `/student/evaluate/${evaluation.student_assignment_id}`,
          icon: <BookOutlined />,
        }));

        setNavigationItems([
          { label: "Dashboard", path: "/student-dashboard", icon: <DashboardOutlined /> },
          ...dynamicSubjectButtons,
        ]);
      } else {
        // fallback if no data
        setNavigationItems([
          { label: "Dashboard", path: "/student-dashboard", icon: <DashboardOutlined /> },
        ]);
      }
    };

    if (userType === 1) {
      items = [
        { label: "Dashboard", path: "/admin-dashboard", icon: <DashboardOutlined /> },
        { label: "Manage Users", path: "/admin/users", icon: <UserOutlined /> },
        { label: "Manage Departments", path: "/admin/departments", icon: <ApartmentOutlined /> },
        { label: "Manage Subjects", path: "/admin/subjects", icon: <BookOutlined /> },
        { label: "Reports", path: "/admin/reports", icon: <BarChartOutlined /> },
      ];
      setNavigationItems(items);
    } else if (userType === 2) {
      items = [
        { label: "Dashboard", path: "/dean-dashboard", icon: <DashboardOutlined /> },
        { label: "Coordinators", path: "/dean/coordinators", icon: <TeamOutlined /> },
        { label: "Faculty", path: "/dean/faculty", icon: <UserOutlined /> },
        { label: "Students", path: "/dean/students", icon: <UserOutlined /> },
        { label: "Reports", path: "/dean/reports", icon: <BarChartOutlined /> },
      ];
      setNavigationItems(items);
    } else if (userType === 3) {
      items = [
        { label: "Dashboard", path: "/coordinator-dashboard", icon: <DashboardOutlined /> },
        { label: "Faculty", path: "/coordinator/faculty", icon: <UserOutlined /> },
        { label: "Students", path: "/coordinator/students", icon: <UserOutlined /> },
        { label: "Subjects", path: "/coordinator/subjects", icon: <BookOutlined /> },
      ];
      setNavigationItems(items);
    } else if (userType === 4) {
      items = [
        { label: "Dashboard", path: "/faculty-dashboard", icon: <DashboardOutlined /> },
        { label: "Evaluation Tasks", path: "/faculty/evaluations", icon: <ScheduleOutlined /> },
      ];
      setNavigationItems(items);
    } else if (userType === 6) {
      items = [
        { label: "Dashboard", path: "/privileged-dashboard", icon: <DashboardOutlined /> },
        { label: "Evaluation Tasks", path: "/privileged/evaluations", icon: <ScheduleOutlined /> },
        { label: "Advanced Settings", path: "/privileged/settings", icon: <SettingOutlined /> },
      ];
      setNavigationItems(items);
    } else if (userType === 5 && userId) {
      loadStudentEvaluations();
    }
  }, []);

  return (
    <NavSidebar navigationItems={navigationItems}>
      <div className="content-area">{children}</div>
    </NavSidebar>
  );
};

export default DashboardLayout;
