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
   
      const { cart_id , donation} = req.body;
      if (!cart_id) {
        
        return res.status(400).json({ message: "cart_id is required" });
      }
      const result = await cartModel.checkoutCart(cart_id, userId , donation);
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Cart not found or not owned by user" });
      }

      await cartModel.snapshotCartItems(cart_id);
      await cartModel.decrementStock(cart_id);
      await cartModel.clearCart(cart_id);
      res.json({ message: "Cart marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to checkout cart" });
  }
 
};

exports.fetchOrderHistoryPerUserController = async (req, res) => {
  try {
    const userId = req.user.id;

    // Call the model
    const result = await cartModel.fetchOrderHistoryPerUser(userId);

    // Return the order history as JSON
    res.json({
      message: "Order history fetched successfully",
      orders: result
    });
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};

