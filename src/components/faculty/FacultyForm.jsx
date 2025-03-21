import React from "react";
import { Form, Input, Button } from "antd";
import "../../styles/facultyform.css"; // Import external CSS

const FacultyForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">FACULTY FORM</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="form-grid">
          <Form.Item label="First Name" name="firstName" >
            <Input placeholder="Enter First Name" />
          </Form.Item>

          <Form.Item label="Middle Name" name="middleName">
            <Input placeholder="Enter Middle Name (Optional)" />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName" >
            <Input placeholder="Enter Last Name" />
          </Form.Item>

          <Form.Item label="Suffix" name="suffix">
            <Input placeholder="Enter Suffix (Optional)" />
          </Form.Item>

          <Form.Item label="Email" name="email" >
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item label="Department" name="department" >
            <Input placeholder="Enter Department" />
          </Form.Item>

          <Form.Item label="ID" name="id" >
            <Input placeholder="Enter ID" />
          </Form.Item>

          <Form.Item label="Password" name="password" >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <div className="form-actions">
            <Button type="primary" htmlType="submit" className="submit-button">
              Create
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FacultyForm;
