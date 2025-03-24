import { useEffect, useState } from "react";
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
} from "antd";
import universityLogo from "../assets/university_logo.png";
import hrdLogo from "../assets/HRD_logo.png";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const questions = {
  A: {
    label: "Instruction (30%)",
    weight: 0.3,
    items: [
      "Able to integrate the UV Core Values during asynchronous learning.",
      "Able to supplement modular content with practical examples and facilitate engaging experience using the uv.access.com.",
      "Adheres to the designed instructional guide/syllabus and presents lessons/activities at a pace appropriate to the student’s capability.",
      "Able to engage student in learning by relating the lessons/activities to other fields of knowledge.",
    ],
  },
  B: {
    label: "Student Relation (30%)",
    weight: 0.3,
    items: [
      "Remains available for consultation during the designated hours.",
      "Regularly and consistently facilitates and monitors the progress of students.",
      "Provides timely, relevant, transparent, and constructive feedback to students especially in the areas of improvement.",
      "Remains reasonable in terms of setting deadlines.",
      "Demonstrates concerns towards the welfare of the students.",
    ],
  },
  C: {
    label: "Policy Adherence (10%)",
    weight: 0.1,
    items: [
      "Adheres to prescribe grading system.",
      "Maintains confidentiality and professionalism in dealings with the students and their parents or guardians.",
      "Follows the University prescribed schedule.",
    ],
  },
  D: {
    label: "Administrative Tasks (30%)",
    weight: 0.3,
    items: [
      "Submits required report on time.",
      "Shows fairness, flexibility, and adaptability in dealing with situations.",
      "Follows proper channels in official communications.",
      "Demonstrates initiative and loyalty.",
      "Contributes to the University Core Values through teaching.",
    ],
  },
};

const StudentSideEvaluation = () => {
  const { assignmentId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await apiGet(`deployment/evaluation-details/${assignmentId}`);
      if (res.success) {
        setDetails(res.data);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [assignmentId]);

  const handleScoreChange = (section, index, value) => {
    setResponses((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [index]: value,
      },
    }));
  };

  const handleCommentChange = (section, value) => {
    setComments((prev) => ({ ...prev, [section]: value }));
  };

  const calculateAverage = (section) => {
    const entries = Object.values(responses[section] || {});
    if (!entries.length) return 0;
    const sum = entries.reduce((a, b) => a + b, 0);
    return sum / entries.length;
  };

  const calculateWeighted = (section) => {
    return calculateAverage(section) * questions[section].weight;
  };

  const handleSubmit = async () => {
    for (const [section, q] of Object.entries(questions)) {
      if (
        !responses[section] ||
        Object.keys(responses[section]).length !== q.items.length
      ) {
        message.error(`Please complete all questions in Section ${section}`);
        return;
      }
    }

    const data = {
      assignment_id: assignmentId,
    };

    Object.entries(questions).forEach(([sectionKey, section]) => {
      section.items.forEach((_, idx) => {
        const score = responses[sectionKey]?.[idx] || 0;
        data[`${sectionKey}${idx + 1}`] = score;
      });
      data[`${sectionKey}_comment`] = comments[sectionKey] || "";
      data[`${sectionKey}_average`] = calculateAverage(sectionKey).toFixed(2);
    });

    data.overall_rating = (
      ["A", "B", "C", "D"]
        .map((sec) => calculateWeighted(sec))
        .reduce((sum, val) => sum + val, 0)
    ).toFixed(2);

    setSubmitting(true);
    const res = await apiPost("evaluation/add-response", data);
    setSubmitting(false);

    if (res.success) {
      message.success("Evaluation submitted successfully.");
    } else {
      message.error(res.message || "Failed to submit evaluation.");
    }
  };

  if (loading) return <Spin size="large" className="mt-10 block mx-auto" />;

  return (
    <div className="p-10 max-w-[900px] mx-auto bg-white">
      {/* Logos */}
      <div className="flex justify-between items-center mb-4">
        <img src={universityLogo} alt="University Logo" className="h-20" />
        <img src={hrdLogo} alt="HRD Logo" className="h-20" />
      </div>

      <Title level={2} className="text-center">University of the Visayas</Title>
      <Title level={3} className="text-center mt-4">Faculty Evaluation Form</Title>

      <Paragraph className="text-justify mt-4">
        The Evaluation of Faculty members is a developmental tool in promoting effectiveness for both the instructor and the University of the Visayas. 
        To assess the progress of the Faculty member, students are encouraged to fill out this Evaluation Questionnaire.
      </Paragraph>

      <Paragraph className="mt-2">
        <Text strong>Score meaning:</Text><br />
        5 – Excellent (Significantly Exceeded Expectations), 4 – Very Good (Exceeded Expectations),
        3 – Good (Fully Met Expectations), 2 – Fair (Met some but not all expectations),
        1 – Needs Improvement (Didn’t meet Expectations)
      </Paragraph>

      <Divider />

      {/* Instructor Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input value={details?.instructor_name} readOnly />
        <Input value={details?.department_name} readOnly />
        <Input type="date" value={new Date().toISOString().split("T")[0]} readOnly />
      </div>

      {/* Evaluation Sections */}
      {Object.entries(questions).map(([sectionKey, section]) => (
        <Card
          key={sectionKey}
          title={`${sectionKey}. ${section.label}`}
          className="mb-6"
          variant="outlined"
        >
          <table className="w-full text-sm mb-4 border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Indicator</th>
                {[1, 2, 3, 4, 5].map((score) => (
                  <th key={score} className="text-center p-2">{score}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item}</td>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <td key={score} className="text-center">
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

            <Text strong>Average Rating: </Text>
            <Text>{calculateWeighted(sectionKey).toFixed(2)}</Text>


          <TextArea
            rows={3}
            className="mt-4"
            placeholder="Further Comments (if any)"
            onChange={(e) => handleCommentChange(sectionKey, e.target.value)}
            value={comments[sectionKey] || ""}
          />
        </Card>
      ))}

      <Card className="mt-6 mb-10 text-center">
        <Title level={4}>Overall Rating: {
          (
            ["A", "B", "C", "D"]
              .map((sec) => calculateWeighted(sec))
              .reduce((sum, val) => sum + val, 0)
          ).toFixed(2)
        }</Title>
      </Card>

      <div className="text-center">
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={submitting}
        >
          Submit Evaluation
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t pt-4 mt-10">
        University of the Visayas Human Resources Department, Corner D. Jakosalem & Colon St., Cebu City Philippines 6000<br />
        Telephone : (032) 253-6413 loc. 210 • Email : hrdmain@uv.edu.ph • Website : www.uv.edu.ph
      </div>
    </div>
  );
};

export default StudentSideEvaluation;
