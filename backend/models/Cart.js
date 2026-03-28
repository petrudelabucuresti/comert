const createCart = (data) => {
  return {
    sessionId: data.sessionId,
    items: data.items || [],
    subtotal: data.subtotal || 0,
    total: data.total || 0,
    updatedAt: new Date().toISOString(),
  };
};

module.exports = { createCart };