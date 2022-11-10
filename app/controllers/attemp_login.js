const mysql = require("mysql");
const { execSync } = require("child_process");
const {createWriteStream} = require('fs')
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.attemp_login = (req, res) => {
  try {
    db.query("SELECT * FROM login_attemp WHERE ip= ?",
      [req.headers['x-forwarded-for'] || req.ip],
      (error, results) => {
        if (error) {
          return res.render("login", {
            message: "Email or Password wrong",
          });
        }
        if (results.length > 0) {
          db.query("UPDATE login_attemp set attemp = attemp + 1 where ip = ?",
            [req.headers['x-forwarded-for'] || req.ip],
          )
        } else {
          db.query("INSERT INTO login_attemp(ip,attemp) VALUES(?,?)",
            [req.headers['x-forwarded-for'] || req.ip, 1],
          )
        }
        return res.render("login", {
          message: "Email or Password wrong",
        });
      }
    )
  }
  catch (error) {
    console.log("ERROR: " + error);
  }
}

exports.blacklist = (req, res) => {
  try {
    db.query("SELECT attemp from login_attemp where ip=?",
      [req.headers['x-forwarded-for'] || req.ip],
      (error, results) => {
        if (error) {
          return res.render("login", { message: error });
        }
        if (results.length > 0) {
          var json = JSON.stringify(results);
          var value = results[0].attemp;
          if (value > 9) {
            try {
              //Fix Here
              //execSync(`echo  ${req.headers['x-forwarded-for'] || req.ip} >> /tmp/suspicious_ip.log`);
              var logStream = createWriteStream('/tmp/suspicious_ip.log', {flags : 'a'});
              logStream.write(`${req.headers['x-forwarded-for'] || req.ip}`);
              logStream.end('\n');
              return 1;
            } catch (error) {
              console.log(error);
            }
            
          }
          return 0;
        }
      }
    );
  } catch (error) {
    console.log("ERROR: " + error);
  }
}