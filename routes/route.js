const express = require("express");
const { registerUser } = require("../controllers/userController");
const {loginUser , retrieveUser , changeUserPasswordController} = require("../controllers/loginController");
const {getMe} = require("../controllers/getMeController");
const {logoutUser} = require("../controllers/logoutController");
const {categoryController , fetchAllSubCategoryController} = require("../controllers/categoryController");
const {productController , searchProductsController , fetchAllProductsBySubcat , insertIntoProductsController , updateProductByIdController , fetchProductsOnScrollController , triggerDiscountController} = require("../controllers/productController");
const {categoryWiseProductController} = require("../controllers/categoryWiseProductController");
const { saveCart , getCart , checkoutCart , fetchOrderHistoryPerUserController} = require("../controllers/cartController");

const authMiddleware = require("../middleware/index");
const router = express.Router();

// Registration route
router.post("/register", registerUser);
router.post("/login" , loginUser);
router.get("/me" ,authMiddleware,  getMe);
router.post("/logout", logoutUser);
router.get("/category" , categoryController);
router.get("/products" , productController);
router.get("/products/category/:id" , categoryWiseProductController);
router.get("/products/search" , searchProductsController);
router.post("/saveCart" , authMiddleware , saveCart);
router.get("/getCart" , authMiddleware , getCart);
router.get("/getAllSubCatById/:id" , fetchAllSubCategoryController);
router.get("/getProductsSubCatWise/:id" , fetchAllProductsBySubcat);
router.put("/checkout", authMiddleware , checkoutCart);
router.post("/products" , insertIntoProductsController);
router.put("/products/:id" , updateProductByIdController);
router.get("/productsOnScroll" , fetchProductsOnScrollController);
router.get("/retrieveUser" , retrieveUser);
router.patch("/changeUserPassword" , changeUserPasswordController);
router.get("/fetchOrderHistoryPerUser" , authMiddleware , fetchOrderHistoryPerUserController);
router.post("/trigger-discount", triggerDiscountController);
module.exports = router;
