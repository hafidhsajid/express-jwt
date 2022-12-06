const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const app = express();

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ message: "Hello World" }));
});
app.post("/login", (req, res) => {
    const data = {
        id: 1,
        name: 'admin',
        email: 'admin@admin.com',
    };
    jwt.sign(data, 'secret', (err, token) => {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({ message: "Login Berhasil", status: 200, data: token }));
    });
});

app.use((req, res, next) => {
    console.log("Date", new Date());
    var bearer = req.headers.authorization;
    if (bearer === "unidentified" || bearer === undefined) {
        res.setHeader("Content-Type", "application/json");
        res.status(401).send(JSON.stringify({ message: "Login dulu" }));
    } else {
        // res.status(401).send(JSON.stringify({ message: bearer }));
        next();
    }
});

app.get("/about", (req, res) => {
    var bearer = req.headers.authorization;
    var token = bearer.split(" ")[1];
    token = jwt.verify(token, 'secret', (err, authdata) => {
        if (err) {
            res.setHeader("Content-Type", "application/json");
            res.status(401).send(JSON.stringify({ message: "Token tidak valid" }));
        } else {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({ message: "about", data: token }));

        }
    });
});

app.listen(3000, err => {
    if (err) {
        console.log(err);
    }
    console.log("Server is running on port 3000");
});