import { useState, useEffect } from 'react'
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
    const [resetToken, setResetToken] = useState<string | null>(null) // State for the reset token
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

    return (
        <div>
            {currentPage === 'login' && (
                <AuthPage
                    onLoginSuccess={handleLoginSuccess}
                    onSignupClick={() => setCurrentPage('signup')}
                    onForgotPasswordClick={() => setCurrentPage('forgot-password')} // Wire up the new button
                />
            )}

            {currentPage === 'signup' && (
                <SignUp
                    onBackToLogin={() => setCurrentPage('login')}
                />
            )}

            {currentPage === 'verify' && (
                <VerificationPage
                    code={verificationCode}
                    onVerificationComplete={handleVerificationComplete}
                />
            )}

            {currentPage === 'forgot-password' && (
                <ForgotPassword
                    onBackToLogin={() => setCurrentPage('login')}
                />
            )}

            {currentPage === 'reset-password' && (
                <ResetPassword
                    token={resetToken}
                    onResetComplete={handleResetComplete}
                />
            )}

            {currentPage === 'menu' && currentUser && (
                <MainMenu user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    )
}

export default App