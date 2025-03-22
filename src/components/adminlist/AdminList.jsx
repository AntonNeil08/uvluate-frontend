import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import AdminListCard from "./AdminListCard";
import { Spin, Alert, Select, Input } from "antd";
import "../../styles/adminlist.css";

const { Option } = Select;

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      const response = await apiGet("admin/list");
      if (response.success) {
        setAdmins(response.data);
      } else {
        setError(response.message || "Failed to load admins");
      }
      setLoading(false);
    };

    fetchAdmins();
  }, []);

  const handleEdit = (admin) => console.log("Edit", admin);
  const handleResetPassword = (admin) => console.log("Reset Password", admin);
  const handleToggleStatus = (admin) => console.log("Toggle Status", admin);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      admin.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? admin.user_type > 0
        : admin.user_type < 0;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <Spin tip="Loading admins..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="admin-list-container">
      <h2 className="admin-list-title">Manage Users</h2>
      <div className="search-filter-container">
        <Input
          placeholder="Search admin by name, email, or ID"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "250px" }}
        />
        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <div className="admin-list-scroll">
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <AdminListCard
              key={admin.id}
              data={admin}
              onEdit={handleEdit}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <p className="admin-list-empty">No admins found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminList;
