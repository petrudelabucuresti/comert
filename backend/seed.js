const bcrypt = require("bcryptjs");
const { db } = require("./db");

const { createUser } = require("./models/User");
const { createCategory } = require("./models/Category");
const { createProduct } = require("./models/Product");
const { createCart } = require("./models/Cart");
const { createOrder } = require("./models/Order");

const now = () => new Date().toISOString();

// imagini mai apropiate de produse
const IMAGE_MAP = {
  redVelvet: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20velvet%20cake.jpg",
  ],

  ciocolataDeluxe: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate_cake.jpg",
  ],

  unicorn: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Birthday_cake.jpg",
  ],

  spiderman: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Birthday_cake-01.jpg",
  ],

  nuntaElegant: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Wedding_Cake.jpg",
  ],

  nuntaLuxury: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Wedding_Cake_%287712258102%29.jpg",
  ],

  veganBerry: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vegan_berry_cake_%283076407397%29.jpg",
  ],

  faraZahar: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Berry_cake%2C_Mainz.jpg",
  ],

  glutenFree: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate_cake_home_made.jpg",
  ],

  miniTiramisu: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tiramisu_dessert.jpg",
  ],

  miniFructe: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Berry_Cake_with_macaron_on_top.jpg",
  ],

  cupcakeSet: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cupcakes%21.jpg",
  ],

  customCake: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Angel_food_cake_with_berries_-_Birthday_cake.jpg",
  ],
};

const clearCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`Collection "${collectionName}" already empty`);
    return;
  }

  const batchSize = 400;
  let docs = snapshot.docs;

  while (docs.length) {
    const batch = db.batch();
    docs.slice(0, batchSize).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    docs = docs.slice(batchSize);
  }

  console.log(`Cleared collection: ${collectionName}`);
};

const clearDatabase = async () => {
  // ordinea contează
  await clearCollection("orders");
  await clearCollection("carts");
  await clearCollection("products");
  await clearCollection("categories");
  await clearCollection("users");
};

const seedData = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // șterge tot
    await clearDatabase();

    // =========================================================
    // USERS
    // =========================================================
    console.log("Seeding users...");

    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const userPasswordHash = await bcrypt.hash("user1234", 10);

    const users = [
      {
        key: "admin",
        data: createUser({
          name: "Admin Cake Shop",
          email: "admin@cakeshop.ro",
          passwordHash: adminPasswordHash,
          role: "admin",
        }),
      },
      {
        key: "user1",
        data: createUser({
          name: "Maria Popescu",
          email: "maria@example.com",
          passwordHash: userPasswordHash,
          role: "user",
        }),
      },
      {
        key: "user2",
        data: createUser({
          name: "Andrei Ionescu",
          email: "andrei@example.com",
          passwordHash: userPasswordHash,
          role: "user",
        }),
      },
    ];

    const userMap = {};

    for (const user of users) {
      const ref = db.collection("users").doc();
      await ref.set(user.data);
      userMap[user.key] = {
        id: ref.id,
        ...user.data,
      };
    }

    console.log("✅ Users added");

    // =========================================================
    // CATEGORIES
    // =========================================================
    console.log("Seeding categories...");

    const categories = [
      {
        name: "Torturi aniversare",
        slug: "torturi-aniversare",
        description: "Torturi elegante pentru aniversări și petreceri.",
      },
      {
        name: "Torturi copii",
        slug: "torturi-copii",
        description: "Torturi colorate și tematice pentru cei mici.",
      },
      {
        name: "Torturi nuntă",
        slug: "torturi-nunta",
        description: "Torturi premium pentru nunți și evenimente speciale.",
      },
      {
        name: "Torturi dietetice",
        slug: "torturi-dietetice",
        description: "Torturi fără zahăr, vegane sau fără gluten.",
      },
      {
        name: "Monoporții",
        slug: "monoportii",
        description: "Deserturi individuale rafinate.",
      },
      {
        name: "Candy bar",
        slug: "candy-bar",
        description: "Prăjituri și deserturi pentru evenimente.",
      },
    ];

    const categoryMap = {};

    for (const category of categories) {
      const ref = db.collection("categories").doc();
      const data = createCategory(category);

      await ref.set(data);

      categoryMap[category.slug] = {
        id: ref.id,
        ...data,
      };
    }

    console.log("✅ Categories added");

    // =========================================================
    // PRODUCTS
    // =========================================================
    console.log("Seeding products...");

    const products = [
      {
        key: "redVelvet",
        data: createProduct({
          name: "Tort Red Velvet",
          slug: "tort-red-velvet",
          description:
            "Tort clasic Red Velvet cu cremă fină de brânză și decor elegant.",
          price: 150,
          images: IMAGE_MAP.redVelvet,
          category: "torturi-aniversare",
          flavors: ["red_velvet"],
          dietary: [],
          allergens: ["gluten", "lactate", "oua"],
          occasion: ["aniversare"],
          weight: "1.2kg",
          isAvailable: true,
          stock: 12,
        }),
      },
      {
        key: "ciocolataDeluxe",
        data: createProduct({
          name: "Tort Ciocolată Deluxe",
          slug: "tort-ciocolata-deluxe",
          description:
            "Tort intens de ciocolată cu cremă belgiană și decor premium.",
          price: 180,
          images: IMAGE_MAP.ciocolataDeluxe,
          category: "torturi-aniversare",
          flavors: ["ciocolata"],
          dietary: [],
          allergens: ["lactate", "oua"],
          occasion: ["aniversare"],
          weight: "1.4kg",
          isAvailable: true,
          stock: 10,
        }),
      },
      {
        key: "unicorn",
        data: createProduct({
          name: "Tort Unicorn",
          slug: "tort-unicorn",
          description:
            "Tort pentru copii, decorat colorat, perfect pentru aniversări.",
          price: 200,
          images: IMAGE_MAP.unicorn,
          category: "torturi-copii",
          flavors: ["vanilie"],
          dietary: [],
          allergens: ["gluten", "lactate", "oua"],
          occasion: ["copii"],
          weight: "1.5kg",
          isAvailable: true,
          stock: 7,
        }),
      },
      {
        key: "spiderman",
        data: createProduct({
          name: "Tort Spiderman",
          slug: "tort-spiderman",
          description:
            "Tort tematic pentru copii cu decor inspirat de supereroi.",
          price: 220,
          images: IMAGE_MAP.spiderman,
          category: "torturi-copii",
          flavors: ["ciocolata"],
          dietary: [],
          allergens: ["gluten", "lactate"],
          occasion: ["copii"],
          weight: "1.6kg",
          isAvailable: true,
          stock: 6,
        }),
      },
      {
        key: "nuntaElegant",
        data: createProduct({
          name: "Tort Nuntă Elegant",
          slug: "tort-nunta-elegant",
          description:
            "Tort sofisticat pe etaje, ideal pentru evenimente elegante.",
          price: 500,
          images: IMAGE_MAP.nuntaElegant,
          category: "torturi-nunta",
          flavors: ["fructe", "vanilie"],
          dietary: [],
          allergens: ["lactate", "oua"],
          occasion: ["nunta"],
          weight: "3kg",
          isAvailable: true,
          stock: 3,
        }),
      },
      {
        key: "nuntaLuxury",
        data: createProduct({
          name: "Tort Nuntă Luxury",
          slug: "tort-nunta-luxury",
          description:
            "Tort de nuntă premium cu decor floral și finisaj modern.",
          price: 750,
          images: IMAGE_MAP.nuntaLuxury,
          category: "torturi-nunta",
          flavors: ["fistic", "zmeura"],
          dietary: [],
          allergens: ["lactate", "nuci", "oua"],
          occasion: ["nunta"],
          weight: "4kg",
          isAvailable: true,
          stock: 2,
        }),
      },
      {
        key: "veganBerry",
        data: createProduct({
          name: "Tort Vegan Berry",
          slug: "tort-vegan-berry",
          description:
            "Tort vegan cu fructe de pădure, fără lactate și fără ouă.",
          price: 170,
          images: IMAGE_MAP.veganBerry,
          category: "torturi-dietetice",
          flavors: ["fructe"],
          dietary: ["vegan"],
          allergens: [],
          occasion: ["aniversare"],
          weight: "1.2kg",
          isAvailable: true,
          stock: 8,
        }),
      },
      {
        key: "faraZahar",
        data: createProduct({
          name: "Tort Fără Zahăr",
          slug: "tort-fara-zahar",
          description:
            "Tort dietetic îndulcit alternativ, potrivit pentru regimuri speciale.",
          price: 165,
          images: IMAGE_MAP.faraZahar,
          category: "torturi-dietetice",
          flavors: ["vanilie"],
          dietary: ["sugar_free"],
          allergens: ["lactate", "oua"],
          occasion: ["aniversare"],
          weight: "1.1kg",
          isAvailable: true,
          stock: 9,
        }),
      },
      {
        key: "glutenFree",
        data: createProduct({
          name: "Tort Gluten Free Chocolate",
          slug: "tort-gluten-free-chocolate",
          description:
            "Tort fără gluten cu mousse de ciocolată și fructe proaspete.",
          price: 190,
          images: IMAGE_MAP.glutenFree,
          category: "torturi-dietetice",
          flavors: ["ciocolata"],
          dietary: ["gluten_free"],
          allergens: ["lactate", "oua"],
          occasion: ["aniversare"],
          weight: "1.3kg",
          isAvailable: true,
          stock: 5,
        }),
      },
      {
        key: "miniTiramisu",
        data: createProduct({
          name: "Monoporie Tiramisu",
          slug: "monoporie-tiramisu",
          description: "Desert individual cu mascarpone și cafea.",
          price: 25,
          images: IMAGE_MAP.miniTiramisu,
          category: "monoportii",
          flavors: ["tiramisu", "cafea"],
          dietary: [],
          allergens: ["gluten", "lactate", "oua"],
          occasion: ["eveniment"],
          weight: "150g",
          isAvailable: true,
          stock: 30,
        }),
      },
      {
        key: "miniFructe",
        data: createProduct({
          name: "Monoporie Fructe de Pădure",
          slug: "monoporie-fructe-de-padure",
          description: "Desert individual fresh cu mousse și fructe de pădure.",
          price: 27,
          images: IMAGE_MAP.miniFructe,
          category: "monoportii",
          flavors: ["fructe"],
          dietary: [],
          allergens: ["lactate"],
          occasion: ["eveniment"],
          weight: "160g",
          isAvailable: true,
          stock: 25,
        }),
      },
      {
        key: "cupcakeSet",
        data: createProduct({
          name: "Set Cupcakes Premium",
          slug: "set-cupcakes-premium",
          description: "Set de cupcakes premium pentru candy bar.",
          price: 120,
          images: IMAGE_MAP.cupcakeSet,
          category: "candy-bar",
          flavors: ["vanilie", "ciocolata"],
          dietary: [],
          allergens: ["gluten", "lactate", "oua"],
          occasion: ["eveniment", "nunta"],
          weight: "12 buc",
          isAvailable: true,
          stock: 15,
        }),
      },
    ];

    const productMap = {};

    for (const product of products) {
      const ref = db.collection("products").doc();
      await ref.set(product.data);

      productMap[product.key] = {
        id: ref.id,
        ...product.data,
      };
    }

    console.log("✅ Products added");

    // =========================================================
    // CARTS
    // =========================================================
    console.log("Seeding carts...");

    const guestSessionId = "sess_guest_001";
    const mariaSessionId = "sess_maria_001";

    const cart1Items = [
      {
        productId: productMap.redVelvet.id,
        name: productMap.redVelvet.name,
        price: productMap.redVelvet.price,
        quantity: 1,
        image: productMap.redVelvet.images[0],
      },
      {
        productId: productMap.miniTiramisu.id,
        name: productMap.miniTiramisu.name,
        price: productMap.miniTiramisu.price,
        quantity: 4,
        image: productMap.miniTiramisu.images[0],
      },
    ];

    const cart1Subtotal = cart1Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const cart2Items = [
      {
        productId: productMap.unicorn.id,
        name: productMap.unicorn.name,
        price: productMap.unicorn.price,
        quantity: 1,
        image: productMap.unicorn.images[0],
      },
      {
        productId: `custom-${Date.now()}`,
        name: "Tort personalizat (ciocolata, oreo, fondant, 2kg)",
        price: 255,
        quantity: 1,
        image: IMAGE_MAP.customCake[0],
        custom: true,
        configuration: {
          blat: "ciocolata",
          crema: "oreo",
          decor: "fondant",
          weight: 2,
          message: "La mulți ani, Matei!",
        },
      },
    ];

    const cart2Subtotal = cart2Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const carts = [
      createCart({
        sessionId: guestSessionId,
        items: cart1Items,
        subtotal: cart1Subtotal,
        total: cart1Subtotal,
      }),
      createCart({
        sessionId: mariaSessionId,
        items: cart2Items,
        subtotal: cart2Subtotal,
        total: cart2Subtotal,
      }),
    ];

    for (const cart of carts) {
      const ref = db.collection("carts").doc();
      await ref.set(cart);
    }

    console.log("✅ Carts added");

    // =========================================================
    // ORDERS
    // =========================================================
    console.log("Seeding orders...");

    const order1Items = [
      {
        productId: productMap.ciocolataDeluxe.id,
        name: productMap.ciocolataDeluxe.name,
        price: productMap.ciocolataDeluxe.price,
        quantity: 1,
        image: productMap.ciocolataDeluxe.images[0],
      },
      {
        productId: productMap.cupcakeSet.id,
        name: productMap.cupcakeSet.name,
        price: productMap.cupcakeSet.price,
        quantity: 1,
        image: productMap.cupcakeSet.images[0],
      },
    ];

    const order1Subtotal = order1Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order1DeliveryFee = order1Subtotal >= 200 ? 0 : 20;
    const order1Total = order1Subtotal + order1DeliveryFee;

    const order1 = createOrder({
      userId: userMap.user1.id,
      customer: {
        name: "Maria Popescu",
        email: "maria@example.com",
        phone: "0712345678",
        address: "Str. Lalelelor 10, București",
      },
      items: order1Items,
      subtotal: order1Subtotal,
      deliveryFee: order1DeliveryFee,
      total: order1Total,
      paymentMethod: "card",
    });

    order1.paymentStatus = "paid";
    order1.orderStatus = "confirmed";
    order1.stripeSessionId = "cs_test_maria_paid";
    order1.updatedAt = now();

    const order2Items = [
      {
        productId: productMap.veganBerry.id,
        name: productMap.veganBerry.name,
        price: productMap.veganBerry.price,
        quantity: 1,
        image: productMap.veganBerry.images[0],
      },
    ];

    const order2Subtotal = order2Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order2DeliveryFee = order2Subtotal >= 200 ? 0 : 20;
    const order2Total = order2Subtotal + order2DeliveryFee;

    const order2 = createOrder({
      userId: userMap.user2.id,
      customer: {
        name: "Andrei Ionescu",
        email: "andrei@example.com",
        phone: "0722222222",
        address: "Bd. Independenței 22, Cluj-Napoca",
      },
      items: order2Items,
      subtotal: order2Subtotal,
      deliveryFee: order2DeliveryFee,
      total: order2Total,
      paymentMethod: "cash",
    });

    order2.paymentStatus = "pending";
    order2.orderStatus = "pending";
    order2.updatedAt = now();

    const order3Items = [
      {
        productId: productMap.nuntaElegant.id,
        name: productMap.nuntaElegant.name,
        price: productMap.nuntaElegant.price,
        quantity: 1,
        image: productMap.nuntaElegant.images[0],
      },
      {
        productId: productMap.cupcakeSet.id,
        name: productMap.cupcakeSet.name,
        price: productMap.cupcakeSet.price,
        quantity: 2,
        image: productMap.cupcakeSet.images[0],
      },
    ];

    const order3Subtotal = order3Items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order3DeliveryFee = order3Subtotal >= 200 ? 0 : 20;
    const order3Total = order3Subtotal + order3DeliveryFee;

    const order3 = createOrder({
      userId: null,
      customer: {
        name: "Client Guest",
        email: "guest@example.com",
        phone: "0733333333",
        address: "Str. Florilor 5, Iași",
      },
      items: order3Items,
      subtotal: order3Subtotal,
      deliveryFee: order3DeliveryFee,
      total: order3Total,
      paymentMethod: "card",
    });

    order3.paymentStatus = "failed";
    order3.orderStatus = "cancelled";
    order3.stripeSessionId = "cs_test_guest_failed";
    order3.updatedAt = now();

    const orders = [order1, order2, order3];

    for (const order of orders) {
      const ref = db.collection("orders").doc();
      await ref.set(order);
    }

    console.log("✅ Orders added");

    console.log("\n🎉 SEED DONE SUCCESSFULLY");
    console.log("====================================");
    console.log("Admin login:");
    console.log("email: admin@cakeshop.ro");
    console.log("password: admin123");
    console.log("------------------------------------");
    console.log("User login:");
    console.log("email: maria@example.com");
    console.log("password: user1234");
    console.log("------------------------------------");
    console.log("User login:");
    console.log("email: andrei@example.com");
    console.log("password: user1234");
    console.log("------------------------------------");
    console.log("Guest cart sessionId:", guestSessionId);
    console.log("Maria cart sessionId:", mariaSessionId);
    console.log("====================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();