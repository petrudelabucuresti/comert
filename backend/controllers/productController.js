const { db } = require("../db");

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    let query = db.collection("products");

    const {
      category,
      search,
      minPrice,
      maxPrice,
      flavor,
      dietary,
      occasion,
      excludeAllergen,
    } = req.query;

    // Filtre Firestore
    if (category) {
      query = query.where("category", "==", category);
    }

    if (minPrice) {
      query = query.where("price", ">=", Number(minPrice));
    }

    if (maxPrice) {
      query = query.where("price", "<=", Number(maxPrice));
    }

    if (flavor) {
      query = query.where("flavors", "array-contains", flavor);
    }

    if (dietary) {
      query = query.where("dietary", "array-contains", dietary);
    }

    if (occasion) {
      query = query.where("occasion", "array-contains", occasion);
    }

    const snapshot = await query.get();

    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtru search (client-side)
    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Exclude allergen (client-side)
    if (excludeAllergen) {
      products = products.filter(
        (p) => !p.allergens?.includes(excludeAllergen)
      );
    }

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
};