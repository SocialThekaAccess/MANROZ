import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS for MongoDB SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Server will continue running but DB operations will fail.');
  }
};

export default connectDB;
