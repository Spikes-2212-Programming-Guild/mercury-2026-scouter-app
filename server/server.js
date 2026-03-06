const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 4443;
const ROOT = path.join(__dirname, ".."); // serve files from project root

const options = {
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".txt": "text/plain"
};

https.createServer(options, (req, res) => {
    const urlPath = decodeURIComponent(req.url);

    let filePath = path.resolve(
        ROOT,
        urlPath === "/" ? "index.html" : "." + urlPath
    );

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }

        const ext = path.extname(filePath);
        const type = mimeTypes[ext] || "application/octet-stream";

        res.writeHead(200, {"Content-Type": type});
        res.end(data);
    });

}).listen(PORT, "0.0.0.0", () => {
    console.log(`HTTPS server running at https://localhost:${PORT}`);
});