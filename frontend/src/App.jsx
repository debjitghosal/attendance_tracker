import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', rollNumber: '' });
  const [logs, setLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Adjust this URL if your backend uses a different endpoint
  const API_URL = 'http://35.223.51.161:8081'; 

  // Fetch initial data (Placeholder fetch - replace with your actual fetch logic)
  useEffect(() => {
    // Example: fetch(API_URL).then(res => res.json()).then(data => setLogs(data));
    // For now, loading some initial state so the dashboard doesn't look empty
    setLogs([
      { _id: '1', name: 'debo', rollNumber: '12', status: 'Present' },
      { _id: '2', name: 'heeru', rollNumber: '13', status: 'Present' }
    ]);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call - Replace with your actual POST request
    setTimeout(() => {
      const newLog = { 
        _id: Date.now().toString(), 
        name: formData.name, 
        rollNumber: formData.rollNumber, 
        status: 'Present' 
      };
      
      setLogs([newLog, ...logs]);
      toast.success(`Attendance recorded for ${formData.name}!`);
      setFormData({ name: '', rollNumber: '' });
      setIsSubmitting(false);
    }, 800);
  };

  // Prepare data for the chart
  const chartData = [
    { name: 'Total Present', count: logs.length },
    { name: 'Total Absent', count: 0 } // Assuming all logged are present for this demo
  ];

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>RC SPIT Attendance Portal</h1>
          <span className="status-badge live">System Live</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="dashboard-grid">
        
        {/* Left Column: Action Card */}
        <div className="grid-column">
          <div className="card action-card">
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Jane Doe"
                  required 
                />
              </div>
              <div className="input-group">
                <label>Roll Number</label>
                <input 
                  type="text" 
                  name="rollNumber"
                  value={formData.rollNumber} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 42"
                  required 
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Recording...' : 'MARK PRESENT'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Data Cards */}
        <div className="grid-column">
          
          {/* Chart Card */}
          <div className="card chart-card">
            <h2>Live Statistics</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Card */}
          <div className="card table-card">
            <h2>Recent Logs</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="fw-500">{log.name}</td>
                      <td>{log.rollNumber}</td>
                      <td><span className="status-badge present">{log.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;