import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    setAccount(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('account');
  };

  // Lấy user từ localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Lấy token từ localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Lấy account từ localStorage
  const [account, setAccount] = useState(() => {
    const storedAccount = localStorage.getItem('account');
    return storedAccount ? JSON.parse(storedAccount) : null;
  });

  // Cập nhật localStorage khi user thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Cập nhật localStorage khi token thay đổi
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Cập nhật localStorage khi account thay đổi
  useEffect(() => {
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    } else {
      localStorage.removeItem('account');
    }
  }, [account]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, account, setAccount, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
