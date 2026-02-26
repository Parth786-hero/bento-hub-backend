const db = require("../db/index");

const loginModel = {
  // Fetch user by number
  fetchUser: (number) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE number = ?";
      db.query(sql, [number], (err, results) => {
        if (err) return reject(err);
       
        resolve(results[0]); // return first user or undefined
      });
    });
  }
};

module.exports = loginModel;
