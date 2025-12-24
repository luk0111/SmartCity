import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'
import cityImage from '../assets/authbackground.jpg'

interface AuthPageProps {
    onLoginSuccess: () => void
    onSignupClick: () => void
}

export default function AuthPage({ onLoginSuccess, onSignupClick }: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // 1. Card Animation (Drops down from top)
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 50, friction: 15 },
        delay: 200 // Wait a split second before dropping
    })

    // 2. Background Image Animation (Rises up from bottom)
    const cityRise = useSpring({
        from: { transform: 'translateY(100%)' }, // Starts fully "under" the screen
        to: { transform: 'translateY(0%)' },     // Moves to normal position
        config: { tension: 30, friction: 20 },   // Very slow and heavy rise
        delay: 100 // Starts after the card appears
    })

    // Error text animation
    const errorTransitions = useTransition(error, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 },
        config: { tension: 220, friction: 20 }
    })

    const handleLogin = async () => {
        // ... (Keep your existing login logic exactly the same) ...
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
            setError("Connection Failed - Is the Backend running?")
        }
    }

    return (
        <div style={styles.pageContainer}>

            {/* 3. NEW: The Rising City Image */}
            {/* Replace this URL with your own city png! */}
            <animated.img
                src={cityImage}
                style={{ ...styles.cityImage, ...cityRise }}
                alt="City Skyline"
            />

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

                <button onClick={handleLogin} style={styles.button}>
                    Log In
                </button>

                <button onClick={onSignupClick} style={{ ...styles.secondaryButton, marginTop: '10px' }}>
                    Create New Account
                </button>

                {errorTransitions((style, item) =>
                    item ? <animated.p style={{ ...styles.errorText, ...style }}>{item}</animated.p> : null
                )}
            </animated.div>
        </div>
    )
}

const styles = {
    pageContainer: {
        position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#f0f2f5', fontFamily: '"BBH Hegarty", Arial, sans-serif',
        overflow: 'hidden' // Prevents scrollbars when image rises
    },

    // 4. Style for the City Image
    cityImage: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        width: '100vw',  // Force full viewport width
        height: '50vh',  // Fixed height (half the screen height)


        objectFit: 'cover' as const,
        objectPosition: 'bottom',
        // ---------------------

        zIndex: 0,
        opacity: 0.87,
        pointerEvents: 'none' as const
    },

    card: {
        position: 'relative' as const, background: 'white', padding: '40px',
        borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '500px', height: '500px', display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', textAlign: 'center' as const,
        zIndex: 10 // In front of the city image
    },

    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { margin: '0 0 30px 0', color: '#666', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
    errorText: {
        color: '#ff4d4f', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
        position: 'absolute' as const, bottom: '84px', left: 0, right: 0, textAlign: 'center' as const, zIndex: 10
    },
    input: {
        width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '6px',
        border: '1px solid #ddd', boxSizing: 'border-box' as const, fontSize: '1rem', fontFamily: 'Arial, sans-serif'
    },
    button: {
        width: '100%', padding: '12px', background: '#007bff', color: 'white',
        border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    },
    secondaryButton: {
        width: '100%', padding: '12px', background: 'transparent', color: '#007bff',
        border: '1px solid #007bff', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    }
}