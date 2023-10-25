const express = require("express");
const cors = require("cors");

require("dotenv").config();
// DB Connection
const { connectDB } = require("./config/db");

const routes = require("./routes/index");

// Express JS Server APP 
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);

// Testing Route


app.use("/", (req, res) => res.json("Hello, World"));

const PORT = process.env.PORT || 5000;

// connect DB
connectDB();

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));