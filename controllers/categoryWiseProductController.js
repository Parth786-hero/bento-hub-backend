const productModel = require("../models/productModel");

exports.categoryWiseProductController = async (req, res) => {
  try {
    const { id } = req.params; // or req.body.id depending on how you send it
    const products = await productModel.fetchCategoryWiseProducts(id);

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found for this category",
        products: []
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: e.sqlMessage || "Internal Server Error"
    });
  }
};
