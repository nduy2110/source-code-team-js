const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const { emitWarning } = require("process");
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./.env" });
var session;
const app = express();
const oneDay = 1000 * 60 * 60 * 24;

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});
// set up session
app.use(sessions({
  secret: "thisismysecrctekey_teamjavascript",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(cookieParser());

const publicDirectory = path.join(__dirname, "./public");
// console.log(__dirname);
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set("view engine", "hbs");

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
app.use("/subscribe", require("./routes/subscribe"))                
app.use("/lottery",require("./routes/lottery"))

app.listen(5000, () => {
  console.log("Server started on port 5000");
});