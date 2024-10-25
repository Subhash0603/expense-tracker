const express = require('express'); // Import Express
const mongoose = require('mongoose'); // Import Mongoose for MongoDB
const cors = require('cors'); // Import CORS to handle cross-origin requests
require('dotenv').config(); // Load environment variables from a .env file

const app = express(); // Initialize the Express app

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error('Failed to connect to MongoDB:', err));

// Import routes
const expenseRoutes = require('./routes/expenses'); // Import your expenses routes

// Use routes
app.use('/api/expenses', expenseRoutes); // Mount routes at /api/expenses

// Start the server
const PORT = process.env.PORT || 5000; // Define the port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
