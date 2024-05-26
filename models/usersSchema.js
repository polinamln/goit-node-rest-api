import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatarURL: String,
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false }
);

export default mongoose.model("User", usersSchema);
