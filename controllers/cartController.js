const cartModel = require("../models/cartModel");

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getActiveCart(userId);
    const items = await cartModel.getCartItems(cart.cart_id);

    res.json({ items ,  cartId : cart.cart_id});
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

exports.checkoutCart = async (req, res) => {
 
  try {
    const userId = req.user.id;
   
      const { cart_id } = req.body;
      if (!cart_id) {
        
        return res.status(400).json({ message: "cart_id is required" });
      }
      const result = await cartModel.checkoutCart(cart_id, userId);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cart not found or not owned by user" });
      }
      res.json({ message: "Cart marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to checkout cart" });
  }
 
};
