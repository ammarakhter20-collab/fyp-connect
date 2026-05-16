// Layout.jsx
// import React, { useEffect, useState } from 'react';
import Sidebar from './CoodSidebar';
import Header from './CoodHeader';

const Layout = ({children, AdmData}) => {


  return (
    <>
   
      <Sidebar />
      <div className="flex flex-col flex-grow overflow-hidden">
      <Header AdmData />
        <main className="flex-grow overflow-x-hidden overflow-y-auto p-6 pt-0" style={{ marginLeft: '14.5rem', marginRight: '-1.75rem', marginTop: '6.875rem', marginBottom: '-1.5625rem'}}>
          {children}
        </main>
      </div>
    {/* </div> */}
    </>
  );
};


export default Layout;

