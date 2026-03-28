const { db } = require("../db");

// helper
const calculateTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    subtotal,
    total: subtotal,
  };
};

// GET CART
const getCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const snapshot = await db
      .collection("carts")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        data: { items: [], total: 0 },
      });
    }

    const cart = snapshot.docs[0];

    res.json({
      success: true,
      data: {
        id: cart.id,
        ...cart.data(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ADD TO CART
const addToCart = async (req, res, next) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    // ia produsul real
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productDoc.data();

    // caută cart
    const snapshot = await db
      .collection("carts")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    let items = [];

    let cartRef;

    if (snapshot.empty) {
      cartRef = db.collection("carts").doc();
    } else {
      cartRef = db.collection("carts").doc(snapshot.docs[0].id);
      items = snapshot.docs[0].data().items;
    }

    const existingItem = items.find((i) => i.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || "",
      });
    }

    const totals = calculateTotals(items);

    await cartRef.set({
      sessionId,
      items,
      ...totals,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Product added to cart",
      data: { items, ...totals },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE ITEM
const updateCart = async (req, res, next) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    const snapshot = await db
      .collection("carts")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartDoc = snapshot.docs[0];
    const cartRef = db.collection("carts").doc(cartDoc.id);

    let items = cartDoc.data().items;

    items = items.map((item) =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    const totals = calculateTotals(items);

    await cartRef.update({
      items,
      ...totals,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Cart updated",
      data: { items, ...totals },
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE ITEM
const removeFromCart = async (req, res, next) => {
  try {
    const { sessionId, productId } = req.body;

    const snapshot = await db
      .collection("carts")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartDoc = snapshot.docs[0];
    const cartRef = db.collection("carts").doc(cartDoc.id);

    let items = cartDoc.data().items;

    items = items.filter((item) => item.productId !== productId);

    const totals = calculateTotals(items);

    await cartRef.update({
      items,
      ...totals,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Item removed",
      data: { items, ...totals },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};