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

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
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
