import React, { useState } from "react";
import { Form, Input, Select, Button, Card } from "antd";
import "../../styles/createdeanform.css"; // Import external CSS

const { Option } = Select;

const CreateDeanForm = () => {
  const [form] = Form.useForm();
  const [id, setId] = useState(""); // ID is also used as the password

  return (
    <div className="dean-form-container">
      <Card className="dean-form-card">
        <h2 className="dean-form-title">Create Dean Form</h2>
        <Form form={form} layout="vertical">
          {/* ID Field (Also Password) */}
          <Form.Item label="ID" name="id" rules={[{ required: true, message: "ID is required" }]}>
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Dean ID" />
          </Form.Item>

          {/* Password (Disabled, Read-Only, Uses ID) */}
          <Form.Item label="Password (Same as ID)" name="password">
            <Input.Password value={id} disabled readOnly />
          </Form.Item>

          {/* First Name */}
          <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: "First Name is required" }]}>
            <Input placeholder="Enter First Name" />
          </Form.Item>

          {/* Middle Name (Optional) */}
          <Form.Item label="Middle Name (Optional)" name="middle_name">
            <Input placeholder="Enter Middle Name" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: "Last Name is required" }]}>
            <Input placeholder="Enter Last Name" />
          </Form.Item>

          {/* Suffix (Optional) */}
          <Form.Item label="Suffix (Optional)" name="suffix">
            <Input placeholder="Enter Suffix (e.g., Jr., Sr.)" />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email" rules={[{ type: "email", required: true, message: "Valid Email is required" }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>

          {/* Department */}
          <Form.Item label="Department" name="department" rules={[{ required: true, message: "Department is required" }]}>
            <Select placeholder="Select Department">
              <Option value="CETA">CETA</Option>
              <Option value="CBA">CBA</Option>
              <Option value="CAS">CAS</Option>
              <Option value="CCS">CCS</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="dean-form-button">
              Create Dean
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateDeanForm;
