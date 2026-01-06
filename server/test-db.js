require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then((conn) => {
    console.log('✅ MongoDB Connected!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Connection Failed:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check if cluster is active in MongoDB Atlas');
    console.log('2. Verify Network Access allows 0.0.0.0/0');
    console.log('3. Get a fresh connection string from Atlas');
    console.log('4. Check if your internet connection is working');
    process.exit(1);
  });
