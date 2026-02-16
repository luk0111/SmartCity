import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'
import cityImage from '../assets/authbackground.jpg'

interface ForgotPasswordProps {
    onBackToLogin: () => void
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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

    const messageTransitions = useTransition(message, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 },
        config: { tension: 200, friction: 20 }
    })

    const handleResetRequest = async () => {
        setMessage('')
        setIsError(false)

        if (!email) {
            setMessage("Please enter your email address.")
            setIsError(true)
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://26.133.65.127:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const result = await response.json()

            if (result.status === "success") {
                setMessage(result.message)
                setIsError(false)
            } else {
                setMessage(result.message)
                setIsError(true)
            }
        } catch (err) {
            setMessage("Connection Failed. Is the backend running?")
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={styles.pageContainer}>
            <animated.div style={{ ...styles.bgContainer, ...bgReveal }}>
                <img src={cityImage} style={styles.bgImage} alt="Background" />
                <div style={styles.overlay} />
            </animated.div>

            <animated.div style={{ ...styles.card, ...fadeIn }}>
                <h1 style={styles.title}>Reset Password</h1>
                <p style={styles.subtitle}>Enter your email to receive a reset link</p>

                <input
                    type="email"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <button
                    onClick={handleResetRequest}
                    disabled={isLoading}
                    style={{
                        ...styles.primaryButton,
                        background: isLoading ? '#666' : '#111',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>

                <button onClick={onBackToLogin} style={styles.secondaryButton}>
                    Back to Login
                </button>

                {messageTransitions((style, item) =>
                    item ? (
                        <animated.p style={{
                            ...styles.messageText,
                            color: isError ? '#ff3b30' : '#34c759',
                            ...style
                        }}>
                            {item}
                        </animated.p>
                    ) : null
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
        background: 'rgba(255, 255, 255, 0.85)',
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
    messageText: {
        fontSize: '0.85rem', fontWeight: 500,
        position: 'absolute', bottom: '15px', left: 0, right: 0, textAlign: 'center'
    },
    input: {
        width: '100%', padding: '15px 16px', marginBottom: '15px', borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.6)',
        boxSizing: 'border-box', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease'
    },
    primaryButton: {
        width: '100%', padding: '15px', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
        fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', transition: 'background 0.3s ease'
    },
    secondaryButton: {
        width: '100%', padding: '15px', background: 'transparent', color: '#111',
        border: '1px solid #111', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
        fontWeight: 600, letterSpacing: '0.5px', marginTop: '15px', transition: 'all 0.3s ease'
    }
}