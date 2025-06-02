import mongoose from 'mongoose';

const MONGODB_URI =
  'mongodb+srv://AfnanShawawreh:AfnanShawawreh@cluster0.dyuxwu3.mongodb.net/' +
  '?retryWrites=true' +
  '&w=majority' +
  '&appName=Cluster0' +
  '&serverSelectionTimeoutMS=60000' +
  '&connectTimeoutMS=60000' +
  '&socketTimeoutMS=60000';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
    console.log('Current IP:', '5.45.133.62');

    // Set mongoose debug mode
    mongoose.set('debug', true);

    // Set a longer timeout for the initial connection attempt
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 60 seconds')), 60000),
    );

    console.log('Attempting to connect...');
    const connectPromise = mongoose.connect(MONGODB_URI, {
      dbName: 'chatApp', // Specify database name in options instead of URI
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 60000,
      heartbeatFrequencyMS: 10000,
    });

    await Promise.race([connectPromise, timeoutPromise]);

    console.log('Successfully connected to MongoDB!');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);

    // Wait a moment to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (mongoose.connection.readyState === 1) {
      console.log('Connection is stable and ready');
    } else {
      console.log('Connection state changed:', mongoose.connection.readyState);
    }

    await mongoose.connection.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Connection error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Additional error information for MongoDB specific errors
      if (error.name === 'MongoServerSelectionError') {
        console.error('MongoDB Server Selection Error - This usually means:');
        console.error('1. The cluster is not accessible from your IP address');
        console.error('2. The cluster is not running');
        console.error('3. Network connectivity issues');
      } else if (error.name === 'MongoNetworkError') {
        console.error('MongoDB Network Error - This usually means:');
        console.error('1. DNS resolution issues');
        console.error('2. Firewall blocking the connection');
        console.error('3. Network connectivity problems');
      }
    }
  } finally {
    process.exit(0);
  }
}

testConnection();
