import User from "../models/user.model.js";
import Attendance from "../models/attendance.model.js";

//get trainer dashboard
export const getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const traineesCount = await User.countDocuments({
      role: "member",
      trainerId,
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const attendanceCount = await Attendance.countDocuments({
      userId: trainerId,
      present: true,
      date: { $gte: startOfMonth },
    });

    res.json({
      trainerId,
      traineesCount,
      monthlyAttendance: attendanceCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

//get trainees info
export const getTrainerTrainees = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const trainees = await User.find({
      role: "member",
      trainerId,
    }).select("name phone membershipValidUntil");

    res.json(trainees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trainees" });
  }
};
