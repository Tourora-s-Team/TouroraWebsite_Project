// components/Layout.js
import React from 'react';
import Header from './header/Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;