import React from 'react';

// 1. Define the "Shape" of the props this component accepts
interface SignupProps {
    onBackToLogin: () => void;
}

// 2. Pass the interface to React.FC<SignupProps>
// 3. Destructure { onBackToLogin } from the arguments
const SignUp: React.FC<SignupProps> = ({ onBackToLogin }) => {

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Create Account</h1>

            {/* We will add the inputs here in the next step */}
            <p>Sign up form goes here.</p>

            <button onClick={() => alert("Registration not ready yet!")}>
                Register
            </button>

            <div style={{ marginTop: '20px' }}>
                {/* 4. Now this button works because we declared the prop! */}
                <button onClick={onBackToLogin}>
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default SignUp;