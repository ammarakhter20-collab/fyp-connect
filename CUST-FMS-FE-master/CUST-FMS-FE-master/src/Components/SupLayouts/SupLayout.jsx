// Layout.jsx
import React from 'react';
import Sidebar from './SupSidebar';
import Header from './SupHeader';

const Layout = ({ children }) => {
  return (
    <>
    <div className=''>
      <Sidebar />
    </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <Header />
        <main className="flex-grow overflow-x-hidden h-full overflow-y-auto p-6 pt-0" style={{ marginLeft: '232px', marginRight: '-28px', marginTop: '110px', marginBottom: '-25px'}}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
