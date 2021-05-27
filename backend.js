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
app.get('/frontend/:filename', function(req, res) {
    // Make sure the filename doesn't contain ".."(the same as the command cd .., allows users to go backwards in the directory and access files they're not allowed to)
    filename = req.params.filename.split("..").join()

    // Set the MIME type(tells the browser whether it's an HTML, CSS, JS, ICO file, etc)
    res.contentType(path.basename(filename))

    // Send the file to the user
    res.sendFile(path.join(__dirname, `frontend/${filename}`))
})

jsonParse = bodyparse.json()

// Manage requests for login.
app.post("/request", jsonParse, async(req, res) => {
    console.log(req.body)

    // Username is within req.body.username and password in req.body.password
    username = req.body.username
    hashed_password = hashIt(req.body.password)

    // Now make a query to the database for users with this username
    let result = await query(`SELECT hashed_password FROM UserTeachers WHERE username='${username}'`)
    if (result[0].hashed_password == hashed_password) {
        // User logged in correctly!
        console.log("Logged in correctly!")
        res.send("Login successful")
    } else {
        console.log("Unsuccessful login.")
        res.send("Login unsuccessful")
    }
})


// Manage requests for creating an account
app.post("/create_account", jsonParse, async(req, res) => {
    console.log(req.body)

    // Hash password
    hashed_password = hashIt(req.body.password)

    // Read user data and make a query to the SQL schema
    return new Promise((resolve, reject) => {
        query(`INSERT INTO UserTeachers (username, first_name, last_name, church_name, church_address, hashed_password)
    VALUES ('${req.body.username}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.church_name}', '${req.body.church_address}', '${hashed_password}');`).then((val) => {
            resolve(val)
        })
    })
})

// If any other requests are made, return 404.html.
app.use(function(req, res) {
    console.log(`REQUEST FOR ${req.url}`)
        // Read 404.html and return it
    res.sendFile(path.join(__dirname, "frontend/404.html"))
})

// Declare con as a global variable so it can be used in thw query and connection function
let con


// Connect to the database with an asyncronous function.
const connect_pass = async(user) => {
    // Create promise so other functions wait for this promise to execute(AKA wait for whent the database is connected)
    return new Promise((resolve, reject) => {
        /**
         * lineno - Keeps track of the line number from the input.
         *          Line #1 - hash for database
         *          Line #2 - password for admin user
         * password - where the password entered for the admin user is stored
         * hash - where the hash for the database is stored
         */
        let lineno = 0,
            password = "",
            hash = ""

        // Listen to readline input.
        rl.on("line", (line) => {
            lineno++
            if (lineno == 1) {
                // Save database password entered(in line) and ask for hash.
                password = line
                process.stdout.write("\nEnter hash for database: ")
            }
            if (lineno == 2) {
                // Save database hash(in line) and attempt to connect with database.
                hash = line
                    // Create connection to mySQL database
                con = mysql.createConnection({
                    // Host URL to Amazon RDS server endpoint
                    host: `feed-and-read.${hash}.us-east-2.rds.amazonaws.com`,
                    // RDS port(default port)
                    port: 3306,
                    // User to login as(admin by default)
                    user: user,
                    // Password to enter(put into input)
                    password: password,
                    // The database within the server to access(Users contains info about login)
                    database: "Users"
                })

                // Now we actually connect here, and reject any errors that show up.
                con.connect((err) => {
                    // Reject error
                    if (err) reject(err)

                    // Resolve the Promise as finished.
                    resolve("Connected successfully with database.")
                })
            }
        })
    })
}

const connect_to_db = async() => {
    // Use input for password to user to unlock
    let user = "admin"

    // Ask for password(basically just console.log but without entering a new line)
    process.stdout.write(`Enter database password for ${user}: `)

    // Await for the function managing user input.
    let result = await connect_pass(user)

    // Returns result("Connected successfully with database" or error.)
    console.log("\n" + result)
    return result
}

const query = async(query) => {
    // Creates SQL queries to the server and wait for the server to respond(hence why we're using async functions)
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) reject(err)

            // If command successfully worked, return its results.
            console.log(`Command "${query}" successfully executed..`)
            resolve(result)
        })
    })
}

// This is just some fancy stuff to make the password written out as stars.
// This tells us to mute automatic stdout output so we can put in our manual version(stars)
rl.stdoutMuted = true

// Rewrites the write to output function so that it writes out stars if rl.stdoutMuted.
rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
        // If muted output, instead of writing out normal output, write out a star.
        rl.output.write("*")
    } else
        rl.output.write(stringToWrite)
};


connect_to_db().then(() => {
    // Connect the Express app to localhost:port AFTER connecting with database.
    app.listen(port);
    console.log('\nServer started at http://localhost:' + port);
})