import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/apiHelper";
import { Typography, Spin, Card, Tag, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const DeanEvaluationList = () => {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dean_id = localStorage.getItem("user_id");
      if (!dean_id) return setLoading(false);

      const res = await apiGet(`evaluation/dean-list/${dean_id}`);
      if (res.success) {
        setEvaluations(res.data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleClick = (facultyID, isEvaluated) => {
    if (isEvaluated === "N") {
      window.open(`/faculty/evaluate/${facultyID}`, "_blank");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserOutlined style={{ fontSize: 22 }} />
        <Title level={3} className="!mb-0">Dean Evaluation List</Title>
      </div>

      {loading ? (
        <div className="text-center mt-8">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {evaluations.map((person) => (
            <Col xs={24} sm={12} md={8} lg={6} key={person.id}>
              <Card
                hoverable={person.is_evaluated === "N"}
                onClick={() => handleClick(person.id, person.is_evaluated)}
                className={`transition-all ${
                  person.is_evaluated === "Y"
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                <Text strong>{person.full_name}</Text>
                <div className="mt-2">
                  <Tag color={person.is_evaluated === "Y" ? "green" : "red"}>
                    {person.is_evaluated === "Y" ? "Evaluated" : "Pending"}
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DeanEvaluationList;
