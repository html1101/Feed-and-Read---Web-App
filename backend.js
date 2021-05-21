// Importing builtin libraries
const https = require("https")

// Constants
const host = "localhost",
    port = 8080,
    mime_types = {
        "html": "text/html",
        "css": "text/css",
        "js": "text/javascript",
        "csv": "text/csv",
        "jpg": "image/jpeg",
        "ico": "image/vnd.microsoft.icon",
        "txt": "text/plain"
    }

// Create request listener
const requestListener = (req, res) => {
    // Check if this is a URL or a file being requested
    console.log(req.url, req)
    res.writeHead(200, { "Content-Type": mime_types[req.url] || "text/plain" })

}

const server = https.createServer(requestListener)

server.listen(port, host, () => {
    console.log(`Server is running on https://${host}:${port}`)
})