const { db } = require("../db");

const isAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;