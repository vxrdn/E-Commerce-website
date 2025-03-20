const { Sequelize } = require('sequelize');

// Get database connection string from environment variables
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/kickskart';

// Create Sequelize instance
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models with database (create tables if they don't exist)
    // In production, you might want to use migrations instead
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
