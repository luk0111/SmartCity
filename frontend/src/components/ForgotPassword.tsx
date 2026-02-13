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
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 50, friction: 15 },
        delay: 200
    })

    const cityRise = useSpring({
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0%)' },
        config: { tension: 30, friction: 20 },
        delay: 100
    })

    const messageTransitions = useTransition(message, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 },
        config: { tension: 220, friction: 20 }
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
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
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
            <animated.img
                src={cityImage}
                style={{ ...styles.cityImage, ...cityRise }}
                alt="City Skyline"
            />

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
                        ...styles.button,
                        background: isLoading ? '#ccc' : '#007bff',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button onClick={onBackToLogin} style={{ ...styles.secondaryButton, marginTop: '10px' }}>
                    Back to Login
                </button>

                {messageTransitions((style, item) =>
                    item ? (
                        <animated.p style={{
                            ...styles.messageText,
                            color: isError ? '#ff4d4f' : '#28a745',
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

const styles = {
    pageContainer: {
        position: 'fixed' as const, top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: '#f0f2f5', fontFamily: '"BBH Hegarty", Arial, sans-serif',
        overflow: 'hidden'
    },
    cityImage: {
        position: 'absolute' as const, bottom: 0, left: 0, width: '100vw', height: '50vh',
        objectFit: 'cover' as const, objectPosition: 'bottom', zIndex: 0, opacity: 0.87, pointerEvents: 'none' as const
    },
    card: {
        position: 'relative' as const, background: 'white', padding: '40px',
        borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '500px', height: '400px', display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', textAlign: 'center' as const, zIndex: 10
    },
    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { margin: '0 0 30px 0', color: '#666', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
    messageText: {
        fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
        position: 'absolute' as const, bottom: '40px', left: 0, right: 0, textAlign: 'center' as const, zIndex: 10
    },
    input: {
        width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
        border: '1px solid #ddd', boxSizing: 'border-box' as const, fontSize: '1rem', fontFamily: 'Arial, sans-serif'
    },
    button: {
        width: '100%', padding: '12px', color: 'white', border: 'none',
        borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    },
    secondaryButton: {
        width: '100%', padding: '12px', background: 'transparent', color: '#007bff',
        border: '1px solid #007bff', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    }
}