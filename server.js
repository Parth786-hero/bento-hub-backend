const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
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

const server = http.createServer(app);

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
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
// Middleware to handle JSON request bodies
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Define dynamic port (defaults to 5000 if not set in environment variables)
const port = process.env.PORT || 5000;
app.use((req, res, next) => {
  req.io = io; // attach socket instance to every request
  next();
});
// Mount all routes under the /api prefix
app.use("/api", router);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // test event
  socket.emit("hello", { msg: "Welcome to socket server" });
});


// Start the server and listen on the defined port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


