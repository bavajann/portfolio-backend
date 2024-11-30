const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator'); // For additional input validation
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'  // Allow only requests from localhost:3000
}));
  // Allows cross-origin requests
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  // Exit the process if connection fails
  });

// Import Model
const Message = require('./models/Message');

// API endpoint to handle form submissions
app.post('/submit-form', async (req, res) => {
  const { name, email, message, contactNumber } = req.body;

  // Validate input
  if (!name || !email || !message || !contactNumber) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Additional validation for email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    // Save to database
    const newMessage = new Message({ name, email, message, contactNumber });
    await newMessage.save();

    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
