import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const createToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );
};

//register endpoint
export const register = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Only admin can register new users" });
      }
    }

    const {
      name,
      email,
      password,
      role = "member",
      phone,
      membershipValidUntil,
      trainerId,
      coachingType,
      height,
      weight,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    if (!["admin", "trainer", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      phone,
      membershipValidUntil: membershipValidUntil || null,
      trainerId: trainerId || null,
      coachingType: coachingType || "",
      height: height || null,
      weight: weight || null,
    });

    await newUser.save();

    const token = createToken(newUser);

    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user);

    return res.json({
      token,
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
