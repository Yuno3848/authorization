import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
  } catch (error) {
    console.log("failed to connect database :", error);
  }
};
export default db;