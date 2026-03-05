const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
app.use(compression());

const PORT = 8060;

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "favicon.svg"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});