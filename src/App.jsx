import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUser from './components/admin/AdminManageUser';
import DashboardLayout from './templates/DashboardLayout';
import AdminManageDepartmentPage from './pages/AdminManageDepartment';
import DeploymentMenuPage from './pages/DeploymentMenuPage';
import IrregularStudentAssignmentPage from './pages/IrregularStudentAssignmentPage';
import ManageStudentPage from './pages/ManageStudentPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentSideEvaluation from './pages/StudentSideEvaluation';
import FacultySideEvaluation from './pages/FacultySideEvaluation';
import DeanEvaluationList from './pages/DeanEvaluationList';
import DeanReports from './pages/DeanReports';
import EvaluationResults from './pages/EvaluationResults';
import DeanAcknowledgementList from './pages/DeanAcknowledgementList';
import AcknowledgeResultsPage from './pages/AcknowledgeResultPage';
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
        <Route path="/student-dashboard" element={<DashboardLayout><StudentDashboard/></DashboardLayout>} />
        <Route path="/student/evaluate/:assignmentId" element={<DashboardLayout><StudentSideEvaluation/></DashboardLayout>} />
        <Route path="/faculty/evaluate/:facultyID" element={<FacultySideEvaluation/>}/>
        <Route path="/dean/evaluation/list" element={<DeanEvaluationList/>}/>
        <Route path="/dean/reports" element={<DeanReports/>}/>
        <Route path="/evaluation/results/:facultyID" element={<EvaluationResults/>}/>
        <Route path="/dean/acknowledgement/list" element={<DeanAcknowledgementList/>}/>
        <Route path="/dean/acknowledge-result/:facultyID" element ={<AcknowledgeResultsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;