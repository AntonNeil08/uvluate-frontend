import React, { useState } from "react";
import { Button, Typography, Divider } from "antd";
import {
  BarChartOutlined,
  CrownOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import CoordinatorEvaluationResultSheet from "../components/evaluation/CoordinatorEvaluationResultSheet";
import DeanEvaluationResultSheet from "../components/evaluation/DeanEvaluationResultSheet";
import ResultAcknowledgementSheet from "../components/evaluation/ResultAcknowledgementSheet";
const { Title } = Typography;


const EvaluationResults = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "summary":
        return <ResultAcknowledgementSheet/>;
      case "dean":
        return <DeanEvaluationResultSheet />;
      case "coordinator":
        return <CoordinatorEvaluationResultSheet/>;
      case "student":
        return <div>🎓 Students Evaluation content here</div>;
      case "comments":
        return <div>💬 Comments and Sentiment Analysis content here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <Title level={2}>📄 Evaluation Results</Title>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          icon={<BarChartOutlined />}
          type={activeTab === "summary" ? "primary" : "default"}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </Button>

        <Button
          icon={<CrownOutlined />}
          type={activeTab === "dean" ? "primary" : "default"}
          onClick={() => setActiveTab("dean")}
        >
          Dean Evaluation
        </Button>

        <Button
          icon={<TeamOutlined />}
          type={activeTab === "coordinator" ? "primary" : "default"}
          onClick={() => setActiveTab("coordinator")}
        >
          Coordinator Evaluation
        </Button>

        <Button
          icon={<UsergroupAddOutlined />}
          type={activeTab === "student" ? "primary" : "default"}
          onClick={() => setActiveTab("student")}
        >
          Students Evaluation
        </Button>

        <Button
          icon={<MessageOutlined />}
          type={activeTab === "comments" ? "primary" : "default"}
          onClick={() => setActiveTab("comments")}
        >
          Comments
        </Button>
      </div>

      <Divider />

      <div className="mt-4">{renderActiveComponent()}</div>
    </div>
  );
};

export default EvaluationResults;
