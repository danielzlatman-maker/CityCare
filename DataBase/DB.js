const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "BestSite100!",
  database: "citycare_db"
});

// Test connection
// pool.getConnection(async (err, connection) => {
//   if (err) {
//     console.log("MySQL connection error:", err);
//   } else {
//     console.log("MySQL Connected!");

//     const [dbRow] = await connection.promise().query("SELECT DATABASE() AS db, @@port AS port, @@hostname AS host");
//     console.log("CONNECTED TO:", dbRow[0]);

//     const [cols] = await connection.promise().query("SHOW COLUMNS FROM users");
//     console.log("USERS COLUMNS:", cols.map(c => c.Field));

//     connection.release();
//   }
// });

pool.getConnection((err, connection) => {
  if (err) {
    console.log("MySQL connection error:", err);
  } else {
    console.log("MySQL Connected!");
    connection.release();
  }
});


module.exports = pool.promise();


