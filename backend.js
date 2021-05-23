// Managing the server via expressJS

const express = require('express');
const path = require('path');

const app = express(); // Initiate express app
const port = process.env.PORT || 8080; // Create port to the environmental variable PORT, or, if that's not set, port 8080

// When the user accesses the home page, give them the index.html file inside the folder frontend.
app.get('/', function(req, res) {
    res.contentType(path.basename("home.html")) // Set the MIME type(tells the browser whether it's an HTML, CSS, JS, ICO file, etc)
    res.sendFile(path.join(__dirname, 'frontend/home.html'));
});

// Now, when another file(filename) is being requested, give them the file inside the folder frontend(frontend/filename).
app.get('/:filename', function(req, res) {
    // Make sure the filename doesn't contain ".."(the same as the command cd .., allows users to go backwards in the directory and access files they're not allowed to)
    filename = req.params.filename.split("..").join()
    res.contentType(path.basename(filename)) // Set the MIME type(tells the browser whether it's an HTML, CSS, JS, ICO file, etc)
    res.sendFile(path.join(__dirname, `frontend/${filename}`))
})

// Connect the Express app to localhost:port.
app.listen(port);
console.log('Server started at http://localhost:' + port);