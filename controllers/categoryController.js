const categoryModel = require("../models/categoryModel.js");

exports.categoryController = async (req, res) => {
  try {
    const bag = await categoryModel.fetchCategories();

    if (!bag || bag.length === 0) {
      return res.status(400).json({ message: "No category added yet" });
    }

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: bag
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.sqlMessage || "Internal Server Error" });
  }
};

exports.fetchAllSubCategoryController = async (req, res) => {
  try {
  
    const { id } = req.params;
    
    const bag = await categoryModel.fetchAllSubCategoriesById(id);

    if (!bag || bag.length === 0) {
      return res.status(400).json({ message: "No sub category added yet" });
    }

    res.status(200).json({
      message: "Sub-categories fetched successfully",
      categories: bag
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.sqlMessage || "Internal Server Error" });
  }
};

