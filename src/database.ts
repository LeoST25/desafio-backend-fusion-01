import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/space_database');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
