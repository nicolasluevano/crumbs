const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const homeRoute = require("./routes/home");
const authRoutes = require("./routes/auth");
const profileRoute = require("./routes/profile");
const postRoutes = require("./routes/posts");
const settingsRoute = require("./routes/settings");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

//passport config
require("./config/passport")(passport);

//Connect to DB
connectDB();

//Using EJS
app.set("view engine", "ejs");

//magic
app.use(express.static("public"));

//body parsing
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//logging (?)
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

//store session in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passpost middleware
app.use(passport.initialize());
app.use(passport.session());

//flash error messages
app.use(flash())

//setup routes
app.use("/",homeRoute)
app.use("/", authRoutes);
app.use("/",profileRoute);
app.use("/post", postRoutes);
app.use("/settings",settingsRoute);

//run server
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
