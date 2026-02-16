import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'
import cityImage from '../assets/authbackground.jpg'
import { type UserData } from '../App'

interface AuthPageProps {
    onLoginSuccess: (user: UserData) => void
    onSignupClick: () => void
    onForgotPasswordClick: () => void
}

export default function AuthPage({ onLoginSuccess, onSignupClick, onForgotPasswordClick }: AuthPageProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Smoother, "floaty" animation (no bounce)
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(40px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { mass: 1, tension: 90, friction: 30 },
        delay: 300
    })

    const bgReveal = useSpring({
        from: { opacity: 0, transform: 'scale(1.05)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { mass: 1, tension: 50, friction: 40 },
        delay: 100
    })

    const errorTransitions = useTransition(error, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 },
        config: { tension: 200, friction: 20 }
    })

    const handleLogin = async () => {
        setError('')
        try {
            const response = await fetch('http://26.133.65.127:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const result = await response.json()

            if (result.status === "success") {
                localStorage.setItem("token", result.token || "dummy-token")
                localStorage.setItem("username", result.username)
                onLoginSuccess({ username: result.username, email: result.email })
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError("Connection Failed")
        }
    }

    return (
        <div style={styles.pageContainer}>
            <animated.div style={{ ...styles.bgContainer, ...bgReveal }}>
                <img src={cityImage} style={styles.bgImage} alt="Background" />
                <div style={styles.overlay} />
            </animated.div>

            <animated.div style={{ ...styles.card, ...fadeIn }}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>SmartCity Control Panel</p>

                <input
                    type="text"
                    placeholder="Username or Email"
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <div style={{ textAlign: 'right', marginBottom: '25px', width: '100%' }}>
                    <span onClick={onForgotPasswordClick} style={styles.forgotText}>
                        Forgot Password?
                    </span>
                </div>

                <button onClick={handleLogin} style={styles.primaryButton}>
                    Log In
                </button>

                <button onClick={onSignupClick} style={styles.secondaryButton}>
                    Create New Account
                </button>

                {errorTransitions((style, item) =>
                    item ? <animated.p style={{ ...styles.errorText, ...style }}>{item}</animated.p> : null
                )}
            </animated.div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#000', fontFamily: '"BBH Hegarty", "Inter", Arial, sans-serif',
        overflow: 'hidden'
    },
    bgContainer: {
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0
    },
    bgImage: {
        width: '100%', height: '100%', objectFit: 'cover'
    },
    overlay: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)'
    },
    card: {
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.85)', // Glassmorphism
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '50px 40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.4)',
        width: '420px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', zIndex: 10
    },
    title: { margin: '0 0 8px 0', color: '#111', fontWeight: 600, fontSize: '2rem' },
    subtitle: { margin: '0 0 35px 0', color: '#555', fontSize: '0.95rem', letterSpacing: '0.5px' },
    errorText: {
        color: '#ff3b30', fontSize: '0.85rem', fontWeight: 500,
        position: 'absolute', bottom: '15px', left: 0, right: 0, textAlign: 'center'
    },
    input: {
        width: '100%', padding: '15px 16px', marginBottom: '15px', borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)',
        boxSizing: 'border-box', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease'
    },
    forgotText: {
        color: '#444', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500
    },
    primaryButton: {
        width: '100%', padding: '15px', background: '#111', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
        fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', transition: 'background 0.3s ease'
    },
    secondaryButton: {
        width: '100%', padding: '15px', background: 'transparent', color: '#111',
        border: '1px solid #111', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
        fontWeight: 600, letterSpacing: '0.5px', marginTop: '15px', transition: 'all 0.3s ease'
    }
}