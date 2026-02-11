import { useState, useEffect } from 'react'
import AuthPage from './components/AuthPage'
import SignUp from './components/Signup'
import MainMenu from './components/MainMenu'
import VerificationPage from './components/VerificationPage'

export interface UserData {
    username: string;
    email: string;
}

function App() {
    const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'menu' | 'verify'>('login')
    const [verificationCode, setVerificationCode] = useState<string | null>(null)

    // NEW: Store the current user
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
    }, [])

    const handleVerificationComplete = () => {
        window.history.pushState({}, "", "/")
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
                    onLoginSuccess={handleLoginSuccess} // Pass the new handler
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

            {currentPage === 'menu' && currentUser && (
                // Pass user data to the dashboard
                <MainMenu user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    )
}

export default App