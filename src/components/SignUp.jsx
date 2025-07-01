import { useState } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import checkUsernameValidity from '../utils/checkUsernameValidity';
import './styles/SignUp.css';

function SignUp({ closePanel }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.activeElement.blur();
    toast.dismiss();

    const emptyFields = [];
    if (!email) emptyFields.push('email');
    if (!username) emptyFields.push('username');
    if (!password) emptyFields.push('password');

    if (emptyFields.length) {
      emptyFields.forEach((field) => toast.error(`Please complete your ${field}.`));
      return;
    }

    try {
      checkUsernameValidity(username);
    } catch (error) {
      toast.error(error.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Registration failed.');
        return;
      }

      toast.success('Registration successful!');
      closePanel();
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirects to Spring Security's default Google OAuth2 login endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <form className="SignUp" onSubmit={handleSubmit} noValidate>
      <div className="SignUp-header">
        <p className="SignUp-title">Join Stanboxd</p>
        <button className="SignUp-close" type="button" onClick={closePanel}>×</button>
      </div>

      <div className="SignUp-inputContainer">
        <label htmlFor="signup-email">Email address</label>
        <input
          className="wide"
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="SignUp-inputContainer">
        <label htmlFor="signup-username">Username</label>
        <input
          type="text"
          id="signup-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="SignUp-inputContainer">
        <label htmlFor="signup-password">Password</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className={`SignUp-submit ${isSubmitting ? 'disabled' : ''}`}
        type="submit"
        disabled={isSubmitting}
      >
        Sign up
      </button>

      <div className="SignUp-google">
        <p>Or sign up with:</p>
          <button type="button" className="google-button" onClick={handleGoogleSignIn}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
            Sign up with Google
          </button>
      </div>
    </form>
  );
}

SignUp.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default SignUp;
