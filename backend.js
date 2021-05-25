// Managing the server via expressJS

// Required modules.
const express = require('express'),
    // Path module used for path management(ensures relative paths don't cause issues)
    path = require('path'),
    // Create dependency to MySQL module(allows for connection to database)
    mysql = require("mysql"),
    // Wrapper arround standard I/O, suitable for taking user input from command line
    readline = require("readline"),
    // Used for hashing the files
    crypto = require("crypto"),
    // Used to interpret body of POST request
    bodyparse = require("body-parser")

// Function to transform a string into its hash.
const hashIt = (name) => {
    return crypto.createHash('md5').update(name).digest('hex')
}

// Create interface for readline, configure readable and writable streams
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Initiate express app
const app = express();
// Create port to the environmental variable PORT, or, if that's not set, port 8080
const port = process.env.PORT || 8080;

// When the user accesses the home page, give them the index.html file inside the folder frontend.
app.get('/', function(req, res) {
    // Set the MIME type(tells the browser whether it's an HTML, CSS, JS, ICO file, etc)
    res.contentType(path.basename("home.html"))
    res.sendFile(path.join(__dirname, 'frontend/home.html'));
});

// Now, when another file(filename) is being requested, give them the file inside the folder frontend(frontend/filename).
app.get('/:filename', function(req, res) {
    // Make sure the filename doesn't contain ".."(the same as the command cd .., allows users to go backwards in the directory and access files they're not allowed to)
    filename = req.params.filename.split("..").join()

    // Set the MIME type(tells the browser whether it's an HTML, CSS, JS, ICO file, etc)
    res.contentType(path.basename(filename))

    // Send the file to the user
    res.sendFile(path.join(__dirname, `frontend/${filename}`))
})

jsonParse = bodyparse.json()
    // Manage requests for login.
app.post("/request", jsonParse, function(req, res) {
    console.log(req.body)
        // Username is within req.body.username and password in req.body.password
    console.log(hashIt(req.body.password))
})


// Connect the Express app to localhost:port.
app.listen(port);
console.log('Server started at http://localhost:' + port);
// app.use(app.router)

const connect_to_db = async() => {
    // Use input for password to user to unlock
    let user = "admin",
        lineno = 0,
        password = "",
        hash = ""
    process.stdout.write(`Enter database password for ${user}: `)
    rl.on("line", (line) => {
        lineno++
        if (lineno == 1) {
            password = line
            process.stdout.write("\nEnter hash for database: ")
        }
        if (lineno == 2) {
            hash = line
            let con = mysql.createConnection({
                host: `feed-and-read.${hash}.us-east-2.rds.amazonaws.com`,
                port: 3306,
                user: user,
                password: password,
                database: "Users"
            })
            con.connect((err) => {
                if (err) throw err.sqlMessage
                return 1
            })
        }
    })
}

const query = async(query) => {
    console.log("\n\nConnection successful.\n")
    con.query(query, (err, result) => {
        if (err) throw err.sqlMessage
        console.log("Command successfully executed..")
        console.log(result)
        return 1
    })
}
rl.stdoutMuted = true

rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
        rl.output.write("*")
    } else
        rl.output.write(stringToWrite)
};