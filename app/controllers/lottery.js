const { response } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();

//Kết nối đến database
const mysql = require("mysql");
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.lotteryPage = async (req, res) => {
    // function
    try {
        // Xóa bảng trước cái đã
        db.query("DELETE FROM result");
        console.log("INFO: Delete successfully");

        // Lưu kết quả sổ xố vào db
        const num1 = Math.floor(Math.random() * 50);
        const num2 = Math.floor(Math.random() * 50);
        const num3 = Math.floor(Math.random() * 50);
        const num4 = Math.floor(Math.random() * 50);
        const num5 = Math.floor(Math.random() * 50);
        const num6 = Math.floor(Math.random() * 50);

        var sql = "INSERT INTO result (result) VALUES ?";
        var values = [[num1], [num2], [num3], [num4], [num5], [num6]];
        db.query(sql, [values], (error) => {
            if (error) {
                console.log("ERROR: " + error);
            } else {
                console.log("INFO: Insert random number successfully");
            }
        })
        db.query("SELECT * FROM ticket", (error, data1) => {
            if (error) {
                console.log("ERROR: " + error);
                res.render("./lottery", error);
            } else if (data1.length > 0) {
                res.render("./lottery", { data1 });
            } else {
                const ticket = null;
                res.render("./lottery", { ticket });
            }
        })
    } catch (error) {
        console.log('ERROR: ' + error);
    }
}

//Xổ số
exports.award = async (req, res) => {
    //Truy vấn
    try {
        sql = "SELECT result FROM result ORDER BY id DESC"
        db.query(sql, (error, data) => {
            if (error) {
                console.log("ERROR: " + error);
                res.render("./result");
            }
            else {
                db.query("SELECT ticket FROM ticket ORDER BY id ASC LIMIT 6", (error, ticket1) => {
                    var ticket = ticket1;
                    db.query("DELETE FROM result");
                    if (data.length != 0) {
                        if (ticket.length == 6) {
                            if (ticket[0].ticket == data[0].result) {
                                if (ticket[1].ticket == data[1].result) {
                                    if (ticket[2].ticket == data[2].result) {
                                        if (ticket[3].ticket == data[3].result) {
                                            if (ticket[4].ticket == data[4].result) {
                                                if (ticket[5].ticket == data[5].result) {
                                                    res.render('./result', { data, message: "Winner winner chicken dinner!!!" })
                                                } else {
                                                    res.render('./result', { data, message: "Giải 5" })
                                                }
                                            } else {
                                                res.render('./result', { data, message: "Giải 4" })
                                            }
                                        } else {
                                            res.render('./result', { data, message: "Giải 3" })
                                        }
                                    } else {
                                        res.render('./result', { data, message: "Giải 2" })
                                    }
                                } else {
                                    res.render('./result', { data, message: "Giải 1" })
                                }
                            } else {
                                res.render("./result", { data, message: "Better luck next time" });
                            }
                        } else {
                            res.render('./result', { data, message: "Bạn chưa mua đủ số vé" });
                        }
                    } else {
                        res.render('./result', { flag: "{fake flag}" });
                    }

                    db.query("DELETE FROM ticket");
                })
            }
        })
    } catch (error) {
        console.log("ERROR: " + error);
        res.render("./lottery.js", { message: "Bạn chưa mua đủ số lượng vé" });
    }
}

// Mua vé số
exports.buyTicket = (req, res) => {
    try {
        // Check body hoy a`!!!
        if (!req.body) {
            res.send({ message: "Body is emty" });
            res.send(req.body);
        }

        // Lưu ticket xuống database
        var ticket = req.body.ticket;
        const sql = "INSERT INTO ticket (ticket) VALUES (?)";
        db.query(sql, [ticket], (error, data) => {
            if (error) {
                console.log("ERROR: " + error);
                res.render("./lottery", { ticket, error });
            } else {
                console.log("INFO: Insert ticket successfully");
                db.query("SELECT * FROM ticket", (error, data1) => {
                    if (error) {
                        console.log("ERROR: " + error);
                        res.render("./lottery", { data1, error });
                    } else {
                        res.render("./lottery", { data1 });
                    }
                })

            }
        })
    } catch (error) {
        console.log('ERROR: ' + error);
    }
}

//Chi tiết vé số
exports.detail = (req, res) => {
    db.query("SELECT * FROM ticket WHERE id = " + req.params.id, (error, data) => {
        if (error) {
            console.log("ERROR: " + error);
            res.render("./ticketDetail", { error });
        } else {
            res.render("./ticketDetail", { data });
        }
    })
}