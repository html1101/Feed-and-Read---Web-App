// Create XML HTTP Request
let xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Will respond with an error if create account doesn't work
        if(this.responseText !== "1") {
            // Error: spit out to error element
            document.getElementById("err").innerHTML = this.responseText
        }
    }
}


// Add listener for when the create account button is created
document.getElementById("form_inf").addEventListener("submit", () => {
    // Confirm the password and password confirmation are the same
    let pass = document.getElementById("password").value
    if (pass == document.getElementById("conf_pass").value) {
        // Passwords are the same, let's create a POST request with all our information
        // Open POST request to path /create_account
        xhttp.open("POST", `/create_account`)

        // Tells backend we're parsing JSON
        xhttp.setRequestHeader("Content-Type", "application/json")

        // Send a JSON object containing all the information about the new user
        xhttp.send(JSON.stringify({
            username: document.getElementById("username").value,
            password: pass, // Will be transformed into a hashed password and stored by the DB
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            email: document.getElementById("email").value,
            church_name: document.getElementById("church_name").value,
            church_address: document.getElementById("church_address").value
        }))

    } else {
        // Passwords aren't the same, write an error to error element
        document.getElementById("err").innerHTML = "Error: Passwords do not match."

        // Clear password confirmation so the user can try again.
        document.getElementById("conf_pass").value = ""
    }

})