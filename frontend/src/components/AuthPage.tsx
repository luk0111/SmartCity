import { useState } from 'react'
// Imports the 'useState' hook from React, which allows us to remember what the user types (state).

export default function AuthPage() {
// Defines the main functional component named 'AuthPage' that we can use in other parts of the app.

    const [username, setUsername] = useState('')
    // Creates a memory slot named 'username'. 'setUsername' is the tool to update it. It starts empty ('').

    const [password, setPassword] = useState('')
    // Creates a memory slot named 'password'. 'setPassword' is the tool to update it. It starts empty.

    const handleLogin = async () => {
        // Defines a function that runs when the button is clicked. 'async' means it will wait for internet requests.

        console.log("Attempting login for:", username)
        // Prints a message to the browser's developer console for debugging purposes.

        try {
            // Starts a "safe zone". If anything crashes inside here, it jumps to the 'catch' block instead of freezing the app.

            const response = await fetch('http://localhost:8080/api/auth/login', {
                // Sends a request to your Java backend. 'await' pauses the code here until the server replies.

                method: 'POST',
                // Tells the server we are SENDING data (creating/posting), not just reading it.

                headers: { 'Content-Type': 'application/json' },
                // Tells the server: "Hey, I am sending you JSON data, so please parse it as JSON."

                body: JSON.stringify({ username, password })
                // Takes your JavaScript variables (username, password) and converts them into a text string format that travels over the internet.
            })

            const result = await response.text()
            // Waits for the server's reply (e.g., "Login Success!") and converts it into readable text.

            alert("Server says: " + result)
            // Shows a browser popup window with the message received from the server.

        } catch (error) {
            // This block runs only if the 'try' block fails (e.g., the server is down).

            console.error("Error:", error)
            // Prints the specific error details to the console so you can fix it.

            alert("Connection Failed")
            // Tells the user something went wrong.
        }
    }

    return (
        // The part below is the actual HTML (JSX) that gets drawn on the screen.

        <div style={{ padding: '50px', textAlign: 'center' }}>
            {/* A container box with 50px of internal spacing, with all text centered. */}

            <h1>SmartCity Login</h1>
            {/* The main title header. */}

            <input
                type="text"
                placeholder="Username"
                // A text box where the user types their name. "Username" is the gray hint text.

                onChange={(e) => setUsername(e.target.value)}
                // When the user types, take the value (e.target.value) and save it into our 'username' memory slot.

                style={{ display: 'block', margin: '10px auto', padding: '10px' }}
                // CSS Styling: Make it its own line (block), center it (margin auto), and make it comfortable (padding).
            />

            <input
                type="password"
                placeholder="Password"
                // A text box for passwords. It hides the characters (shows dots instead of letters).

                onChange={(e) => setPassword(e.target.value)}
                // When the user types, save the value into the 'password' memory slot.

                style={{ display: 'block', margin: '10px auto', padding: '10px' }}
                // Same styling as above to keep them aligned.
            />

            <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                {/* A clickable button. When clicked, it runs the 'handleLogin' function we wrote above. */}
                Login
            </button>
        </div>
    )
}