const express =require("express");
const path = require("path");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const app  = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());


app.get("/",(req,res,next)=>{
 res.render("index")
});





app.listen(3000);
