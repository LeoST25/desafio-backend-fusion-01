import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://localhost:27017@cluster0.mongodb.net/space_database?retryWrites=true&w=majority');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
