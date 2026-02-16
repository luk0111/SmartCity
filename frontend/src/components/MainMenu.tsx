import { type UserData } from "../App";

interface MainMenuProps {
    user: UserData;
    onLogout: () => void;
}

export default function MainMenu({ user, onLogout }: MainMenuProps) {
    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
            <h1>SmartCity Dashboard</h1>
            <h2>Welcome, {user.username}!</h2>

            <p>
                Access level: Citizen<br/>
                Email: {user.email}
            </p>

            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={cardStyle}>🚦 Traffic Systems</div>
                <div style={cardStyle}>⚡ Energy Consumption</div>
                <div style={cardStyle}>📢 Public Services</div>
                <div style={cardStyle}>🚑 Emergency Alerts</div>
            </div>

            <button onClick={onLogout} style={logoutButtonStyle}>Logout</button>
        </div>
    )
}

const cardStyle = {
    border: '1px solid #ccc', padding: '20px', borderRadius: '8px',
    background: '#f9f9f9', fontSize: '1.2rem', cursor: 'pointer'
};

const logoutButtonStyle = {
    marginTop: '50px', padding: '10px 20px', background: '#dc3545',
    color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
};