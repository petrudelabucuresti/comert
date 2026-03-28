const createProduct = (data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    price: data.price,
    images: data.images || [],
    category: data.category,
    flavors: data.flavors || [],
    dietary: data.dietary || [], // ex: gluten_free
    allergens: data.allergens || [],
    occasion: data.occasion || [],
    weight: data.weight || "",
    isAvailable: data.isAvailable ?? true,
    stock: data.stock || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

module.exports = { createProduct };s