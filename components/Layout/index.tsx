import Header from './Header';
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
     {/* {<Foot />} */}

      
    </>
  );
};

export default Layout;
