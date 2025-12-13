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
