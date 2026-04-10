const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginModel = require("../models/loginModel.js");

exports.loginUser = async (req, res) => {
  const { number, password } = req.body;

  if (!number || !password) {
    return res
      .status(400)
      .json({ message: "number and password are required" });
  }

  try {
    // Fetch user from DB
    const user = await loginModel.fetchUser(number);

    if (!user) {
      return res.status(401).json({ message: "Invalid number or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid number or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      // expiresIn: "1h",
    });

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",

      // maxAge: 60 * 60 * 1000,
    });

    // Return safe user info (exclude password)
    const { password: pwd, ...safeUser } = user;
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

exports.retrieveUser = async (req, res) => {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ message: "number is required" });
  }

  try {
    // Fetch user from DB
    const user = await loginModel.fetchUser(number);

    if (!user) {
      return res.status(401).json({ message: "Invalid number" });
    }

    // Return safe user info (exclude password)

    res.status(200).json({ message: "number fetched successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

exports.changeUserPasswordController = async (req, res) => {
  const { password, id } = req.body;
 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await loginModel.changePassword(id, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while updating the password",
      error: err.message,
    });
  }
};
