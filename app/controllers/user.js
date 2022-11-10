const { isEmail } = require("validator");
const mysql = require("mysql");
const { insertEmail } = require("./insertEmail");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.information = (req, res) => {
  try {
    session = req.session;
    if (session.userid) {
      const email = session.userid;
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            console.log("error");
          }
          else {
            res.render("user", {
              email: results[0].email,
              username: results[0].username,
              fname: results[0].first_name,
              lname: results[0].last_name,
              sdt: results[0].sdt
            });
          }
        });
    } else
      res.render("login");
  } catch (error) {
    console.log("ERROR: " + error);
  }
};

exports.update = (req, res) => {
  try {
    session = req.session;
    
    if (session.userid) {
      const body = req.body;
      var layout = body.layout;
      if (layout == "false" || layout == "true") {
        layout = false;
      }
      db.query(
        `UPDATE users SET ? WHERE email = ?`,
        [{ first_name: body.fname, last_name: body.lname, sdt: body.sdt} ,session.userid],
        (error, results) => {
          if (error) {
            return res.render("user", { layout: layout, message: "ERRORRRRRRRRR" });
          } else {
            return res.render("user", { layout: layout, message: "Updated !!!!!!!" });
          }
        }
      );
    } else
      res.render("login");
  } catch (error) {
    console.log("ERROR: " + error);
  }
};