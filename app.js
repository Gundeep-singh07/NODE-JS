require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const User = require("./models/Users");
const userRoutes = require("./routes/authRoutes");
const passportConfig = require("./config/passport");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");

//port
const PORT = process.env.PORT || 3000;

//middlewares: passing form data
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  })
);

//passport config
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//EJS
app.set("view engine", "ejs");

//Home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
  });
});

//routes
app.use("/auth", userRoutes);
app.use("/posts", postRoutes);

//error handler
app.use(errorHandler);

//start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected !!! ");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("DataBase connection failed");
  });
