import Header from './Header';
import Footer from './Footer';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();
  return (
    <>
    
     <Header />
      {children}
     <Footer />

      
    </>
  );
};

export default Layout;
