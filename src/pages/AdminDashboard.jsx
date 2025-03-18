import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ApartmentOutlined,
  BookOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import NavSidebar from "../components/common/NavSideBar";

const AdminDashboard = () => {
  const location = useLocation(); // Track current path
  const [activePage, setActivePage] = useState("Dashboard");

  const navigationItems = [
    { label: "Dashboard", path: "/admin-dashboard", icon: <DashboardOutlined /> },
    { label: "Manage Users", path: "/admin/users", icon: <UserOutlined /> },
    { label: "Manage Departments", path: "/admin/departments", icon: <ApartmentOutlined /> },
    { label: "Manage Subjects", path: "/admin/subjects", icon: <BookOutlined /> },
    { label: "Reports", path: "/admin/reports", icon: <BarChartOutlined /> },
  ];

  // Function to generate breadcrumbs dynamically
  const generateBreadcrumbs = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    return pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const breadcrumbItem = navigationItems.find((item) => item.path === url);
      return breadcrumbItem ? (
        <Breadcrumb.Item key={url} href={url}>
          {breadcrumbItem.icon} {breadcrumbItem.label}
        </Breadcrumb.Item>
      ) : null;
    });
  };

  return (
    <NavSidebar navigationItems={navigationItems}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumbs-container">
        <Breadcrumb>{generateBreadcrumbs()}</Breadcrumb>
      </div>

      {/* Content Section */}
      <div className="content-area">
        <h1>{activePage}</h1>
        <p>Welcome to the {activePage} section.</p>
      </div>
    </NavSidebar>
  );
};

export default AdminDashboard;
