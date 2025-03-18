import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUser from './components/admin/AdminManageUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/users" element={<AdminManageUser />} />
      </Routes>
    </Router>
  );
}

export default App;