import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../utils/apiHelper";
import {
  Card,
  Typography,
  Radio,
  Input,
  Divider,
  message,
  Button,
  Spin,
  DatePicker,
} from "antd";
import SignaturePad from "react-signature-canvas";
import universityLogo from "../assets/university_logo.png";
import hrdLogo from "../assets/HRD_logo.png";
import "../styles/FacultySideEvaluation.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const questions = {
  A: {
    label: "Instruction (30%)",
    weight: 0.3,
    items: [
      "The faculty integrated the UV Core Values during asynchronous learning.",
      "The faculty supplemented modular content with practical examples and facilitate engaging experience using the uv.access.com.",
      "The faculty adhered to the designed instructional guide/syllabus and presents lessons/activities at a pace appropriate to the student’s capability. The faculty used the LMS in the delivery of his/her classes.",
      "The faculty engaged students in learning by relating the lessons/activities to other fields of knowledge.",
      "The faculty used the library learning resources to supplement classroom instruction/activities.",
    ],
  },
  B: {
    label: "Student Relation (30%)",
    weight: 0.3,
    items: [
      "The faculty is available for consultation during the designated hours.",
      "The faculty facilitates and monitors the progress of students on a consistent and regular basis.",
      "The faculty provided timely, relevant, transparent, and constructive feedback to students especially in the areas of improvement.",
      "The faculty remained reasonable in terms of setting deadlines.",
      "The faculty demonstrated concerns towards the welfare of the students.",
    ],
  },
  C: {
    label: "Policy Adherence (10%)",
    weight: 0.1,
    items: [
      "The faculty adhered to prescribe grading system.",
      "The faculty conserved and maintained confidentiality and professionalism in dealings with the students and their parents or guardians.",
      "The faculty followed the University prescribed schedule.",
    ],
  },
  D: {
    label: "Administrative Tasks (30%)",
    weight: 0.3,
    items: [
      "The faculty submitted required report on time.",
      "The faculty showed fairness, flexibility, and adaptability in dealing with situations.",
      "The faculty followed proper channels in official communications.",
      "The faculty demonstrated initiative and loyalty.",
      "The faculty contributed to the University Core Values through teaching..",
    ],
  },
};

const FacultySideEvaluation = () => {
  const { facultyID } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({});
  const [strengths, setStrengths] = useState(["", "", "", "", ""]);
  const [weaknesses, setWeaknesses] = useState(["", "", "", "", ""]);
  const [recommendations, setRecommendations] = useState("");
  const [timeline, setTimeline] = useState(null);
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluationDate, setEvaluationDate] = useState(null);
  const sigCanvas = useRef();
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await apiGet(`evaluation/instructor/details/${facultyID}`);
      if (res.success) setDetails(res.data);
      setLoading(false);
    };
    fetchDetails();
  }, [facultyID]);

  useEffect(() => {
    const honorifics = localStorage.getItem("honorifics") || "";
    const first = localStorage.getItem("first_name") || "";
    const middle = localStorage.getItem("middle_name") || "";
    const last = localStorage.getItem("last_name") || "";
    const suffix = localStorage.getItem("suffix") || "";

    const full = [honorifics, first, middle, last, suffix].filter(Boolean).join(" ");
    setEvaluatorName(full);
    setEvaluationDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas();
      canvas.getContext("2d", { willReadFrequently: true });
    }
  }, []);

  const handleScoreChange = (section, index, value) => {
    setResponses((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [index]: value },
    }));
  };

  const calculateAverage = (section) => {
    const entries = Object.values(responses[section] || {});
    return entries.length ? entries.reduce((a, b) => a + b, 0) / entries.length : 0;
  };

  const calculateWeighted = (section) => calculateAverage(section) * questions[section].weight;

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData(null);
  };

  const handleSubmit = async () => {
    for (const [section, q] of Object.entries(questions)) {
      if (!responses[section] || Object.keys(responses[section]).length !== q.items.length) {
        message.error(`Please complete all questions in Section ${section}`);
        return;
      }
    }

    if (!signatureData) {
      message.error("Please provide a digital signature.");
      return;
    }

    const data = {
      instructor_id: facultyID,
      evaluator_id: localStorage.getItem("user_id"),
      evaluator_name: evaluatorName,
      evaluation_date: evaluationDate,
      recommendations,
      timeline,
      signature: signatureData,
    };

    strengths.forEach((val, i) => (data[`strength_${i + 1}`] = val));
    weaknesses.forEach((val, i) => (data[`weakness_${i + 1}`] = val));

    Object.entries(questions).forEach(([key, section]) => {
      section.items.forEach((_, idx) => {
        data[`${key}${idx + 1}`] = responses[key]?.[idx] || 0;
      });
      data[`${key}_comment`] = comments[key] || "";
      data[`${key}_average`] = calculateAverage(key).toFixed(2);
    });

    data.overall_rating = (
      ["A", "B", "C", "D"].map(calculateWeighted).reduce((sum, val) => sum + val, 0)
    ).toFixed(2);

    setSubmitting(true);
    const res = await apiPost("/evaluation/add-faculty-response", data);
    setSubmitting(false);

    res.success
      ? message.success("Evaluation submitted successfully.")
      : message.error(res.message || "Failed to submit evaluation.");
  };

  if (loading) return <Spin size="large" className="mt-10 block mx-auto" />;

  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <img src={universityLogo} className="logo" alt="University Logo" />
        <img src={hrdLogo} className="logo" alt="HRD Logo" />
      </div>

      <Title level={2} className="text-center">University of the Visayas</Title>
      <Title level={3} className="text-center">Faculty Evaluation Form</Title>

      <Paragraph className="intro-text">
        The Evaluation of Faculty members is a developmental tool in promoting effectiveness for both the instructor and the University of the Visayas. To assess the progress of the Faculty member, students are encouraged to fill out this Evaluation Questionnaire.
      </Paragraph>

      <Paragraph>
        <Text strong>Score meaning:</Text><br />
        5 – Excellent, 4 – Very Good, 3 – Good, 2 – Fair, 1 – Needs Improvement
      </Paragraph>

      <Divider />

      <div className="info-grid">
        <Input value={details?.full_name || ""} readOnly />
        <Input value={details?.department || ""} readOnly />
        <Input type="date" value={new Date().toISOString().split("T")[0]} readOnly />
      </div>

      {Object.entries(questions).map(([sectionKey, section]) => (
        <Card key={sectionKey} title={`${sectionKey}. ${section.label}`} className="mb-6">
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Indicator</th>
                {[1, 2, 3, 4, 5].map(score => <th key={score}>{score}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item}</td>
                  {[1, 2, 3, 4, 5].map(score => (
                    <td key={score}>
                      <Radio
                        checked={responses[sectionKey]?.[idx] === score}
                        onChange={() => handleScoreChange(sectionKey, idx, score)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="score-summary">
            <Text strong>Average Rating:</Text> {calculateWeighted(sectionKey).toFixed(2)}
          </div>
          <TextArea
            rows={3}
            className="mt-2"
            placeholder="Further Comments (if any)"
            onChange={(e) =>
              setComments((prev) => ({ ...prev, [sectionKey]: e.target.value }))
            }
            value={comments[sectionKey] || ""}
          />
        </Card>
      ))}

      <Card className="mb-6 text-center">
        <Title level={4}>Overall Rating: {
          (
            ["A", "B", "C", "D"].map(calculateWeighted).reduce((sum, val) => sum + val, 0)
          ).toFixed(2)}
        </Title>
      </Card>

      <Card className="mb-6">
        <Title level={4}>Developmental Aspects</Title>
        <div className="aspect-grid">
          <div>
            <Text strong>STRENGTHS</Text>
            {strengths.map((s, i) => (
              <Input key={i} className="my-2" value={s} onChange={e => {
                const copy = [...strengths]; copy[i] = e.target.value;
                setStrengths(copy);
              }} />
            ))}
          </div>
          <div>
            <Text strong>WEAKNESSES</Text>
            {weaknesses.map((w, i) => (
              <Input key={i} className="my-2" value={w} onChange={e => {
                const copy = [...weaknesses]; copy[i] = e.target.value;
                setWeaknesses(copy);
              }} />
            ))}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <Text strong>Recommendations / Resolutions</Text>
        <TextArea
          rows={4}
          className="mt-2"
          required
          value={recommendations}
          onChange={(e) => setRecommendations(e.target.value)}
        />
      </Card>

      <Card className="mb-6">
        <Text strong>Target Timeline to Revisit</Text>
        <DatePicker
          className="w-full mt-2"
          onChange={(d, ds) => setTimeline(ds)}
        />
      </Card>

      <Card className="mb-10">
        <Title level={5}>Evaluated By / Rater:</Title>
        <Text strong>Digital Signature:</Text>
        <div className="signature-pad">
            <SignaturePad
            ref={sigCanvas}
            onEnd={() => {
                if (!sigCanvas.current.isEmpty()) {
                const sig = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
                setSignatureData(sig);
                }
            }}
            canvasProps={{ className: "signature-canvas" }}
            />
        </div>
        <div className="flex justify-end mt-2">
            <Button onClick={clearSignature}>Clear</Button>
        </div>

        <Input
            className="my-2"
            placeholder="Evaluator Name"
            value={evaluatorName}
            readOnly
        />
        <Input
            className="my-2"
            placeholder="Date"
            value={evaluationDate}
            readOnly
        />
        <p className="mt-2">Department: {details?.department}</p>
        </Card>

      <div className="text-center">
        <Button type="primary" size="large" onClick={handleSubmit} loading={submitting}>
          Submit Evaluation
        </Button>
      </div>

      <div className="evaluation-footer">
        University of the Visayas Human Resources Department, Colon St., Cebu City Philippines 6000<br />
        Tel: (032) 253-6413 loc. 210 • Email: hrdmain@uv.edu.ph • Website: www.uv.edu.ph
      </div>
    </div>
  );
};

export default FacultySideEvaluation;
