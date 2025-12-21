import { useState } from 'react'
import AuthPage from './components/AuthPage'
import MainMenu from './components/MainMenu'

function App() {
    // 1. State: Are we logged in? (Starts false)
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