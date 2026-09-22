import { useState } from 'react';

export default function Login() {
    // Somewhat like Angular signals maybe?
    // formData is similar to using this.formData in Angular
    // setFormData is the function to be called when I want to change formData/update UI
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // Declare state for user feedback and loading indicator
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Change handler for all text inputs
    const handleChange = (e) => {
        setFormData({
            ...formData, // Spread operator, copies all existing fields
            [e.target.name]: e.target.value, // Updates only the field being typed into
        })
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        // Prevent full page reload
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // POST request to Express backend server
            const response = await fetch('http://localhost:9000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Successful login.');

                // Reset form fields
                setFormData({
                    username: '',
                    password: '',
                });
            } else {
                // Display error returned by backend
                setMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            setMessage('Network error. Express server might not be running.');
        } finally {
            // Disable loading state
            setLoading(false);
        }
    };

    // JSX render of markup
    return (
        <div className="login-card">
            <h2>Login to Account</h2>

            {/* Conditonally render feedback message */}
            {message && <p className="status-message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username" /* Needs to match state key */
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password" /* Needs to match state key */
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>
        </div>
    )
}