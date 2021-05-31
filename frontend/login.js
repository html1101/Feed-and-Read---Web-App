// If user clicks create account button, redirect to create_account.html.
document.getElementById("create_account_submit").addEventListener("click", () => {
    window.location.href = window.location.href.split("/frontend/")[0] + "/frontend/create_account.html"
})

const xhttp = new XMLHttpRequest()
let resultX = ""

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Returns result from sending username and password we're trying to login with
        // If unsuccessful, return an error
        if (this.responseText == "Login unsuccessful") {
            document.getElementById("err").innerHTML = "ERROR: Login unsuccessful."
            document.getElementById("password").value = ""
        }
    }
}

document.getElementById("login_account_submit").addEventListener("click", () => {
    // Check if the password is correct by passing it to the server.
    let user = document.getElementById("username").value,
        pass = document.getElementById("password").value

    xhttp.open("POST", `/request`)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({
        username: user,
        password: pass
    }))
})