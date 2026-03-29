const { db } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { createUser } = require("../models/User");

// REGISTER
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = createUser({
      name,
      email,
      passwordHash,
    });

    const userRef = db.collection("users").doc();
    await userRef.set(userData);

    const token = jwt.sign(
      { id: userRef.id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

res.status(201).json({
  success: true,
  token,
  data: {
    id: userRef.id,
    name,
    email,
    role: "user",
  },
});
  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: userDoc.id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

res.json({
  success: true,
  token,
  data: {
    id: userDoc.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  },
});
  } catch (error) {
    next(error);
  }
};

// GET ME
const getMe = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

res.json({
  success: true,
  data: {
    id: userDoc.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  },
});
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };