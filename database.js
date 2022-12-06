const mysql = require("mysql2");


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
});
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        res
            .status(500)
            .send(JSON.stringify({ message: "Database connection error" }));
    } else {
        console.log("Connected!");
        // next();
    }
});

module.exports = connection;