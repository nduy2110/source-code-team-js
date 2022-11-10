const mysql = require("mysql");
const { attemp_login, blacklist } = require("./attemp_login");
const exec = require('child_process').exec;
const { isEmail } = require("validator");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
exports.register = (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    let hashpasswd = "";
    let foo = function (cb) {
      const hash = `echo "${password}" | md5sum | cut -c 1-32`;
      exec(hash, (err, stdout, stderr) => {
        if (err) {
          cb(err);
        }
        cb(null, stdout);
      });
    };
    foo(function (err, stdout) {
      try {
        hashpasswd = stdout.substr(0, 32);
        db.query(
          "SELECT email FROM users WHERE email = ?",
          [email],
          (error, results) => {
            if (error) {
            }
            if (results.length > 0) {
              return res.render("register", {
                message: "That email is already in use",
              });
            } else if (password !== passwordConfirm) {
              return res.render("register", {
                message: "Passwords do not match",
              });
            }
            db.query(
              "INSERT INTO users SET ?",
              { username: username, email: email, password: hashpasswd },
              (error, results) => {
                if (error) {
                } else {
                  return res.render("register", { message: "User registered" });
                }
              }
            );
          }
        );
      } catch (error) {}
    });
  } catch (error) {
    console.log("ERROR: " + error);
  }
}
exports.login = (req, res) => {
  try {
    if (blacklist(req, res)) {
      res.end();
    }
    const { email, password } = req.body;
    let hashpasswd = "";
    let foo = function (cb) {
      const hash = `echo "${password}" | md5sum | cut -c 1-32`;
      exec(hash, (err, stdout, stderr) => {
        if (err) {
          cb(err);
        }
        cb(null, stdout);
      });
    };
    foo(function (err, stdout) {
      try {
        hashpasswd = stdout.substr(0, 32);       
        db.query(
          "SELECT * FROM users WHERE email = ? AND password = ?",
          [email, hashpasswd],
          (error, results) => {
            if (error) {
              console.log("error");
            }
            if (results.length > 0) {
              session = req.session;
              session.userid = req.body.email;
              return res.render("subscribe", {
                login: true
              });
            } else {
              attemp_login(req, res);
            }
          }
        );
      } catch (error) {}
    });
  } catch (error) {
    console.log("ERROR: " + error);
  }
}
exports.forgotPassword = (req,res) => {
  try {
    const email = req.body.email;
    db.query(`SELECT password FROM users WHERE email = '${req.body.email}'`, (error, results) => {
      if(error){
        console.log(error);
        return  res.render("forgotPassword",{message : "Đã xảy ra lỗi"});
      }
      if(results.length > 0) {
        return res.render("forgotPassword", {message : "Đã gửi mật khẩu tới mail của bạn"});
      }
      return  res.render("forgotPassword",{message : "Không tồn tại người dùng"})
    })
  } catch (error) {
    console.log(error);
  }
}