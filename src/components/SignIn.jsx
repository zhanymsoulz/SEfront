import { useState } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import './styles/SignIn.css';
import { useUserContext } from '../contexts/UserContext';

function SignIn({ closePanel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [, , fetchUser] = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    toast.dismiss();

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      localStorage.setItem('token', data.token);
      toast.success('Logged in successfully.');
      await fetchUser();
      closePanel();
    } catch (err) {
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={`SignIn ${showError ? 'SignIn--error' : ''}`} onSubmit={handleSubmit}>
      <button className="SignIn-close" type="button" onClick={closePanel}>×</button>
      <div className="SignIn-inputContainer">
        <label htmlFor="signin-username">Username</label>
        <input id="signin-username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="SignIn-inputContainer">
        <label htmlFor="signin-password">Password</label>
        <input type="password" id="signin-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" disabled={isLoading} className="SignIn-button">Sign in</button>
      {showError && <div className="SignIn-error">Invalid username or password</div>}
    </form>
  );
}

SignIn.propTypes = { closePanel: PropTypes.func.isRequired };
export default SignIn;