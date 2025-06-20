/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { login } from '../firebase';
import './styles/SignIn.css';

function SignIn({ closePanel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  //  const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setShowError(false);
  //   toast.dismiss();

  //   try {
  //     await login(email, password);
  //     closePanel();
  //     toast.success('Logged in successfully.');
  //   } catch (error) {
  //     setShowError(true);
  //   }

  //   setIsLoading(false);
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setShowError(false);
  toast.dismiss();

  try {
    
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) throw new Error('Invalid credentials');

    const data = await response.json();
const token = data.token;
localStorage.setItem('token', token);


    toast.success('Logged in successfully.');
    closePanel();
  } catch (error) {
    console.error('Login error:', error);
    setShowError(true);
  }

  setIsLoading(false);
};


  return (
    <form
      className={`SignIn ${showError && 'SignIn--error'}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <button className="SignIn-close" type="button" onClick={closePanel}>
        ×
      </button>
      <div className="SignIn-inputContainer">
        <label htmlFor="signin-username">Username</label>
        <input
  type="text"
  name="username"
  id="signin-username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
      </div>
      <div className="SignIn-inputContainer">
        <div className="SignIn-inputContainerTop">
          <label htmlFor="signin-password">Password</label>
          <Link to="/user/request-password">
            <p className="SignIn-forgotten">Forgotten?</p>
          </Link>
        </div>
        <input
          type="password"
          name="password"
          id="signin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`SignIn-button && ${isLoading && 'SignIn-button--disabled'}`}
      >
        Sign in
      </button>
      {showError && (
        <div className="SignIn-error">
          Your credentials don’t match. It’s probably attributable to human
          error.
        </div>
      )}
    </form>
  );
}

SignIn.propTypes = {
  closePanel: PropTypes.func.isRequired,
};

export default SignIn;
