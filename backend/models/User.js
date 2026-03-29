const createUser = (data) => {
  return {
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role || "user",
    createdAt: new Date().toISOString(),
  };
};

module.exports = { createUser };