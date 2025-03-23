const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Improve database connection with retry mechanism
const initializeDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await connectDB();
      console.log('Database connection established successfully');
      break;
    } catch (error) {
      console.error('Database connection error:', error.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.log('Unable to connect to the database after multiple attempts');
        // Don't crash the server, continue with reduced functionality
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Initialize DB connection
initializeDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname));

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
