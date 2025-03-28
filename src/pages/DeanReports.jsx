import React, { useEffect, useState } from "react";
import { apiGet } from "../utils/apiHelper";
import {
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  IdcardOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DeanReports = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const departmentId = localStorage.getItem("department");

  useEffect(() => {
    const fetchInstructors = async () => {
      const response = await apiGet(`/user/instructors-by-department/${departmentId}`);
      if (response.success) {
        setInstructors(response.data);
      }
      setLoading(false);
    };

    if (departmentId) fetchInstructors();
    else setLoading(false);
  }, [departmentId]);

  const openResultsPage = (instructorId) => {
    window.open(`/evaluation/results/${instructorId}`, "_blank");
  };

  return (
    <div className="p-4">
      <Title level={2} className="text-h1" style={{color: "#ffff", fontSize: "24px"}} >
        <UserOutlined style={{ marginRight: 8, color: "white"}} />
        Instructor Reports
      </Title>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : instructors.length ? (
        <Row gutter={[16, 16]}>
          {instructors.map((instructor) => (
            <Col xs={24} sm={12} md={8} key={instructor.instructor_id}>
              <Card
                hoverable
                onClick={() => openResultsPage(instructor.instructor_id)}
              >
                <Title level={4} className="mb-2">
                  <UserOutlined style={{ marginRight: 6 }} />
                  {instructor.full_name}
                </Title>
                <div className="space-y-1">
                  <Text>
                    <IdcardOutlined style={{ marginRight: 6 }} />
                    <strong>ID:</strong> {instructor.instructor_id}
                  </Text>
                  <br />
                  <Text>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    <strong>Deadline:</strong>{" "}
                    {dayjs(instructor.evaluation_deadline).format("MMMM D, YYYY")}
                  </Text>
                  <br />
                  <Text type="secondary">
                    <FileSearchOutlined style={{ marginRight: 6 }} />
                    Click to view evaluation results
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No instructors found." />
      )}
    </div>
  );
};

export default DeanReports;
