import React, { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');

  // Fetch students from Backend
  const fetchStudents = () => {
    fetch('http://' + window.location.hostname + ':5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://' + window.location.hostname + ':5000/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rollNumber: roll, status: 'Present' }),
    }).then(() => {
      setName(''); setRoll(''); fetchStudents();
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Enterprise Attendance System</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Student Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Roll Number" value={roll} onChange={e => setRoll(e.target.value)} />
        <button type="submit">Mark Present</button>
      </form>
      <h2>Attendance List</h2>
      <ul>
        {students.map((s, i) => (
          <li key={i}>{s.name} ({s.rollNumber}) - <b>{s.status}</b></li>
        ))}
      </ul>
    </div>
  );
}

export default App;