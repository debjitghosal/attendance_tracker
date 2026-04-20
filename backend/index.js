const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,
    status: { type: String, default: 'Absent' }
});

const Student = mongoose.model('Student', studentSchema);

// API Routes
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/api/attendance', async (req, res) => {
    const { name, rollNumber, status } = req.body;
    const student = new Student({ name, rollNumber, status });
    await student.save();
    res.status(201).send(student);
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));