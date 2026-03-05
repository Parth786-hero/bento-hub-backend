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

