const express = require("express");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

var database = require("./database");
const app = express();


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    next();
});
app.use(express.json());

app.get("/", (req, res) => {
    res.send(JSON.stringify({ message: "Hello World" }));
});

app.post("/login", (req, res) => {
    const data = {
        id: 1,
        name: "admin",
        email: "admin@admin.com",
    };
    if (req.body.email != undefined && req.body.password != undefined) {
        // res.send(JSON.stringify({ 'data': username, 'pass': password }));
        var email = req.body.email;
        var password = req.body.password;
        // console.log(JSON.stringify({ data: email, pass: password }));
        database.query(
            "SELECT * FROM user WHERE email = ?", [req.body.email],
            (err, result) => {
                if (err) {
                    res.status(500).send(JSON.stringify({ message: "Database error" }));
                } else {
                    if (result.length > 0) {
                        if (result[0].password == req.body.password) {
                            jwt.sign(data, process.env.SECRET_KEY, (err, token) => {
                                res.send(
                                    JSON.stringify({ message: "Login Berhasil", status: 200, data: token })
                                );
                            });
                        } else {
                            res.status(401).send(JSON.stringify({ message: "Wrong email or password" }));
                        }
                    } else {
                        res.status(401).send(JSON.stringify({ message: "Wrong email or password" }));

                    }
                }
            }
        );
    } else {
        res.status(401).send(JSON.stringify({ data: "" }));
    }
    // if (req.body.email == data.email && req.body.password == "admin") {
    //     // jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
    //     //     res.send(JSON.stringify({ token }));
    //     // });
    // }
});

app.use((req, res, next) => {
    console.log("Date", new Date());
    var bearer = req.headers.authorization;
    if (bearer === "unidentified" || bearer === undefined) {
        res.status(401).send(JSON.stringify({ message: "Login dulu" }));
    } else {
        // res.status(401).send(JSON.stringify({ message: bearer }));
        next();
    }
});

app.get("/about", (req, res) => {
    var bearer = req.headers.authorization;
    var token = bearer.split(" ")[1];
    token = jwt.verify(token, "secret", (err, authdata) => {
        if (err) {
            res.status(401).send(JSON.stringify({ message: "Token tidak valid" }));
        } else {
            res.send(JSON.stringify({ message: "about", data: token }));
        }
    });
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port 3000");
});