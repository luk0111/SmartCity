import { useState } from 'react'
import AuthPage from './components/AuthPage'
import MainMenu from './components/MainMenu'
import SignUp from './components/Signup'


function App() {
    const [currentView, setCurrentView] = useState('login')

    return (
        <div>
            {currentView === 'main' && (
                <MainMenu />
            )}

            {currentView === 'login' && (
                <AuthPage
                    onLoginSuccess={() => setCurrentView('main')}
                    onSignupClick={() => setCurrentView('signup')}
                />
            )}

            {currentView === 'signup' && (
                <SignUp
                    onBackToLogin={() => setCurrentView('login')}
                />
            )}
        </div>
    )
}

export default App