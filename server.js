const cookieParser = require("cookie-parser");

require("dotenv").config();
// for cross origin resource sharing
const cors = require("cors");

// importing the database
const db = require("./db/index");

// Import Node.js framework
const express = require("express");

// Middleware to parse JSON requests from the frontend
// const bodyParser = require("body-parser");

// Import all routes from the routes folder
const router = require("./routes/route");

// Create an Express application instance
const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST" , "PUT" , "PATCH"],
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://parth786-hero.github.io", // deployed frontend on GitHub Pages
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // origin : "https://parth786-hero.github.io",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true, // only if you’re using cookies or auth headers
  })
);

// Middleware to handle JSON request bodies
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Define dynamic port (defaults to 5000 if not set in environment variables)
const port = process.env.PORT || 5000;

// Mount all routes under the /api prefix
app.use("/api", router);

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
