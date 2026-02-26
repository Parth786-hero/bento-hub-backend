const db = require("../db/index");

const User = {
  // Create new user
  create: (userData) => {
    const { fname, lname, email, number, password, state, city, street, zipcode } = userData;
    const sql = `
      INSERT INTO users (fname, lname, email, number, password, state, city, street, zipcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [fname, lname, email, number, password, state, city, street, zipcode], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // Find user by email
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // Find user by ID
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = User;
