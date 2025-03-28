import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { apiPost } from "../../utils/apiHelper";
import "../../styles/facultyform.css";

const { Option } = Select;

const departments = [
  { id: "1", department_name: "Engineering", is_deleted: "0" },
  { id: "2", department_name: "Business Administration", is_deleted: "0" },
  { id: "3", department_name: "Computer Science", is_deleted: "0" },
  { id: "4", department_name: "Educational", is_deleted: "0" },
  { id: "5", department_name: "Health Sciences", is_deleted: "0" },
  { id: "6", department_name: "CETA", is_deleted: "0" },
];

const FacultyForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [idValue, setIdValue] = useState("");

  useEffect(() => {
    form.setFieldsValue({ password: idValue });
  }, [idValue, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      id: values.id,
      email: values.email,
      first_name: values.firstName,
      middle_name: values.middleName || null,
      last_name: values.lastName,
      suffix: values.suffix || null,
      department_id: values.department,
      password: values.password,  // Password auto-filled from ID
      user_type: 4,
    };

    try {
      const result = await apiPost("/user/create", payload);

      if (result.success) {
        message.success(result.message || "User created successfully!");
        form.resetFields();
        setIdValue(""); // Reset ID state after successful submission
      } else {
        message.error(result.messages?.message || "Failed to create user.");
      }
    } catch (error) {
      message.error(error.messages?.message || "An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="faculty-wrapper">
      <div className="form-wrapper">
        <div className="form-container">
          <h2 className="form-title">FACULTY FORM</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="form-grid">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "First Name is required" }]}>
              <Input placeholder="Enter First Name" />
            </Form.Item>

            <Form.Item label="Middle Name" name="middleName">
              <Input placeholder="Enter Middle Name (Optional)" />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Last Name is required" }]}>
              <Input placeholder="Enter Last Name" />
            </Form.Item>

            <Form.Item label="Suffix" name="suffix">
              <Input placeholder="Enter Suffix (Optional)" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
              <Input placeholder="Enter Email" />
            </Form.Item>

            <Form.Item label="Department" name="department" rules={[{ required: true, message: "Department is required" }]}>
              <Select placeholder="Select Department">
                {departments.filter(dept => dept.is_deleted === "0").map(dept => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="ID" name="id" rules={[{ required: true, message: "ID is required" }]}>
              <Input placeholder="Enter ID" onChange={(e) => setIdValue(e.target.value)} />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
              <Input.Password placeholder="Enter Password" disabled/>
            </Form.Item>

            <div className="form-actions">
              <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;
