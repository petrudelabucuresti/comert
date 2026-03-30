const { db } = require("./db");

const seedData = async () => {
  try {
    console.log("Seeding database...");

    // 🔹 CATEGORII
    const categories = [
      {
        name: "Torturi aniversare",
        slug: "torturi-aniversare",
      },
      {
        name: "Torturi copii",
        slug: "torturi-copii",
      },
      {
        name: "Torturi nunta",
        slug: "torturi-nunta",
      },
      {
        name: "Torturi dietetice",
        slug: "torturi-dietetice",
      },
    ];

    const categoryMap = {};

    for (const cat of categories) {
      const ref = db.collection("categories").doc();

      const data = {
        ...cat,
        createdAt: new Date().toISOString(),
      };

      await ref.set(data);

      categoryMap[cat.slug] = cat.slug;
    }

    console.log("Categories added");

    // 🔹 PRODUSE
    const products = [
      {
        name: "Tort Red Velvet",
        slug: "tort-red-velvet",
        price: 150,
        category: "torturi-aniversare",
        flavors: ["red_velvet"],
        dietary: [],
        allergens: ["gluten"],
        occasion: ["aniversare"],
        stock: 10,
        images: ["https://dummyimage.com/300x300"],
      },
      {
        name: "Tort Ciocolata Deluxe",
        slug: "tort-ciocolata-deluxe",
        price: 180,
        category: "torturi-aniversare",
        flavors: ["ciocolata"],
        dietary: [],
        allergens: ["lactate"],
        occasion: ["aniversare"],
        stock: 8,
        images: ["https://dummyimage.com/300x300"],
      },
      {
        name: "Tort Unicorn",
        slug: "tort-unicorn",
        price: 200,
        category: "torturi-copii",
        flavors: ["vanilie"],
        dietary: [],
        allergens: ["lactate"],
        occasion: ["copii"],
        stock: 5,
        images: ["https://dummyimage.com/300x300"],
      },
      {
        name: "Tort Nunta Elegant",
        slug: "tort-nunta-elegant",
        price: 500,
        category: "torturi-nunta",
        flavors: ["fructe"],
        dietary: [],
        allergens: [],
        occasion: ["nunta"],
        stock: 3,
        images: ["https://dummyimage.com/300x300"],
      },
      {
        name: "Tort Vegan",
        slug: "tort-vegan",
        price: 170,
        category: "torturi-dietetice",
        flavors: ["fructe"],
        dietary: ["vegan"],
        allergens: [],
        occasion: ["aniversare"],
        stock: 6,
        images: ["https://dummyimage.com/300x300"],
      },
    ];

    for (const product of products) {
      const ref = db.collection("products").doc();

      await ref.set({
        ...product,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log("Products added");

    console.log("Seeding DONE ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();