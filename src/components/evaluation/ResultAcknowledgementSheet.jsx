import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Table, Spin, Input } from "antd";
import { apiGet } from "../../utils/apiHelper";
import imageBanner from "../../assets/image1.png";

const { Title, Paragraph, Text } = Typography;

const ResultAcknowledgementSheet = () => {
  const { facultyID } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAcknowledged = async () => {
      const res = await apiGet(`/evaluation/acknowledged-result/${facultyID}`);
      if (res.success) setData(res.data);
      setLoading(false);
    };
    fetchAcknowledged();
  }, [facultyID]);

  const currentDate = new Date().toISOString().split("T")[0];
  const getPosition = (type) => (type === 3 ? "Program Coordinator" : "Faculty");

  const tableData = data
    ? [
        {
          key: 1,
          evaluator: "Student (60%)",
          score: parseFloat(data.student_overall).toFixed(2),
          interpretation: data.interpretation_student,
        },
        {
          key: 2,
          evaluator: "Program Coordinator (20%)",
          score: parseFloat(data.program_coordinator_overall).toFixed(2),
          interpretation: data.interpretation_coordinator,
        },
        {
          key: 3,
          evaluator: "Dean (20%)",
          score: parseFloat(data.dean_overall).toFixed(2),
          interpretation: data.interpretation_dean,
        },
      ]
    : [];

  const columns = [
    { title: "#", dataIndex: "key", width: 60 },
    { title: "Evaluator", dataIndex: "evaluator" },
    { title: "Gained Rating", dataIndex: "score" },
    { title: "Interpretation", dataIndex: "interpretation" },
  ];

  if (loading || !data) return <Spin size="large" className="block mx-auto mt-10" />;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <img src={imageBanner} alt="Banner" className="mb-6 w-full" />

      <Title level={4}>For: {data.instructor_name}</Title>
      <Text>
        {getPosition(data.user_type)}, {data.department}
      </Text>

      <Title level={4} className="mt-4">
        From: {data.dean_name}
      </Title>
      <Text>Dean, {data.department}</Text>

      <Paragraph className="mt-4">
        <Text strong>Date:</Text> {data.date || currentDate}
      </Paragraph>
      <Paragraph>
        <Text strong>Re:</Text> Faculty Evaluation Report
      </Paragraph>
      <hr />

      <Paragraph>
        Good day.
        <br />
        <br />
        The following data are the consolidated results of the Faculty Performance
        Evaluation for the {data.semester} Semester of AY: {data.school_year}
      </Paragraph>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        className="my-4"
      />

      <Paragraph className="mt-6">
        <Text strong>
          The following are the comments and recommendations provided by the
          evaluators:
        </Text>
      </Paragraph>

      {[1, 2, 3, 4, 5].map((i) => (
        <Input
          key={i}
          value={data[`comment${i}`] || ""}
          className="my-2"
          readOnly
        />
      ))}

      <Paragraph className="mt-6">
        <Text strong>Acknowledged:</Text>
      </Paragraph>
      <div className="border p-2 rounded bg-white">
        <img
          src={
            data.signature.startsWith("data:image")
              ? data.signature
              : `data:image/png;base64,${data.signature}`
          }
          alt="Signature"
          className="h-40 object-contain"
        />
      </div>

      <div className="text-right mt-4">
        <Text>Date: {data.date || currentDate}</Text>
      </div>
    </div>
  );
};

export default ResultAcknowledgementSheet;
