import React, { useEffect, useState } from "react";
import { Typography, List, Button, Spin, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { apiGet } from "../utils/apiHelper";

const { Title } = Typography;

const DeanAcknowledgementList = () => {
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const department = localStorage.getItem("department");
      if (!department) return;

      const res = await apiGet(`/user/instructors-by-department-usertype/${department}`);
      if (res.success) {
        setInstructors(res.data);
      }
      setLoading(false);
    };

    fetchInstructors();
  }, []);

  const handleAcknowledgeClick = (facultyID) => {
    window.open(`/dean/acknowledge-result/${facultyID}`, "_blank");
  };

  return (
    <div className="p-6">
      <Title level={2}>📋 Acknowledge Evaluation Results</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          bordered
          itemLayout="horizontal"
          dataSource={instructors}
          renderItem={(item) => (
            <List.Item
              actions={[
                item.is_acknowledged === "1" ? (
                  <Tag color="green">Acknowledged</Tag>
                ) : (
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleAcknowledgeClick(item.id)}
                    type="primary"
                  >
                    View & Acknowledge
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                title={item.full_name}
                description={`User Type: ${item.user_type}`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default DeanAcknowledgementList;
