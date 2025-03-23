import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUser from './components/admin/AdminManageUser';
import DashboardLayout from './templates/DashboardLayout';
import AdminManageDepartmentPage from './pages/AdminManageDepartment';
import DeploymentMenuPage from './pages/DeploymentMenuPage';
import IrregularStudentAssignmentPage from './pages/IrregularStudentAssignmentPage';
import ManageStudentPage from './pages/ManageStudentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/admin/users" element={<DashboardLayout><AdminManageUser /></DashboardLayout>} />
        <Route path="/admin/departments" element={<DashboardLayout><AdminManageDepartmentPage /></DashboardLayout>} />
        <Route path="/deployment/section/:sectionId" element={<DeploymentMenuPage/>} />
        <Route path="/deployment/irregular/:sectionId" element={<IrregularStudentAssignmentPage />} />
        <Route path="/deployment/manage-student/:studentID" element={<ManageStudentPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;