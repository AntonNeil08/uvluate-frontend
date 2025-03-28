import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form } from "antd";

const SubjectForm = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  return (
    <Modal
      title={initialData ? "Edit Subject" : "Add New Subject"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" className="cancel-btn" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" className="save-btn" type="primary" onClick={() => form.submit()}>
          {initialData ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="code" label="Subject Code" rules={[{ required: true, message: "Please enter subject code" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="subject_name" label="Subject Name" rules={[{ required: true, message: "Please enter subject name" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;
