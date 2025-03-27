import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Select, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/createdeanform.css";

const { Option } = Select;

const departments = [
    { id: "1", department_name: "College of Allied Health Sciences", is_deleted: "0" },
    { id: "2", department_name: "College of Arts and Sciences", is_deleted: "0" },
    { id: "3", department_name: "College of Business Administration", is_deleted: "0" },
    { id: "4", department_name: "College of Criminal Justice Education", is_deleted: "0" },
    { id: "5", department_name: "College of Education", is_deleted: "0" },
    { id: "6", department_name: "College of Engineering, Technology, and Architecture", is_deleted: "0" },
    { id: "7", department_name: "College of Maritime Education", is_deleted: "0" },
];

const CreateDeanForm = () => {
    const [form] = Form.useForm();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const handleIdChange = (e) => {
        const newId = e.target.value;
        setId(newId);
        setPassword(newId);
        form.setFieldsValue({ password: newId }); // Sync form password field
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (values) => {
        const payload = {
            id: values.id,
            password: values.password,
            email: values.email,
            first_name: values.firstName,
            middle_name: values.middleName || null,
            last_name: values.lastName,
            suffix: values.suffix || null,
            department: values.department,
            user_type: 2 // Dean
        };

        try {
            const res = await fetch("http://localhost:8080/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                message.success("Dean created successfully.");
                form.resetFields();
                setId("");
                setPassword("");
            } else {
                message.error(result.message || "Failed to create dean.");
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("Server error. Please try again.");
        }
    };

    return (
        <div className="dean-form-wrapper">
            <Card className="dean-form-container">
                <h2 className="dean-form-title">DEAN FORM</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Required" }]}>
                                <Input placeholder="Enter First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Middle Name" name="middleName">
                                <Input placeholder="Enter Middle Name (Optional)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}>
                                <Input placeholder="Enter Last Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Suffix" name="suffix">
                                <Input placeholder="Enter Suffix (Optional)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid Email" }]}>
                                <Input placeholder="Enter Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Department" name="department" rules={[{ required: true, message: "Required" }]}>
                                <Select placeholder="Select Department">
                                    {departments
                                        .filter(dept => dept.is_deleted === "0")
                                        .map(dept => (
                                            <Option key={dept.id} value={dept.department_name}>
                                                {dept.department_name}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="ID" name="id" rules={[{ required: true, message: "Required" }]}>
                                <Input
                                    value={id}
                                    onChange={handleIdChange}
                                    placeholder="Enter ID"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Required" }]}>
                                <Input.Password
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter Password"
                                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" className="register-button">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateDeanForm;
