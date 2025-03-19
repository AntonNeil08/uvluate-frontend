import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/createdeanform.css";

const CreateDeanForm = () => {
    const [form] = Form.useForm();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (values) => {
        console.log("Form Submitted:", values);
    };

    return (
        <div className="dean-form-wrapper">
            <Card className="dean-form-container">
                <h2 className="dean-form-title">DEAN FORM</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name   " name="firstName" rules={[{ required: true, message: "Required" }]}> 
                                <Input placeholder="Enter First Name" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Middle Name " name="middleName"> 
                                <Input placeholder="Enter Middle Name (Optional)" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Required" }]}> 
                                <Input placeholder="Enter Last Name" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Suffix" name="suffix"> 
                                <Input placeholder="Enter Suffix (Optional)" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid Email" }]}> 
                                <Input placeholder="Enter Email" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Department" name="department" rules={[{ required: true, message: "Required" }]}> 
                                <Input placeholder="Enter Department" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="ID" name="id" rules={[{ required: true, message: "Required" }]}> 
                                <Input 
                                    value={id} 
                                    onChange={(e) => setId(e.target.value)} 
                                    placeholder="Enter ID" 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Required" }]}> 
                                <Input.Password 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password" 
                                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} 
                                    style={{ width: '100%' }}
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

export default CreateDeanForm;
