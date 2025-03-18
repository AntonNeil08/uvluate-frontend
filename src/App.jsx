import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUser from './components/admin/AdminManageUser';
import DashboardLayout from './templates/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="/admin/users" element={<DashboardLayout><AdminManageUser /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;