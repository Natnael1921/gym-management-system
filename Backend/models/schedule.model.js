import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: String, enum: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"], required: true },
  workout: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);