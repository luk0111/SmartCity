import { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import cityImage from '../assets/authbackground.jpg'
import skyImage from '../assets/signupbackground.jpg'

interface VerificationPageProps {
    code: string | null
    onVerificationComplete: () => void
}

export default function VerificationPage({ code, onVerificationComplete }: VerificationPageProps) {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Verifying your account...')

    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(50px)' },
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

    const skyDrop = useSpring({
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0%)' },
        config: { tension: 30, friction: 20 },
        delay: 100
    })

    useEffect(() => {
        const verifyAccount = async () => {
            if (!code) {
                setStatus('error')
                setMessage('Invalid link. No code found.')
                return
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                })

                const textResult = await response.text()

                if (textResult === "Verified!") {
                    setStatus('success')
                    setMessage('Account verified successfully!')
                    setTimeout(() => {
                        onVerificationComplete()
                    }, 3000)
                } else {
                    setStatus('error')
                    setMessage(textResult)
                }
            } catch (err) {
                console.error('Verification error:', err)
                setStatus('error')
                setMessage('Connection error. Is the backend running?')
            }
        }

        verifyAccount()
    }, [code, onVerificationComplete])

    return (
        <div style={styles.pageContainer}>
            <animated.img
                src={skyImage}
                style={{ ...styles.skyImage, ...skyDrop }}
                alt="Sky Background"
            />

            <animated.img
                src={cityImage}
                style={{ ...styles.cityImage, ...cityRise }}
                alt="City Skyline"
            />

            <animated.div style={{ ...styles.card, ...fadeIn }}>

                <div style={styles.iconContainer}>
                    {status === 'verifying' && <div style={styles.spinner}></div>}

                    {/* BOLD SUCCESS TICK */}
                    {status === 'success' && (
                        <div style={styles.successIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    )}

                    {/* BOLD ERROR X */}
                    {status === 'error' && (
                        <div style={styles.errorIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    )}
                </div>

                <h1 style={styles.title}>
                    {status === 'verifying' && 'Verifying...'}
                    {status === 'success' && 'Success!'}
                    {status === 'error' && 'Failed'}
                </h1>

                <p style={styles.message}>{message}</p>

                {status === 'success' && (
                    <p style={styles.redirectText}>Redirecting to login...</p>
                )}

                {status === 'error' && (
                    <button onClick={onVerificationComplete} style={styles.button}>
                        Back to Login
                    </button>
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
    skyImage: {
        position: 'absolute' as const, top: 0, left: 0, width: '100vw', height: '50vh',
        objectFit: 'cover' as const, objectPosition: 'top', zIndex: 0, opacity: 0.87, pointerEvents: 'none' as const
    },
    cityImage: {
        position: 'absolute' as const, bottom: 0, left: 0, width: '100vw', height: '50vh',
        objectFit: 'cover' as const, objectPosition: 'bottom', zIndex: 0, opacity: 0.87, pointerEvents: 'none' as const
    },
    card: {
        position: 'relative' as const, background: 'white', padding: '40px',
        borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '400px',
        textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
        zIndex: 10
    },
    iconContainer: { marginBottom: '20px' },
    spinner: {
        width: '50px', height: '50px', border: '5px solid #f3f3f3',
        borderTop: '5px solid #007bff', borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    successIcon: {
        width: '64px', height: '64px', background: '#28a745', color: 'white',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)'
    },
    errorIcon: {
        width: '64px', height: '64px', background: '#dc3545', color: 'white',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)'
    },
    title: { margin: '0 0 10px 0', color: '#333' },
    message: { color: '#666', marginBottom: '20px', fontFamily: 'Arial, sans-serif' },
    redirectText: { color: '#888', fontStyle: 'italic', fontSize: '14px' },
    button: {
        padding: '12px 24px', background: '#007bff', color: 'white', border: 'none',
        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
        fontFamily: 'Arial, sans-serif'
    }
}