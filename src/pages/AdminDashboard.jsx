const AdminDashboard = () => {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p>Welcome to the Admin Panel. Use the navigation to manage users, departments, subjects, and reports.</p>
  
        {/* Example Widgets (Can be replaced with real data later) */}
        <div className="dashboard-widgets">
          <div className="widget-card">
            <h2>📊 Total Users</h2>
            <p>1,024</p>
          </div>
          <div className="widget-card">
            <h2>🏢 Total Departments</h2>
            <p>12</p>
          </div>
          <div className="widget-card">
            <h2>📚 Total Subjects</h2>
            <p>150</p>
          </div>
          <div className="widget-card">
            <h2>📈 Reports Generated</h2>
            <p>328</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
  