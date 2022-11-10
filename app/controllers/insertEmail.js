const mysql = require("mysql");
const db = mysql.createConnection({
host: process.env.DATABASE_HOST,
user: process.env.DATABASE_USER,
password: process.env.DATABASE_PASSWORD,
database: process.env.DATABASE,
});


exports.insertEmail = (email, more_infor) => {
try {
const query = `INSERT INTO subscribe_notification(email, more_infor) VALUES('${email}', '${more_infor}');`;
return new Promise((resolve, reject) => {
db.query(query, (error) => {
if (error != null) {
reject(error);
} else {
resolve(null);
}
})
})
} catch (error) {
console.log("ERROR: " + error);
}
}