import { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface VerificationPageProps {
    onVerificationComplete: () => void
}

export default function VerificationPage({ onVerificationComplete }: VerificationPageProps) {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Verifying your account...')

    const code = searchParams.get('code')

    // Animation
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'scale(0.95)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 50, friction: 15 }
    })

    useEffect(() => {
        const verifyAccount = async () => {
            if (!code) {
                setStatus('error')
                setMessage('Invalid verification link. No code provided.')
                return
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                })

                const result = await response.json()

                if (response.ok && result.status === 'success') {
                    setStatus('success')
                    setMessage('Account verified successfully!')

                    // Auto-redirect to login after 3 seconds
                    setTimeout(() => {
                        onVerificationComplete()
                    }, 3000)
                } else {
                    setStatus('error')
                    setMessage(result.message || 'Verification failed. Please try again.')
                }
            } catch (err) {
                console.error('Verification error:', err)
                setStatus('error')
                setMessage('Connection error. Please check your internet and try again.')
            }
        }

        verifyAccount()
    }, [code, onVerificationComplete])

    return (
        <div style={styles.pageContainer}>
            <animated.div style={{ ...styles.card, ...fadeIn }}>
                <div style={styles.iconContainer}>
                    {status === 'verifying' && (
                        <div style={styles.spinner}></div>
                    )}
                    {status === 'success' && (
                        <div style={styles.successIcon}>✓</div>
                    )}
                    {status === 'error' && (
                        <div style={styles.errorIcon}>✗</div>
                    )}
                </div>

                <h1 style={styles.title}>
                    {status === 'verifying' && 'Verifying Account'}
                    {status === 'success' && 'Success!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p style={styles.message}>{message}</p>

                {status === 'success' && (
                    <p style={styles.redirectText}>Redirecting to login page...</p>
                )}

                {status === 'error' && (
                    <div style={styles.buttonContainer}>
                        <button
                            onClick={() => navigate('/login')}
                            style={styles.button}
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ ...styles.button, background: 'transparent', color: '#666' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {code && (
                    <p style={styles.codeText}>
                        Code: <span style={styles.code}>{code.substring(0, 20)}...</span>
                    </p>
                )}
            </animated.div>
        </div>
    )
}

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '500px',
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center'
    },
    iconContainer: {
        marginBottom: '30px'
    },
    spinner: {
        width: '60px',
        height: '60px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
    },
    successIcon: {
        width: '60px',
        height: '60px',
        background: '#28a745',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        margin: '0 auto'
    },
    errorIcon: {
        width: '60px',
        height: '60px',
        background: '#dc3545',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        margin: '0 auto'
    },
    title: {
        margin: '0 0 15px 0',
        color: '#333',
        fontSize: '28px'
    },
    message: {
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '20px'
    },
    redirectText: {
        color: '#888',
        fontSize: '14px',
        fontStyle: 'italic'
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    button: {
        padding: '12px 24px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        minWidth: '120px'
    },
    codeText: {
        marginTop: '30px',
        color: '#888',
        fontSize: '12px',
        fontFamily: 'monospace'
    },
    code: {
        backgroundColor: '#f5f5f5',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: 'monospace'
    }
}