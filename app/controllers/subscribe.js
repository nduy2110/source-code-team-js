const { isEmail } = require("validator");
const mysql = require("mysql");
const { insertEmail } = require("./insertEmail");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});


exports.register = (req, res) => {
    try {
        const email = req.body.email;
        const more_infor = req.body.more_infor || 0;
        db.query(
            "SELECT email FROM subscribe_notification WHERE email = ?",
            [email],
            (error, results) => {
                if (error) {
                    console.log(error);
                }

            });
        if (isEmail(email)) {
            insertEmail(email, more_infor).then((err) => {
                if (err) {
                    res.render("subscribe", {
                        message: 'Error: ' + err
                    });
                } else {
                    res.render("subscribe", {
                        message: "We will send for you latest notification!!"
                    });
                }
            }).catch((err) => {
                res.render("subscribe", {
                    message: 'Error: ' + err
                });
            })
        } else {
            res.render("subscribe", {
                message: "Invalid email address"
            });
        }
    } catch (error) {
        console.log("ERROR: " + error);
    }
}