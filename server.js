const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const PORT = 5080;

app.use(compression());
app.use(express.static(path.join(__dirname + "/app/")));

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/app/data/favicon.svg");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
