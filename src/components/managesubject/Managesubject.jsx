import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Table, message } from "antd";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/apiHelper"; // Axios API Helpers
import "../../styles/managesubject.css";

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]); // State for subject list
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();

  // ✅ Fetch subjects from API
  const fetchSubjects = async () => {
    setLoading(true);
    const response = await apiGet("/academic/subjects");
    if (response.success) {
      setSubjects(response.data);
    } else {
      message.error(response.message || "Failed to load subjects");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // ✅ Handle Create/Edit
  const handleSubmit = async (values) => {
    setLoading(true);
    let response;

    if (editingSubject) {
      response = await apiPut(`/academic/subjects/update/${editingSubject.code}`, values);
    } else {
      response = await apiPost("/academic/subjects/create", values);
    }

    if (response.success) {
      message.success(response.message);
      setIsModalOpen(false);
      form.resetFields();
      fetchSubjects();
    } else {
      message.error(response.message || "Error saving subject");
    }

    setLoading(false);
  };

  // ✅ Handle Delete
  const handleDelete = async (code) => {
    setLoading(true);
    const response = await apiDelete(`/academic/subjects/delete/${code}`);
    if (response.success) {
      message.success("Subject deleted successfully");
      fetchSubjects();
    } else {
      message.error(response.message || "Error deleting subject");
    }
    setLoading(false);
  };

  // ✅ Open Modal for Edit
  const handleEdit = (subject) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalOpen(true);
  };

  // ✅ Open Modal for Create
  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ✅ Table Columns
  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Subject Name", dataIndex: "subject_name", key: "subject_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button className="edit-btn" onClick={() => handleEdit(record)}>Edit</Button>
          <Button className="delete-btn" onClick={() => handleDelete(record.code)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div className="manage-subjects-container">
      <h1>Manage Subjects</h1>
      <Button className="add-subject-btn" onClick={handleAdd}>Add Subject</Button>
      <Table columns={columns} dataSource={subjects} rowKey="code" loading={loading} />

      {/* Modal for Add/Edit Subject */}
      <Modal
        title={editingSubject ? "Edit Subject" : "Add Subject"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="code" label="Subject Code" rules={[{ required: true, message: "Please enter subject code" }]}>
            <Input disabled={!!editingSubject} />
          </Form.Item>
          <Form.Item name="subject_name" label="Subject Name" rules={[{ required: true, message: "Please enter subject name" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSubjects;
