import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  password: { type: String, required: true },

  role: { type: String, enum: ["admin", "trainer", "member"], required: true },

  phone: { type: String, default: "" },

  // only for members
  membershipValidUntil: { type: Date, default: null },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },

  // only for trainers
  coachingType: { type: String, default: "" },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
