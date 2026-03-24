const db = require("../db/index");

const categoryModel = {
  fetchCategories: () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM categories";
      db.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  fetchAllSubCategoriesById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM sub_categories where category_id = ?";
      db.query(sql, [id] , (err, result) => {
        if (err) return reject(err);
        
        resolve(result);
      });
    });
  }
};

module.exports = categoryModel;
