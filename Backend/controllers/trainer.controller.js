import User from "../models/user.model.js";
import Attendance from "../models/attendance.model.js";
import Request from "../models/trainerRequest.model.js";

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

//GET trainer requests
export const getTrainerRequests = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const requests = await Request.find({
      trainerId,
      status: "pending",
    }).populate("memberId", "name phone");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch requests" });
  }
};

//APPROVE request
export const approveRequest = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const requestId = req.params.id;
    const request = await Request.findOne({
      _id: requestId,
      trainerId,
      status: "pending",
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    // assign trainer to member
    await User.findByIdAndUpdate(request.memberId, {
      trainerId,
    });

    request.status = "approved";
    await request.save();

    res.json({ message: "Request approved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve request" });
  }
};

//REJECT request
export const rejectRequest = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const requestId = req.params.id;
    const request = await Request.findOne({
      _id: requestId,
      trainerId,
      status: "pending",
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    request.status = "rejected";
    await request.save();
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request" });
  }
};

//GET weekly trainer attendance
export const getTrainerWeeklyAttendance = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ error: "startDate is required" });
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const attendance = await Attendance.find({
      userId: trainerId,
      date: { $gte: start, $lt: end },
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly attendance" });
  }
};

//GET monthly trainer attendance
export const getTrainerMonthlyAttendance = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalDays = await Attendance.countDocuments({
      userId: trainerId,
      date: { $gte: startOfMonth },
    });

    const presentDays = await Attendance.countDocuments({
      userId: trainerId,
      present: true,
      date: { $gte: startOfMonth },
    });

    res.json({
      totalDays,
      presentDays,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly attendance" });
  }
};