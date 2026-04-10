const mysql = require("mysql2");
// MySQL connection (without specifying database yet)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");

  // Create database if not exists
  db.query("CREATE DATABASE IF NOT EXISTS ecommerce", (err) => {
    if (err) throw err;
    console.log("Database created or already exists");

    // Switch to ecommerce database
    db.changeUser({ database: "ecommerce" }, (err) => {
      if (err) throw err;

      // Users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fname VARCHAR(100) NOT NULL,
          lname VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          number VARCHAR(20) unique NOT NULL,
          password VARCHAR(255) NOT NULL,
          state VARCHAR(100) NOT NULL,
          city VARCHAR(100) NOT NULL,
          street VARCHAR(255) NOT NULL,
          zipcode VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log("Users table created or already exists");
      });

      // Categories table
      const createCategoryTable = `
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL UNIQUE,
          slug VARCHAR(150) UNIQUE,
          description TEXT,
          image_url VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      db.query(createCategoryTable, (err) => {
        if (err) throw err;
        console.log("Category table created or already exists");
      });

      // Sub-categories table
      const createSubCategoryTable = `
        CREATE TABLE IF NOT EXISTS sub_categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT NOT NULL,
          name VARCHAR(150) NOT NULL,
          slug VARCHAR(150) UNIQUE,
          description TEXT,
          image_url VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );
      `;
      db.query(createSubCategoryTable, (err) => {
        if (err) throw err;
        console.log("Sub-categories table created or already exists");
      });

      // Products table
      const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discounted_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        stock INT DEFAULT 0,
        quantity VARCHAR(150) NOT NULL,
        category_id INT,
        sub_category_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE SET NULL
      );
      
      `;
      db.query(createProductsTable, (err) => {
        if (err) throw err;
        console.log("Products table created or already exists");
      });

      // Carts table
      const createCartsTable = `
        CREATE TABLE IF NOT EXISTS carts (
          cart_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          status ENUM('active','completed') DEFAULT 'active',
          donation BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
      db.query(createCartsTable, (err) => {
        if (err) throw err;
        console.log("Carts table created or already exists");
      });

      // Cart items table
      const createCartItemsTable = `
        CREATE TABLE IF NOT EXISTS cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          count INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_cart_product (cart_id, product_id),
          FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `;
      db.query(createCartItemsTable, (err) => {
        if (err) throw err;
        console.log("Cart items table created or already exists");
      });
      // cart snapshot
      const createCartSnapshotsTable = `
        CREATE TABLE IF NOT EXISTS cart_snapshots (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          purchased_price DECIMAL(10,2) NOT NULL,
          quantity INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `;
      db.query(createCartSnapshotsTable, (err) => {
        if (err) throw err;
        console.log("Cart snapshots table created or already exists");
      });
    });
  });
});

module.exports = db;
