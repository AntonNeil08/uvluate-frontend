import DepartmentList from "../components/department/DepartmentList";
import "../styles/adminmanagedepartment.css"; // External CSS
import ProgramList from "../components/program/ProgramList";
import YearList from "../components/year/YearList";
import SectionList from "../components/section/SectionList";

const AdminManageDepartmentPage = () => {
  return (
    <div className="admin-manage-department">
      <h2>Manage Departments</h2>
      <DepartmentList />
      <ProgramList />
      <YearList />
      <SectionList />
    </div>
  );
};

export default AdminManageDepartmentPage;
