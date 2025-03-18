import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import DeanListCard from "./DeansListCard";
import { Spin, Alert } from "antd";
import "../../styles/deanslist.css"

const DeanList = () => {
  const [deans, setDeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeans = async () => {
      setLoading(true);
      const response = await apiGet("dean/list");

      if (response.success) {
        setDeans(response.data);
      } else {
        setError(response.message || "Failed to load deans");
      }
      setLoading(false);
    };

    fetchDeans();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="dean-list-container">
      <h1 className="dean-list-title">Dean List (Dean's View)</h1>
      <div className="dean-list-scroll">
        {deans.length > 0 ? (
          deans.map((dean) => (
            <DeanListCard 
              key={dean.id} 
              dean={{
                first_name: dean.first_name.trim(),
                middle_name: dean.middle_name || "",
                last_name: dean.last_name,
                suffix: dean.suffix || "",
                user_id: dean.id,
                department: dean.department_name
              }} 
            />
          ))
        ) : (
          <p className="dean-list-empty">No deans found</p>
        )}
      </div>
    </div>
  );
};

export default DeanList;
