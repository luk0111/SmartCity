import { useState } from 'react'
import { useSpring, useTransition, animated } from '@react-spring/web'
import signupImage from '../assets/signupbackground.jpg'

interface SignupProps {
    onBackToLogin: () => void
}

export default function Signup({ onBackToLogin }: SignupProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('Male')
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(50px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 50, friction: 15 },
        delay: 200
    })

    const skyDrop = useSpring({
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0%)' },
        config: { tension: 30, friction: 20 },
        delay: 100
    })

    const errorTransitions = useTransition(error, {
        from: { opacity: 0, transform: 'translateY(10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0 },
        config: { tension: 220, friction: 20 }
    })

    const handleSignup = async (e: React.MouseEvent) => {

        e.preventDefault()

        setError('')
        setSuccessMsg('')

        if (!username || !password || !email) {
            setError("Please fill in all fields")
            return
        }


        setIsLoading(true)

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, gender })
            })

            const result = await response.text()

            if (result.includes("Signup Success")) {
                setSuccessMsg("Success! Please check your email to verify.")
            } else {
                setError(result)
            }
        } catch (err) {
            console.error("Signup Error:", err)
            setError("Connection Failed - Check Backend Console")
        } finally {

            setIsLoading(false)
        }
    }

    return (
        <div style={styles.pageContainer}>
            <animated.img
                src={signupImage}
                style={{ ...styles.bgImage, ...skyDrop }}
                alt="Sky Background"
            />

            <animated.div style={{ ...styles.card, ...fadeIn }}>
                <h1 style={styles.title}>Join SmartCity</h1>
                <p style={styles.subtitle}>Create your new account</p>

                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} style={styles.input} />
                <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.select}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={styles.input} />


                <button
                    onClick={handleSignup}
                    disabled={isLoading} // Can't click twice
                    style={{
                        ...styles.button,
                        background: isLoading ? '#ccc' : '#28a745', // Turn grey if loading
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? "Creating Account..." : "Register Account"}
                </button>

                <button onClick={onBackToLogin} style={{ ...styles.secondaryButton, marginTop: '10px' }}>Back to Login</button>

                {errorTransitions((style, item) => item ? <animated.p style={{ ...styles.errorText, ...style }}>{item}</animated.p> : null)}
                {successMsg && <p style={styles.successText}>{successMsg}</p>}
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
    bgImage: {
        position: 'absolute' as const, top: 0, left: 0, width: '100vw', height: '50vh',
        objectFit: 'cover' as const, objectPosition: 'top', zIndex: 0, opacity: 0.87, pointerEvents: 'none' as const
    },
    card: {
        position: 'relative' as const, background: 'white', padding: '40px',
        borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '500px', height: '550px', display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', textAlign: 'center' as const, zIndex: 10
    },
    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { margin: '0 0 30px 0', color: '#666', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' },
    errorText: {
        color: '#ff4d4f', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
        position: 'absolute' as const, bottom: '60px', left: 0, right: 0, textAlign: 'center' as const, zIndex: 10
    },
    successText: {
        color: '#28a745', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold',
        position: 'absolute' as const, bottom: '20px', left: 0, right: 0, textAlign: 'center' as const, zIndex: 10
    },
    input: {
        width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '6px',
        border: '1px solid #ddd', boxSizing: 'border-box' as const, fontSize: '1rem', fontFamily: 'Arial, sans-serif'
    },
    select: {
        width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '6px',
        border: '1px solid #ddd', boxSizing: 'border-box' as const, fontSize: '1rem', fontFamily: 'Arial, sans-serif', cursor: 'pointer',  color: "#666"
    },
    button: {
        width: '100%', padding: '12px', background: '#28a745', color: 'white',
        border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    },
    secondaryButton: {
        width: '100%', padding: '12px', background: 'transparent', color: '#666',
        border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial, sans-serif'
    }
}