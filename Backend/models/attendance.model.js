import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  present: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
