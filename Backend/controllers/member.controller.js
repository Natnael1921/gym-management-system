import User from "../models/user.model.js";

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