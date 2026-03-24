const productModel = require("../models/productModel.js");

exports.productController = async (req, res) => {
  try {
    const products = await productModel.fetchAllProductsGroupedByCategories();

    if (!products || products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found", products: [] });
    }

    const grouped = products.reduce((acc, curr) => {
      const category = curr.category_name;
      if (!acc[category]) acc[category] = [];
      acc[category].push(curr); // ✅ use push instead of push_back
      return acc;
    }, {});

    res.json({
      message: "products fetched successfully",
      products: Object.entries(grouped).map(([category, items]) => ({
        category_name: category,
        products: items,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.sqlMessage || "Internal Server Error" });
  }
};

exports.searchProductsController = async (req, res) => {
  try {
    const term = req.query.q || "";
   
    const results = await productModel.searchProducts(term);
    res.json({message : "Products fetched successfully" , products : results});
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

exports.fetchAllProductsBySubcat = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await productModel.searchAllProductsBySubCat(id);
    res.json({
      message: "Products fetched successfully...",
      products: results
    });
  } catch (e) {
    res.status(500).json({
      message: e.sqlMessage || e.message || "Internal Server Error."
    });
  }
};


exports.insertIntoProductsController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discounted_price,
      image_url,
      stock,
      quantity,
      category_id,
      sub_category_id,
    } = req.body;

    // Basic validation
    if (!name || !price || !quantity || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = {
      name,
      description,
      price,
      discounted_price,
      image_url,
      stock,
      quantity,
      category_id,
      sub_category_id,
    };

    const result = await productModel.insertIntoProducts(newProduct);

    res.status(201).json({
      message: "Product inserted successfully",
      productId: result.insertId,
      product: newProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: e.sqlMessage || e.message || "Internal Server Error",
    });
  }
};

exports.updateProductByIdController = async (req, res) => {
  try {
    const { id } = req.params; // assuming you send product id in the URL

    const {
      name,
      description,
      price,
      discounted_price,
      image_url,
      stock,
      quantity,
      category_id,
      sub_category_id,
    } = req.body;
    

    // Basic validation
    if (!id || !name || !price || !quantity || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedProduct = {
      id,
      name,
      description,
      price,
      discounted_price,
      image_url,
      stock,
      quantity,
      category_id,
      sub_category_id,
    };

    const result = await productModel.updateProductById(updatedProduct);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: e.sqlMessage || e.message || "Internal Server Error",
    });
  }
};



