// controllers/logoutController.js
exports.logoutUser = (req, res) => {
 
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    
    });
    res.json({ message: "Logged out successfully" });
  };
  