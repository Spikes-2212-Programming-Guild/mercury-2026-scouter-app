const express = require("express");
const compression = require("compression");

const app = express();
app.use(compression());

const PORT = 8060;

app.use(express.static("docs"));

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/docs/" + "favicon.svg");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/docs/" + "index.html");
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
