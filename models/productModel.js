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
  },
  searchAllProductsBySubCat: (id) => {
    return new Promise((resolve, reject) => {
      const query = `select * from products where sub_category_id = ?`;

      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  insertIntoProducts: (obj) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products 
        (name, description, price, discounted_price, image_url, stock, quantity, category_id, sub_category_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        obj.name,
        obj.description,
        obj.price,
        obj.discounted_price,
        obj.image_url,
        obj.stock,
        obj.quantity,
        obj.category_id,
        obj.sub_category_id,
      ];

      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  updateProductById: (obj) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE products 
        SET 
          name = ?, 
          description = ?, 
          price = ?, 
          discounted_price = ?, 
          image_url = ?, 
          stock = ?, 
          quantity = ?, 
          category_id = ?, 
          sub_category_id = ?
        WHERE id = ?
      `;

      const values = [
        obj.name,
        obj.description,
        obj.price,
        obj.discounted_price,
        obj.image_url,
        obj.stock,
        obj.quantity,
        obj.category_id,
        obj.sub_category_id,
        obj.id, // important: id goes last
      ];

      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  fetchProductsOnScroll: ({ limit, lastId }) => {
    return new Promise((resolve, reject) => {
      let query;
      let values;
  
      if (lastId) {
        // Fetch products after the given lastId
        query = `
          SELECT * 
          FROM products 
          WHERE id > ? 
          ORDER BY id ASC 
          LIMIT ?
        `;
        values = [lastId, limit];
      } else {
        // First batch (no cursor yet)
        query = `
          SELECT * 
          FROM products 
          ORDER BY id ASC 
          LIMIT ?
        `;
        values = [limit];
      }
  
      db.query(query, values, (err, result) => {
        if (err) return reject(err);
  
        const hasMore = result.length === limit;
        const newLastId = result.length ? result[result.length - 1].id : null;
  
        resolve({
          products: result,
          lastId: newLastId,
          hasMore
        });
      });
    });
  }
  
};

module.exports = productModel;
