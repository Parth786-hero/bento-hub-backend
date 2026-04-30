// const cron = require("node-cron");
// const productModel = require("../models/productModel.js");

// // // Apply discount at 10:40 AM
// // cron.schedule("40 10 * * *", async () => {
// //   console.log("Applying 50% discount at:", new Date().toLocaleTimeString());
// //   await productModel.applyTemporaryDiscount(50);
// // });

// // // Reset discount at 10:55 AM
// // cron.schedule("55 10 * * *", async () => {
// //   console.log("Restoring original discounts at:", new Date().toLocaleTimeString());
// //   await productModel.resetTemporaryDiscount();
// // });


// // Apply discount at every even minute (0, 2, 4, …)
// cron.schedule("*/2 * * * *", async () => {
//     console.log("Applying 50% discount at:", new Date().toLocaleTimeString());
//     await productModel.applyTemporaryDiscount(50);
//   });
  
//   // Reset discount at every odd minute (1, 3, 5, …)
//   cron.schedule("1-59/2 * * * *", async () => {
//     console.log("Restoring original discounts at:", new Date().toLocaleTimeString());
//     await productModel.resetTemporaryDiscount();
//   });
  