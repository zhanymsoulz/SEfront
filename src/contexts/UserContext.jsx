import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(null);
export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUserData(null);
      setUserLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUserData({ uid: data.id, username: data.username, avatarUrl: data.avatarUrl || null });
    } catch {
      setUserData(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = useMemo(() => [userData, userLoading, fetchUser], [userData, userLoading]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = { children: PropTypes.node.isRequired };
export default UserProvider;