const db = require("../db/index");

const cartModel = {
  // Get active cart or create one if none exists
  getActiveCart: (userId) => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM carts WHERE user_id = ? AND status = 'active' LIMIT 1";
      db.query(sql, [userId], (err, rows) => {
        if (err) return reject(err);

        if (rows.length) {
          return resolve(rows[0]);
        }

        // No active cart found → create one
        const insertSql =
          "INSERT INTO carts (user_id, status) VALUES (?, 'active')";
        db.query(insertSql, [userId], (err, result) => {
          if (err) return reject(err);
          resolve({
            cart_id: result.insertId,
            user_id: userId,
            status: "active",
          });
        });
      });
    });
  },

  getCartItems: (cartId) => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT product_id AS id, count FROM cart_items WHERE cart_id = ?";
      db.query(sql, [cartId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  addOrUpdateItem: (cartId, productId, count) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO cart_items (cart_id, product_id, count)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE count = VALUES(count)
      `;
      db.query(sql, [cartId, productId, count], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  clearCart: (cartId) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM cart_items WHERE cart_id = ?";
      db.query(sql, [cartId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  checkoutCart: (cartId, userId, donation) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE carts 
        SET status = 'completed', donation = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE cart_id = ? AND user_id = ?
      `;
      db.query(sql, [donation, cartId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  snapshotCartItems: (cartId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO cart_snapshots (cart_id, product_id, purchased_price, quantity)
        SELECT ci.cart_id, ci.product_id,
               CASE 
                 WHEN p.discounted_price > 0 THEN p.discounted_price
                 ELSE p.price
               END AS purchased_price,
               ci.count
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
      `;
      db.query(sql, [cartId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  decrementStock: (cartId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE products p
        JOIN cart_items ci ON p.id = ci.product_id
        SET p.stock = p.stock - ci.count
        WHERE ci.cart_id = ?
      `;
      db.query(sql, [cartId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  
};

module.exports = cartModel;
