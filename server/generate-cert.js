const selfsigned = require("selfsigned");
const fs = require("fs");

async function generate() {
    const attrs = [{ name: "commonName", value: "localhost" }];

    const pems = await selfsigned.generate(attrs, {
        keySize: 2048,
        days: 365,
        algorithm: "sha256"
    });

    if (!pems || (!pems.private && !pems.privateKey) || !pems.cert) {
        console.error("Certificate generation failed:", pems);
        process.exit(1);
    }

    const key = pems.private || pems.privateKey;

    fs.writeFileSync("key.pem", key);
    fs.writeFileSync("cert.pem", pems.cert);

    console.log("Certificates generated:");
    console.log("key.pem");
    console.log("cert.pem");
}

generate();