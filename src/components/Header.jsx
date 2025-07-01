import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useUserContext } from '../contexts/UserContext';
import SearchBar from './SearchBar';
import SignIn from './SignIn';
import DefaultAvatar from '../assets/avatar.png';
import Dropdown from '../assets/dropdown.svg';
import './styles/Header.css';

function Header({ openSignUp, showSignIn, toggleShowSignIn }) {
  const [userData, userLoading, fetchUser] = useUserContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    fetchUser();
    toast.success('Signed out successfully.');
  };

  const userBanner = userData && (
    <div className="Header-userBanner" onClick={() => setDropdownOpen(!dropdownOpen)} tabIndex={0} style={{ cursor: 'pointer' }}>
      <img className="Header-avatar" src={userData.avatarUrl || DefaultAvatar} alt={userData.username} />
      {userData.username}
      <img className="Header-dropdownIcon" src={Dropdown} alt="Dropdown" />
    </div>
  );

  return (
    <header className="Header">
      <Link to="/"><h1 className="Header-title">Stanboxd</h1></Link>
      {!showSignIn && (
        <div className="Header-controls">
          <ul className="Header-list">
            {userLoading && <li className="Header-loadingUser">Loading user data...</li>}
            {!userLoading && !userData && (
              <>
                <li><button onClick={toggleShowSignIn}>Sign in</button></li>
                <li><button onClick={openSignUp}>Create account</button></li>
              </>
            )}
            {!userLoading && userData && (
              <li className="Header-userContainer">
                {userBanner}
                {dropdownOpen && (
                  <div className="Header-dropdown">
                    <div className="Header-dropdownUser">{userBanner}</div>
                    <div className="Header-dropdownDivider" />
                    <Link to="/">Home</Link>
                    <Link to={`/member/${userData.uid}`}>Profile</Link>
                    <Link to={`/member/${userData.uid}/films`}>Films</Link>
                    <Link to={`/member/${userData.uid}/reviews`}>Reviews</Link>
                    <div className="Header-dropdownDivider" />
                    <Link to="/settings">Settings</Link>
                    <button type="button" onClick={handleSignOut}>Sign out</button>
                  </div>
                )}
              </li>
            )}
            <li><Link to="/films">Films</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/members">Members</Link></li>
          </ul>
          <SearchBar />
        </div>
      )}
      {showSignIn && <SignIn closePanel={toggleShowSignIn} />}
    </header>
  );
}

Header.propTypes = {
  openSignUp: PropTypes.func.isRequired,
  showSignIn: PropTypes.bool.isRequired,
  toggleShowSignIn: PropTypes.func.isRequired,
};

export default Header;