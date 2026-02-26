const db = require("../db/index");

const productModel = {
  fetchAllProductsGroupedByCategories: () => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT p.* , c.name as category_name FROM products p join categories c on p.category_id = c.id order by category_name";
      db.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  fetchCategoryWiseProducts: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * 
        FROM products 
        WHERE category_id = (
          SELECT category_id 
          FROM products 
          WHERE id = ?
        )
      `;
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  searchProducts: (term) => {
    return new Promise((resolve, reject) => {
      const query = ` SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.description LIKE ? ORDER BY p.name `;
      const likeTerm = `%${term}%`;
      db.query(query, [likeTerm, likeTerm], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = productModel;
