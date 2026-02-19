import { useState, useEffect } from 'react'
import { animated, useTransition } from "@react-spring/web"
import AuthPage from './components/AuthPage'
import SignUp from './components/Signup'
import MainMenu from './components/MainMenu'
import VerificationPage from './components/VerificationPage'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

export interface UserData {
    username: string;
    email: string;
}

type PageState = 'login' | 'signup' | 'menu' | 'verify' | 'forgot-password' | 'reset-password'

function App() {
    const [currentPage, setCurrentPage] = useState<PageState>('login')
    const [verificationCode, setVerificationCode] = useState<string | null>(null)
    const [resetToken, setResetToken] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)

    useEffect(() => {
        const path = window.location.pathname

        if (path === '/verify') {
            const params = new URLSearchParams(window.location.search)
            const code = params.get('code')
            if (code) {
                setVerificationCode(code)
                setCurrentPage('verify')
            }
        }

        if (path === '/reset-password') {
            const params = new URLSearchParams(window.location.search)
            const token = params.get('token')
            if (token) {
                setResetToken(token)
                setCurrentPage('reset-password')
            }
        }
    }, [])

    const handleVerificationComplete = () => {
        window.history.pushState({}, "", "/")
        setCurrentPage('login')
    }

    const handleResetComplete = () => {
        window.history.pushState({}, "", "/")
        setResetToken(null)
        setCurrentPage('login')
    }

    const handleLoginSuccess = (user: UserData) => {
        setCurrentUser(user)
        setCurrentPage('menu')
    }

    const handleLogout = () => {
        setCurrentUser(null)
        setCurrentPage('login')
    }

    const transitions = useTransition(currentPage, {
        from: { opacity: 0, transform: 'scale(1.05)', filter: 'blur(10px)' },
        enter: { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
        leave: { opacity: 0, transform: 'scale(0.95)', filter: 'blur(10px)' },
        config: { tension: 280, friction: 30 },
    })

    return (
        <div style={{ display: 'grid', backgroundColor: '#000', minHeight: '100vh', overflowX: 'hidden' }}>
            {transitions((style, item) => (
                <animated.div style={{ ...style, gridArea: '1 / 1', width: '100%', minHeight: '100vh' }}>

                    {item === 'login' && (
                        <AuthPage
                            onLoginSuccess={handleLoginSuccess}
                            onSignupClick={() => setCurrentPage('signup')}
                            onForgotPasswordClick={() => setCurrentPage('forgot-password')}
                        />
                    )}

                    {item === 'signup' && (
                        <SignUp onBackToLogin={() => setCurrentPage('login')} />
                    )}

                    {item === 'verify' && (
                        <VerificationPage
                            code={verificationCode}
                            onVerificationComplete={handleVerificationComplete}
                        />
                    )}

                    {item === 'forgot-password' && (
                        <ForgotPassword
                            onBackToLogin={() => setCurrentPage('login')}
                        />
                    )}

                    {item === 'reset-password' && (
                        <ResetPassword
                            token={resetToken}
                            onResetComplete={handleResetComplete}
                        />
                    )}

                    {item === 'menu' && currentUser && (
                        <MainMenu user={currentUser} onLogout={handleLogout} />
                    )}

                </animated.div>
            ))}
        </div>
    )
}

export default App