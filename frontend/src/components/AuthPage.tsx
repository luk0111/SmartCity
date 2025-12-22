import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'

interface AuthPageProps {
    onLoginSuccess: () => void
    onSignupClick: () => void
}

export default function AuthPage({ onLoginSuccess, onSignupClick }: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Main Auth Animation
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 50, friction: 15 }
    })

// error text animation
    const errorTransitions = useTransition(error, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 }, // Fades out instantly if cleared
        config: { tension: 220, friction: 20 } // Slightly snappier than the card
    })

    const handleLogin = async () => {
        console.log("Attempting login for:", username)
        setError('')

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const result = await response.text()

            if (result === "Login Success!") {
                onLoginSuccess()
            } else {
                setError(result)
            }

        } catch (err) {
            console.error("Error:", err)
            setError("Connection Failed - Is the Java Backend running?")
        }
    }

    const handleSignup = async () => {
        console.log("Attempting signup for:", username)
        setError('')

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            })
            const result = await response.text()

            if (result === "Signup Success!") {
                onSignupClick()
            } else {
                setError(result)
            }
        }
        catch (err) {
            console.error("Error:", err)
            setError("Connection Failed - Is the Java Backend running?")
        }
    }

    return (
        <div style={styles.pageContainer}>
            <animated.div style={{ ...styles.card, ...fadeIn }}>

                <h1 style={styles.title}>Welcome Back</h1>
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

                {/* 3. The Animated Error Message */}
                {/* We map over the transition to render the animated text */}


                <button onClick={handleLogin} style={styles.button}>
                    LogIn into your Account
                </button>

                <button onClick={handleSignup} style={{ ...styles.button, marginTop: '5px' }}>
                    SignUp for an Account
                </button>

                {errorTransitions((style, item) =>
                    item ? (
                        <animated.p style={{ ...styles.errorText, ...style }}>
                            {item}
                        </animated.p>
                    ) : null
                )}

            </animated.div>
        </div>
    )
}

const styles = {
    pageContainer: {
        position: 'fixed' as const,
        top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#f0f2f5',
        fontFamily: '"BBH Hegarty", Arial, sans-serif',
    },

    card: {
        position: 'relative' as const,
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '500px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        textAlign: 'center' as const
    },

    title: { margin: '0 0 10px 0', color: '#333' },

    subtitle: {
        margin: '0 0 30px 0', color: '#666', fontSize: '0.9rem',
        fontFamily: 'Arial, sans-serif', fontWeight: 'bold'
    },

    errorText: {
        color: '#ff4d4f',
        fontSize: '0.9rem',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',

        // Positioning (Anchored to the card, so button doesn't move)
        position: 'absolute' as const,
        bottom: '85px',
        left: '0',
        right: '0',
        textAlign: 'center' as const,

        // Ensure it sits on top of other elements if they overlap
        zIndex: 10
    },

    input: {
        width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
        border: '1px solid #ddd', boxSizing: 'border-box' as const,
        fontSize: '1rem', fontFamily: 'Arial, sans-serif'
    },

    button: {
        width: '100%', padding: '12px', background: '#007bff', color: 'white',
        border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer',
        fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    }
}