import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uriDb = process.env.DB_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(uriDb);
    console.log("Database connection successful");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
