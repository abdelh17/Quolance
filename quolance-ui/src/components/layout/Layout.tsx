import * as React from 'react';

import Header from './Header'; // Adjust the path according to your project structure

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header /> {/* Include the Header here */}
      <main>{children}</main> {/* Main content goes here */}
    </>
  );
}
