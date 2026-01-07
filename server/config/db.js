const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error(
      'Error: MONGODB_URI environment variable is not set. Please configure your MongoDB connection string.'
    );
    // Exit process with failure if configuration is invalid
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
