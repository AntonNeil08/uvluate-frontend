import NavSidebar from "../components/common/NavSideBar";
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  BookOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const DashboardLayout = ({ children }) => {
  // Define navigation items dynamically
  const navigationItems = [
    { label: "Dashboard", path: "/admin-dashboard", icon: <DashboardOutlined /> },
    { label: "Manage Users", path: "/admin/users", icon: <UserOutlined /> },
    { label: "Manage Departments", path: "/admin/departments", icon: <ApartmentOutlined /> },
    { label: "Manage Subjects", path: "/admin/subjects", icon: <BookOutlined /> },
    { label: "Reports", path: "/admin/reports", icon: <BarChartOutlined /> },
  ];

  return (
    <NavSidebar navigationItems={navigationItems}>
      {/* Content Area (Admin Pages Render Here) */}
      <div className="content-area">{children}</div>
    </NavSidebar>
  );
};

export default DashboardLayout;
