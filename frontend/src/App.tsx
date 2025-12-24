import { useState } from 'react'
import AuthPage from './components/AuthPage'
import SignUp from './components/Signup'
import MainMenu from './components/MainMenu'

function App() {
    // State to track which page is active: 'login', 'signup', or 'menu'
    const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'menu'>('login')

    return (
        <div>
            {/* LOGIC: Which component to show? */}

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

            {currentPage === 'menu' && (
                <MainMenu />
            )}
        </div>
    )
}

export default App