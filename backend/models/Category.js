const createCategory = (data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    createdAt: new Date().toISOString(),
  };
};

module.exports = { createCategory };