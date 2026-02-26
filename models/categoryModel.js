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
};

module.exports = categoryModel;
