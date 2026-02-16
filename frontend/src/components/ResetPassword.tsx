import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'
import cityImage from '../assets/authbackground.jpg'

interface ResetPasswordProps {
    token: string | null
    onResetComplete: () => void
}

export default function ResetPassword({ token, onResetComplete }: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

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

    const handlePasswordReset = async () => {
        setMessage('')
        setIsError(false)

        if (!token) {
            setMessage("Invalid link. No reset token found.")
            setIsError(true)
            return
        }

        if (!newPassword || newPassword.length < 6) {
            setMessage("Password must be at least 6 characters.")
            setIsError(true)
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://192.168.1.253:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            })

            const result = await response.json()

            if (result.status === "success") {
                setMessage(result.message)
                setIsError(false)
                setIsSuccess(true)
                // Automatically send them to login after 3 seconds
                setTimeout(() => {
                    onResetComplete()
                }, 3000)
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
                <h1 style={styles.title}>Create New Password</h1>
                <p style={styles.subtitle}>Enter your new secure password below</p>

                {!isSuccess ? (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.input}
                        />

                        <button
                            onClick={handlePasswordReset}
                            disabled={isLoading}
                            style={{
                                ...styles.button,
                                background: isLoading ? '#ccc' : '#28a745',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </>
                ) : (
                    <p style={{ color: '#888', fontStyle: 'italic', marginTop: '20px' }}>
                        Redirecting to login...
                    </p>
                )}

                <button onClick={onResetComplete} style={{ ...styles.secondaryButton, marginTop: '10px' }}>
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
        width: '100%', padding: '12px', background: 'transparent', color: '#666',
        border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    }
}