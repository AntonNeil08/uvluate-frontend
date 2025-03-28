import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../utils/apiHelper";
import {
  Typography,
  Card,
  Spin,
  Input,
  Divider,
  Image,
  DatePicker,
} from "antd";
import "../../styles/FacultySideEvaluation.css";
import universityLogo from "../../assets/university_logo.png";
import hrdLogo from "../../assets/HRD_logo.png";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const questions = {
  a: {
    label: "Instruction (30%)",
    items: [
      "The faculty integrated the UV Core Values during asynchronous learning.",
      "The faculty supplemented modular content with practical examples and facilitate engaging experience using the uv.access.com.",
      "The faculty adhered to the designed instructional guide/syllabus and presents lessons/activities at a pace appropriate to the student’s capability. The faculty used the LMS in the delivery of his/her classes.",
      "The faculty engaged students in learning by relating the lessons/activities to other fields of knowledge.",
      "The faculty used the library learning resources to supplement classroom instruction/activities.",
    ],
  },
  b: {
    label: "Student Relation (30%)",
    items: [
      "The faculty is available for consultation during the designated hours.",
      "The faculty facilitates and monitors the progress of students on a consistent and regular basis.",
      "The faculty provided timely, relevant, transparent, and constructive feedback to students especially in the areas of improvement.",
      "The faculty remained reasonable in terms of setting deadlines.",
      "The faculty demonstrated concerns towards the welfare of the students.",
    ],
  },
  c: {
    label: "Policy Adherence (10%)",
    items: [
      "The faculty adhered to prescribe grading system.",
      "The faculty conserved and maintained confidentiality and professionalism in dealings with the students and their parents or guardians.",
      "The faculty followed the University prescribed schedule.",
    ],
  },
  d: {
    label: "Administrative Tasks (30%)",
    items: [
      "The faculty submitted required report on time.",
      "The faculty showed fairness, flexibility, and adaptability in dealing with situations.",
      "The faculty followed proper channels in official communications.",
      "The faculty demonstrated initiative and loyalty.",
      "The faculty contributed to the University Core Values through teaching.",
    ],
  },
};

const CoordinatorEvaluationResultSheet = () => {
  const { facultyID } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await apiGet(`/evaluation/coord-evaluation-by-instructor/${facultyID}`);
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    };

    loadData();
  }, [facultyID]);

  if (loading || !data) return <Spin size="large" className="mt-10 block mx-auto" />;

  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <img src={universityLogo} className="logo" alt="University Logo" />
        <img src={hrdLogo} className="logo" alt="HRD Logo" />
      </div>

      <Title level={2} className="text-center">University of the Visayas</Title>
      <Paragraph className="intro-text">
      The Evaluation of Faculty members is a developmental tool in promoting effectiveness for both the instructor and the University of the Visayas. To assess the progress of the Faculty member, students are encouraged to fill out this Evaluation Questionnaire.
      </Paragraph>
      <Paragraph>
        <Text strong>Score meaning:</Text><br />
        5 – Excellent, 4 – Very Good, 3 – Good, 2 – Fair, 1 – Needs Improvement
      </Paragraph>
      <Divider />

      <div className="info-grid">
        <Input value={data.teaching_staff_id} readOnly />
        <Input value={data.department_name} readOnly />
        <Input value={data.timestamp?.split(" ")[0]} readOnly />
      </div>

      {Object.entries(questions).map(([key, section]) => (
        <Card key={key} title={`${key.toUpperCase()}. ${section.label}`} className="mb-6">
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item}</td>
                  <td>{data[`${key}${idx + 1}`]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="score-summary">
            <Text strong>Average Rating:</Text> {data[`${key}_average`] || "0.00"}
          </div>
          <TextArea
            rows={3}
            className="mt-2"
            readOnly
            value={data[`${key}_comment`] || ""}
          />
        </Card>
      ))}

      <Card className="mb-6 text-center">
        <Title level={4}>Overall Rating</Title>
        <Input value={data.overall} readOnly />
      </Card>

      <Card className="mb-6">
        <Title level={4}>Developmental Aspects</Title>
        <div className="aspect-grid">
          <div>
            <Text strong>STRENGTHS</Text>
            {[1, 2, 3, 4, 5].map((i) => (
              <Input key={i} className="my-2" value={data[`s${i}`] || ""} readOnly />
            ))}
          </div>
          <div>
            <Text strong>WEAKNESSES</Text>
            {[1, 2, 3, 4, 5].map((i) => (
              <Input key={i} className="my-2" value={data[`w${i}`] || ""} readOnly />
            ))}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <Text strong>Recommendations / Resolutions</Text>
        <TextArea
          rows={4}
          className="mt-2"
          value={data.recommendation}
          readOnly
        />
      </Card>

      <Card className="mb-6">
        <Text strong>Target Timeline to Revisit</Text>
        <Input value={data.target_time} readOnly />
      </Card>

      <Card className="mb-10">
        <Title level={5}>Evaluated By / Rater:</Title>
        <Text strong>Digital Signature:</Text>
        <div className="signature-pad">
          {data.signature && (
            <Image src={`data:image/png;base64,${data.signature}`} alt="Signature" className="signature-canvas" />
          )}
        </div>
        <Input className="my-2" value={data.evaluator_name} readOnly />
        <Input className="my-2" value={data.timestamp?.split(" ")[0]} readOnly />
        <p className="mt-2">Department: {data.department_name}</p>
        <p>School Year: {data.school_year}</p>
        <p>Semester: {data.semester}</p>
      </Card>

      <div className="evaluation-footer">
        University of the Visayas Human Resources Department, Colon St., Cebu City Philippines 6000<br />
        Tel: (032) 253-6413 loc. 210 • Email: hrdmain@uv.edu.ph • Website: www.uv.edu.ph
      </div>
    </div>
  );
};

export default CoordinatorEvaluationResultSheet;
