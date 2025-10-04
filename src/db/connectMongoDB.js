// src/db/connectMongoDB.js
import mongoose from 'mongoose';

export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
}
