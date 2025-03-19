import React from "react";
import DeanStudentList from "../deanlist/DeanList";
import CreateDeanForm from "../deanlist/CreateDeanForm"; // Corrected import
import CreateAdminForm from "../deanlist/CreateAdminForm";

export default function AdminManageUser() {
  return (
    <div>
      <CreateDeanForm /> 
      <CreateAdminForm /> {/* Inserted Dean Form */}
      <DeanStudentList />
    </div>
  );
}
