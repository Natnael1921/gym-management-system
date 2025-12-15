import User from "../models/user.model.js";
import Attendance from "../models/attendance.model.js";
import Request from "../models/trainerRequest.model.js";
import Schedule from "../models/schedule.model.js";

//GET member profile
export const getMyProfile = async (req, res) => {
  try {
    const member = await User.findById(req.user.id)
      .select("-password")
      .populate("trainerId", "name email");

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
};

//GET member attendance
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.user.id,
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
//GET trainer list
export const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select(
      "name phone coachingType"
    );
    res.json(trainers);
  } catch (err) {
    console.error("Get trainers error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
//SEND trainer request
export const requestTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;

    if (!trainerId) {
      return res.status(400).json({ error: "trainerId is required" });
    }

    // prevent duplicate pending requests
    const existing = await Request.findOne({
      memberId: req.user.id,
      trainerId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const request = await Request.create({
      memberId: req.user.id,
      trainerId,
      status: "pending",
    });

    res.status(201).json({
      message: "Trainer request sent",
      request,
    });
  } catch (err) {
    console.error("Request trainer error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
//GET member schedule
export const getMySchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({
      memberId: req.user.id,
    });

    res.json(schedule);
  } catch (err) {
    console.error("Get schedule error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//UPDATE member schedule
export const updateMySchedule = async (req, res) => {
  try {
    const { schedules } = req.body;

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ error: "Invalid schedule format" });
    }

    // remove old schedule
    await Schedule.deleteMany({ memberId: req.user.id });

    // insert new schedule
    const newSchedules = schedules.map(item => ({
      memberId: req.user.id,
      day: item.day,
      workout: item.workout,
    }));

    await Schedule.insertMany(newSchedules);

    res.json({ message: "Schedule updated successfully" });
  } catch (err) {
    console.error("Update schedule error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
