import { useState } from 'react'
import AuthPage from './components/AuthPage'
import MainMenu from './components/MainMenu'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <div>
            {/* 2. The Switch Logic */}
            {isLoggedIn ? (
                <MainMenu />
            ) : (
                // CRITICAL: We must pass this function so AuthPage can call it!
                <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </div>
    )
}

export default App