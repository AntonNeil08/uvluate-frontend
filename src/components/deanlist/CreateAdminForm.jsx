import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/createadminform.css";

const CreateAdminForm = () => {
    const [form] = Form.useForm();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const handleIdChange = (e) => {
        const newId = e.target.value;
        setId(newId);
        setPassword(newId); // Set password same as ID
        form.setFieldsValue({ password: newId }); // Also update AntD field value
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
            user_type: 1 // Admin type
        };

        try {
            const res = await fetch("http://localhost:8080/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                message.success("Admin created successfully.");
                form.resetFields();
                setId("");
                setPassword("");
            } else {
                message.error(result.message || "Failed to create admin.");
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("Server error. Please try again.");
        }
    };

    return (
        <div className="dean-form-wrapper">
            <Card className="dean-form-container">
                <h2 className="dean-form-title">ADMIN FORM</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name" name="First Name" rules={[{ required: true }]}>
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
                            <Form.Item label="Last Name" name="Last Name" rules={[{ required: true }]}>
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
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                                <Input placeholder="Enter Email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="ID" name="id" rules={[{ required: true }]}>
                                <Input
                                    value={id}
                                    onChange={handleIdChange}
                                    placeholder="Enter ID"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                                <Input.Password
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter Password"
                                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" className="register-button">Create</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateAdminForm;
