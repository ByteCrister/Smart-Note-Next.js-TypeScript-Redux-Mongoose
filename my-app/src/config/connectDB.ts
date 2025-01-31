import mongoose from 'mongoose';

let isConnected: boolean = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Database already connected');
    return;
  }

  try {
    const FULL_URI = process.env.MONGODB_URI + '/smart-note-1-1?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Full URI:', FULL_URI);

    const db = await mongoose.connect(FULL_URI);
    isConnected = db.connections[0].readyState === 1;

    console.log('Connected to database:', db.connections[0].name);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
};

export default connectDB;
