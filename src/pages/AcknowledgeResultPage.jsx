import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, Table, Input, message, Button, Spin } from "antd";
import SignaturePad from "react-signature-canvas";
import { apiGet, apiPost } from "../utils/apiHelper";
import imageBanner from "../assets/image1.png";

const { Title, Paragraph, Text } = Typography;

const DeanAcknowledgementPage = () => {
  const { facultyID } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [inputs, setInputs] = useState({
    interpretation_student: "",
    interpretation_coordinator: "",
    interpretation_dean: "",
    comment1: "",
    comment2: "",
    comment3: "",
    comment4: "",
    comment5: "",
  });
  const [signature, setSignature] = useState(null);
  const sigRef = useRef(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await apiGet(`/evaluation/weighted-summary/${facultyID}`);
      if (res.success) {
        setData(res.data);
        const loadedComments = {};
        res.data.top_comment_categories.slice(0, 5).forEach((item, idx) => {
            loadedComments[`comment${idx + 1}`] = item.category;
        });

        setInputs(prev => ({ ...prev, ...loadedComments }));
      }
      setLoading(false);
    };
    fetchSummary();
  }, [facultyID]);

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!signature) {
      message.error("Please provide a signature.");
      return;
    }

    const deanId = localStorage.getItem("user_id");

    const payload = {
      instructor_id: facultyID,
      dean_id: deanId,
      signature,
      student_overall: (data.student_average * 0.6).toFixed(2),
      program_coordinator_overall: (data.coordinator_average * 0.2).toFixed(2),
      dean_overall: (data.dean_average * 0.2).toFixed(2),
      ...inputs,
    };

    const res = await apiPost("/evaluation/acknowledge-result", payload);
    if (res.success) {
      message.success("Acknowledgement submitted.");
    } else {
      message.error(res.message);
    }
  };

  if (loading) return <Spin size="large" className="block mx-auto mt-10" />;

  const currentDate = new Date().toISOString().split("T")[0];
  const getPosition = type => (type === 3 ? "Program Coordinator" : "Faculty");

  const tableData = [
    {
      key: 1,
      evaluator: "Student (60%)",
      score: (data.student_average * 0.6).toFixed(2),
      field: "interpretation_student",
    },
    {
      key: 2,
      evaluator: "Program Coordinator (20%)",
      score: (data.coordinator_average * 0.2).toFixed(2),
      field: "interpretation_coordinator",
    },
    {
      key: 3,
      evaluator: "Dean (20%)",
      score: (data.dean_average * 0.2).toFixed(2),
      field: "interpretation_dean",
    },
  ];

  const columns = [
    { title: "#", dataIndex: "key" },
    { title: "Evaluator", dataIndex: "evaluator" },
    { title: "Gained Rating", dataIndex: "score" },
    {
      title: "Interpretation",
      render: (_, record) => (
        <Input
          value={inputs[record.field]}
          onChange={e => handleInputChange(record.field, e.target.value)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src={imageBanner} alt="Banner" className="mb-6 w-full" />

      <Title level={4}>For: {data.instructor_name}</Title>
      <Text>
        {getPosition(data.user_type)}, {data.department}
      </Text>

      <Title level={4} className="mt-4">From: {data.dean_name}</Title>
      <Text>Dean, {data.department}</Text>

      <Paragraph className="mt-4"><Text strong>Date:</Text> {currentDate}</Paragraph>
      <Paragraph><Text strong>Re:</Text> Faculty Evaluation Report</Paragraph>
      <hr></hr>
      <Paragraph>
        Good day. <br /><br />
        The following data are the consolidated results of the Faculty Performance Evaluation for the {data.semester} Semester of AY: {data.school_year}
      </Paragraph>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        className="my-4"
      />

      <Paragraph className="mt-6"><Text strong>The following are the comments and recommendations provided by the evaluators:</Text></Paragraph>
      {[1, 2, 3, 4, 5].map(i => (
        <Input
          key={i}
          value={inputs[`comment${i}`]}
          onChange={e => handleInputChange(`comment${i}`, e.target.value)}
          className="my-2"
          readOnly
        />
      ))}

      <Paragraph className="mt-6"><Text strong>Acknowledged:</Text></Paragraph>
      <div className="border p-2 rounded">
        <SignaturePad
          ref={sigRef}
          canvasProps={{ className: "w-full h-40 border" }}
          onEnd={() => setSignature(sigRef.current.getTrimmedCanvas().toDataURL("image/png"))}
        />
        <Button onClick={() => { sigRef.current.clear(); setSignature(null); }} className="mt-2">Clear</Button>
      </div>

      <div className="text-right mt-6">
        <Button type="primary" onClick={handleSubmit}>Submit Acknowledgement</Button>
      </div>

      <Paragraph className="mt-4"><Text strong>Date:</Text> {currentDate}</Paragraph>

      <Paragraph className="text-center mt-10 text-sm text-gray-600">
        University of the Visayas Human Resources Department, Colon St., Cebu City Philippines 6000<br />
        Tel: (032) 253-6413 loc. 210 • Email: hrdmain@uv.edu.ph • Website: www.uv.edu.ph
      </Paragraph>
    </div>
  );
};

export default DeanAcknowledgementPage;