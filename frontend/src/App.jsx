import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', rollNumber: '' });
  const [logs, setLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UPDATE THIS TO YOUR CURRENT LIVE IP
  const API_URL = 'http://35.223.51.161:8081/api/attendance'; 

  // Fetching logs from the backend
  const fetchLogs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Combined function for Present and Absent actions
  const handleAction = async (status) => {
    if (!formData.name || !formData.rollNumber) {
      toast.warning("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      rollNumber: formData.rollNumber,
      status: status
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (status === 'Present') {
          toast.success(`Success: ${formData.name} marked Present`);
        } else {
          toast.error(`${formData.name} marked Absent`);
        }
        setFormData({ name: '', rollNumber: '' });
        fetchLogs(); // Refresh the list
      }
    } catch (error) {
      toast.error("Network error: Could not reach backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle "Editing" by deleting (Standard for simple portals)
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      toast.info("Log entry removed");
      fetchLogs();
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  // Chart Data calculation
  const chartData = [
    { name: 'Present', count: logs.filter(l => l.status === 'Present').length },
    { name: 'Absent', count: logs.filter(l => l.status === 'Absent').length }
  ];

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      <header className="dashboard-header">
        <div className="header-content">
          <h1>SPIT Attendance Portal</h1>
          <span className="status-badge live">System Active</span>
        </div>
      </header>

      <main className="dashboard-grid">
        <div className="grid-column">
          <div className="card action-card">
            <h2>Mark Attendance</h2>
            <form>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Student Name"
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
                  placeholder="Roll No."
                  required 
                />
              </div>
              
              <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  disabled={isSubmitting} 
                  onClick={() => handleAction('Present')}
                  className="submit-btn"
                  style={{ backgroundColor: '#6366f1' }}
                >
                  {isSubmitting ? '...' : 'PRESENT'}
                </button>
                <button 
                  type="button" 
                  disabled={isSubmitting} 
                  onClick={() => handleAction('Absent')}
                  className="submit-btn"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {isSubmitting ? '...' : 'ABSENT'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid-column">
          <div className="card chart-card">
            <h2>Live Statistics</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <rect key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card table-card">
            <h2>Recent Logs</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 5).map((log) => (
                    <tr key={log._id}>
                      <td className="fw-500">{log.name}</td>
                      <td>
                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(log._id)} 
                          style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </td>
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