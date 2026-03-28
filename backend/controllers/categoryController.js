const { db } = require("../db");

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const snapshot = await db.collection("categories").get();

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };