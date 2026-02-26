const cartModel = require("../models/cartModel");

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getActiveCart(userId);
    const items = await cartModel.getCartItems(cart.cart_id);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

exports.saveCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getActiveCart(userId);

    // Clear existing items
    await cartModel.clearCart(cart.cart_id);

    // Insert new items (can be empty array, that's fine)
    for (const item of req.body) {
      await cartModel.addOrUpdateItem(cart.cart_id, item.id, item.count);
    }

    res.status(201).json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save cart" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getActiveCart(userId);
    await cartModel.clearCart(cart.cart_id);
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
