const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint (Crucial for DevOps monitoring!)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running correctly' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});