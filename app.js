const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); // Fixed import

const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); // Corrected usage

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Start Server
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
