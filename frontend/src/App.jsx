import React, { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');

  const fetchStudents = () => {
    fetch('http://' + window.location.hostname + ':5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error fetching:", err));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !roll) return alert("Please fill all fields");

    fetch('http://' + window.location.hostname + ':5000/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rollNumber: roll, status: 'Present' }),
    }).then(() => {
      setName(''); setRoll(''); fetchStudents();
    });
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2>Attendance Management Portal</h2>
        <span style={styles.badge}>Cloud Deployed</span>
      </nav>

      <div style={styles.main}>
        <div style={styles.card}>
          <h3>Mark New Attendance</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Roll Number"
              value={roll}
              onChange={e => setRoll(e.target.value)}
            />
            <button type="submit" style={styles.button}>Mark Present</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Attendance Logs</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} style={styles.tableRow}>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td><span style={styles.statusLabel}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  navbar: { backgroundColor: '#2c3e50', color: 'white', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#27ae60', padding: '5px 10px', borderRadius: '20px', fontSize: '12px' },
  main: { padding: '40px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  tableHeader: { borderBottom: '2px solid #eee', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee', height: '45px' },
  statusLabel: { color: '#27ae60', fontWeight: 'bold' }
};

export default App;