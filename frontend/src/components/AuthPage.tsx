import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'

interface AuthPageProps {
    onLoginSuccess: () => void
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // 1. Animation Configuration
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 20 }
    })

    // 2. Login Logic
    const handleLogin = async () => {
        console.log("Attempting login for:", username)
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const result = await response.text()

            if (result === "Login Success!") {
                // Success: Tell the parent App to switch pages
                onLoginSuccess()
            } else {
                // Failure: Show the error message
                alert("Server says: " + result)
            }

        } catch (error) {
            console.error("Error:", error)
            alert("Connection Failed - Is the Java Backend running?")
        }
    }

    return (
        <div style={styles.pageContainer}>
            <animated.div style={{ ...styles.card, ...fadeIn }}>

                {/* Title uses the Fancy Hegarty Font (inherited from pageContainer) */}
                <h1 style={styles.title}>Welcome Back</h1>

                {/* Subtitle forces Arial Font */}
                <p style={styles.subtitle}>SmartCity Control Panel</p>

                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <button onClick={handleLogin} style={styles.button}>
                    Login Account
                </button>

            </animated.div>
        </div>
    )
}

// 3. Styles Object
const styles = {
    pageContainer: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        background: '#f0f2f5',
        // Sets the DEFAULT font to Hegarty
        fontFamily: '"BBH Hegarty", Arial, sans-serif',
    },

    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '350px',
        textAlign: 'center' as const
    },

    title: {
        margin: '0 0 10px 0',
        color: '#333'
    },

    subtitle: {
        margin: '0 0 30px 0',
        color: '#666',
        fontSize: '0.9rem',
        // OVERRIDE: Forces this specific text to be Arial
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
    },

    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box' as const,
        fontSize: '1rem',
        fontFamily: 'Arial, sans-serif' // Readable typing
    },

    button: {
        width: '100%',
        padding: '12px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif' // Readable button text
    }
}