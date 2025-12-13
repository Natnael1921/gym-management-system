import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/*GET all members*/
export const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-password");
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

/*ADD new member*/
export const addMember = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      membershipValidUntil,
      trainerId,
      height,
      weight,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "member",
      phone,
      membershipValidUntil,
      trainerId,
      height,
      weight,
    });

    res.status(201).json({
      message: "Member added successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add member" });
  }
};

/*EDIT member*/
export const editMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    const updated = await User.findByIdAndUpdate(
      memberId,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({
      message: "Member updated successfully",
      member: updated,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update member" });
  }
};
/*GET all Trainers*/
export const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
};

/*ADD new trainer*/
export const createTrainer = async (req, res) => {
  try {
    const { name, email, password, coachingType, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const trainer = await User.create({
      name,
      email,
      password: hashed,
      role: "trainer",
      coachingType,
      phone,
    });

    res.status(201).json(trainer);
  } catch (err) {
    res.status(500).json({ error: "Failed to create trainer" });
  }
};
/*EDIT trainer*/
export const updateTrainer = async (req, res) => {
  try {
    const trainer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "trainer" },
      req.body,
      { new: true }
    ).select("-password");

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: "Failed to update trainer" });
  }
};
