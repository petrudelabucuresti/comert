const { db } = require("../db");

// CONFIGURARE PREȚURI
const BASE_PRICES = {
  base: 100,
  perKg: 50,
};

const OPTIONS = {
  blaturi: {
    ciocolata: 20,
    vanilie: 15,
  },
  creme: {
    oreo: 25,
    mascarpone: 20,
  },
  decor: {
    fructe: 15,
    fondant: 30,
  },
};

// CALCUL PREȚ
const calculateCake = async (req, res, next) => {
  try {
    const { blat, crema, decor, weight } = req.body;

    if (!blat || !crema || !decor || !weight) {
      return res.status(400).json({
        success: false,
        message: "Missing configuration",
      });
    }

    let price = BASE_PRICES.base;

    price += OPTIONS.blaturi[blat] || 0;
    price += OPTIONS.creme[crema] || 0;
    price += OPTIONS.decor[decor] || 0;

    price += BASE_PRICES.perKg * weight;

    res.json({
      success: true,
      data: {
        configuration: { blat, crema, decor, weight },
        price,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ADD TO CART
const addCustomCakeToCart = async (req, res, next) => {
  try {
    const { sessionId, blat, crema, decor, weight, message } = req.body;

    let price = BASE_PRICES.base;
    price += OPTIONS.blaturi[blat] || 0;
    price += OPTIONS.creme[crema] || 0;
    price += OPTIONS.decor[decor] || 0;
    price += BASE_PRICES.perKg * weight;

    const cakeName = `Tort personalizat (${blat}, ${crema}, ${decor}, ${weight}kg)`;

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

    items.push({
      productId: `custom-${Date.now()}`,
      name: cakeName,
      price,
      quantity: 1,
      image: "https://dummyimage.com/300x300",
      custom: true,
      configuration: { blat, crema, decor, weight, message },
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cartRef.set({
      sessionId,
      items,
      subtotal,
      total: subtotal,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Custom cake added to cart",
      data: { items, total: subtotal },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateCake,
  addCustomCakeToCart,
};