const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js"); // adjust path to your user model

exports.getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB using decoded.id
    const user = await User.findById(decoded.id); // exclude sensitive fields
   
    if (!user) return res.status(404).json({ message: "User not found" });
    const {password , ...safeUser} = user;
    res.json({ safeUser });
  } catch (e) {
    console.error("JWT error:", e.message || e);
    res.status(401).json({ message: "Invalid token" });
  }
};
