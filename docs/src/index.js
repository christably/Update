const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const bodyParser = require("body-parser");
const { Login, Wishlist, Cart } = require("./config");

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));


//use EJS as the view engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
//use static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

// Render the signup form
app.get("/signup", (req, res) => {
    res.render("signup"); 
});

// Render other pages
app.get("/Bras", (req, res) => {
  res.render("Bras"); 
});

// Render other pages
app.get("/Access", (req, res) => {
  res.render("Access"); 
});

app.get("/home", (req, res) => {
  res.render("home"); 
});

// Render other pages
app.get("/about", (req, res) => {
  res.render("/about"); 
});

//Render other pages
app.get("/contact", (req, res) => {
  res.render("/contact"); 
});

// Render other pages
app.get("/crochets", (req, res) => {
  res.render("crochets"); 
});

// Render other pages
app.get("/fav", (req, res) => {
  res.render("fav"); 
});

// Render other pages
app.get("/lingerie", (req, res) => {
  res.render("lingerie"); 
});

// Render other pages
app.get("/Pants", (req, res) => {
  res.render("Pants"); 
});

// Render other pages
app.get("/toys", (req, res) => {
  res.render("toys"); 
});

app.get("/signout", (req, res) => {
  res.render("signout"); 
});

// Render other pages
app.get("/videos", (req, res) => {
  res.render("videos"); 
});

//register user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  //check if user already exist in database
  const existingUser = await Login.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    //hash password using bycript
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const userdata = await Login.create(data);
    console.log(userdata);
    res.send("User registered successfully");
  }
});

//Login User
app.post("/login", async (req, res) => {
  try {
    const check = await Login.findOne({ name: req.body.username });
    if (!check) {
      res.send("username cannot be found");
    }

    //compare the hash password with the database plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});


app.post("/signout", (req, res) => {
    const { username } = req.body;
    // Assuming you have a variable storing the username of the currently signed-in user
    const signedInUsername = "Mzphill"; // Example username
    if (username === signedInUsername) {
        // Log the user out (clear session, etc.)
        // Redirect to the login page
        res.redirect("/");
    } else {
        // If the username doesn't match, display an error message or handle it as needed
        res.send("Invalid username. Please try again.");
    }
});

// Route to add product to wishlist
app.post("/wishlist/add", async (req, res) => {
  const { userId, productId, productData } = req.body;
  try {
    const wishlistItem = new Wishlist({ userId, productId, productData });
    await wishlistItem.save();
    res.status(200).send("Product added to wishlist successfully");
  } catch (error) {
    res.status(500).send("Error adding product to wishlist");
  }
});

// Route to add product to cart
app.post("/cart/add", async (req, res) => {
  const { userId, productId, productData } = req.body;
  try {
    const cartItem = new Cart({ userId, productId, productData });
    await cartItem.save();
    res.status(200).send("Product added to cart successfully");
  } catch (error) {
    res.status(500).send("Error adding product to cart");
  }
});

const port = 5447;
app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
