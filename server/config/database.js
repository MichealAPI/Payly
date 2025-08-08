import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server is not available
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }

    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
  } catch (error) {
    throw error;
  }
};

export { connectDB };