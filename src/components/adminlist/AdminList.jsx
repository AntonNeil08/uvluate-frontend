import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import AdminListCard from "./AdminListCard";
import { Spin, Alert } from "antd";
import "../../styles/adminlist.css";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEdit = (admin) => {
    console.log("Edit admin", admin);
  };

  const handleResetPassword = (admin) => {
    console.log("Reset password for", admin);
  };

  const handleToggleStatus = (admin) => {
    console.log("Toggle status for", admin);
  };

  const filteredAdmins = admins.filter((admin) =>
    `${admin.first_name} ${admin.middle_name} ${admin.last_name} ${admin.suffix} ${admin.email} ${admin.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex-center-screen">
        <Spin tip="Loading admins..." />
      </div>
    );
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="admin-list-container">
      <h1 className="admin-list-title">Manage Users</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search admin by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
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
          <p className="admin-list-empty">No admin found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminList;
