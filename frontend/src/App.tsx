import { useState, useEffect } from 'react'
import AuthPage from './components/AuthPage'
import SignUp from './components/Signup'
import MainMenu from './components/MainMenu'
import VerificationPage from './components/VerificationPage'

function App() {
    const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'menu' | 'verify'>('login')
    const [verificationCode, setVerificationCode] = useState<string | null>(null)

    useEffect(() => {
        // 1. Manually check if the user is visiting the verification link
        const path = window.location.pathname
        if (path === '/verify') {
            const params = new URLSearchParams(window.location.search)
            const code = params.get('code')
            if (code) {
                setVerificationCode(code)
                setCurrentPage('verify')
            }
        }
    }, [])

    const handleVerificationComplete = () => {
        // Clean the URL bar so it looks nice
        window.history.pushState({}, "", "/")
        setCurrentPage('login')
    }

    return (
        <div>
            {currentPage === 'login' && (
                <AuthPage
                    onLoginSuccess={() => setCurrentPage('menu')}
                    onSignupClick={() => setCurrentPage('signup')}
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

            {currentPage === 'menu' && (
                <MainMenu />
            )}
        </div>
    )
}

export default App