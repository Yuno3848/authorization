import mongoose, { isValidObjectId } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerify: {
      type: String,
      default: false,
    },
    VerficationToken: String,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
