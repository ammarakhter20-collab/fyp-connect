// Layout.jsx
// import React, { useEffect, useState } from 'react';
import Sidebar from './StdSidebar';
import Header from './StdHeader';

const Layout = ({ children, isFYPRegistered  }) => {


  return (
    <>
    {/* <div className="container mx-auto lg:mx-auto xl:mx-auto max-w-7xl px-8"> */}
      <Sidebar isFYPRegistered={isFYPRegistered}/>
      <div className="flex flex-col flex-grow overflow-hidden">
      <Header />
        <main className="flex-grow overflow-x-hidden overflow-y-auto   p-6 pt-0" style={{ marginLeft: '14.5rem', marginRight: '-1.75rem', marginTop: '6.875rem', marginBottom: '-1.5625rem'}}>
          {children}
        </main>
      </div>
    {/* </div> */}
    </>
  );
};

export default Layout;
