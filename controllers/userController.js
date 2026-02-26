const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");

exports.registerUser = async (req, res) => {
  const { fname, lname, email, number, password, state, city, street, zipcode } = req.body;

  // Basic validation
  if (!fname || !lname || !email || !number || !password || !state || !city || !street || !zipcode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user via model (Promise-based)
    const userId = await User.create({
      fname,
      lname,
      email,
      number,
      password: hashedPassword,
      state,
      city,
      street,
      zipcode
    });

    res.status(201).json({
      message: "User registered successfully",
      userId
    });
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({
      message: err.sqlMessage || "Database error",
      error: err
    });
  }
};

