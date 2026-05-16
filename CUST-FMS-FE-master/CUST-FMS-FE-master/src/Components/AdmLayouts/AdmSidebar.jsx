import { initFlowbite } from 'flowbite';
import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Import NavLink from react-router-dom
import { IoMdHome } from 'react-icons/io';
import { CgDetailsMore } from 'react-icons/cg';
import { IoPersonSharp } from 'react-icons/io5';
import { MdOutlineTask } from 'react-icons/md';
import { FaBook, FaBuilding, FaChalkboardTeacher, FaRocketchat, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { FaBusinessTime } from 'react-icons/fa';
import { IoMdLock } from 'react-icons/io';
import { MdBarChart } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { TfiAnnouncement } from "react-icons/tfi";


import login from '../../pages/StdLogin';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();
  useEffect(() => {

    initFlowbite();
    setScrollbarPosition('Dashboard');
  }, []);



  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const sidebarRef = useRef(null);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setScrollbarPosition(tabName);
  };

  const setScrollbarPosition = (tabName) => {
    const sidebar = sidebarRef.current;
    const indicator = sidebar ? sidebar.querySelector('#scroll-indicator') : null;

    if (indicator) {
      const selectedTab = sidebar.querySelector(`[data-tab="${tabName}"]`);

      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  };

  const LogoutFunc = () => {
    localStorage.removeItem('key');
    localStorage.removeItem('user');
  
  }




  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0 bg-primary shadow-2xl"
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 py-4">
          <Link to="/" className="flex items-center justify-center ps-2.5 mb-2 w-full overflow-x-hidden relative">
            <img src="/assets/images/Sidebarlogo.png" className="h-40 w-40 me-3" alt="Cust Logo" />
            <div className="absolute bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
          </Link>

          <ul className="space-y-2 font-medium">
            <div className='ml-14'>

            <li>
              <NavLink
                to="/AdmProfile"
                onClick={() => handleTabClick('AdmProfile')}
                className={({ isActive }) =>
                isActive? 'flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
  }
                // className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`}
                data-tab="AdmProfile"
              >
                <CgProfile 
 className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>My Profile</span>
              </NavLink>
            </li>
            </div>
            <div className="bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
            <li>
              <NavLink
                to="/AdmDashboard"
                onClick={() => handleTabClick('AdmDashboard')}
                className={({ isActive }) =>
                isActive? 'flex items-center p-3 rounded-lg bg-primary bg-opacity-10 text-primary': 'flex items-center p-3 rounded-lg text-gray-500 hover:bg-gray-50'
  }
                // className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`}
                data-tab="AdmDashboard"
              >
                  <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Dashboard</span>
              </NavLink>
            </li>
            {/* {!isFYPRegistered && ( */}
            <li>
              <NavLink
                to="/AdmFYPSessionTerm"
                onClick={() => handleTabClick('AdmFYPSessionTerm')}
                className={({ isActive, isPending }) =>
                isActive? 'relative flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
}
                data-tab="AdmFYPSessionTerm"
              >
              <MdBarChart className={`flex-shrink-0 w-7 h-7`} />
              <span className={`ms-3`}>FYP Session Term</span>                  
              </NavLink>
            </li>
            {/* )} */}
           
              <>
            <li>
              <NavLink
                to="/AdmFacultyCreate"
                onClick={() => handleTabClick('AdmFacultyCreate')}
                className={({ isActive, isPending }) =>
                isActive? 'relative flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
}
                data-tab="AdmFacultyCreate"
              >
              <FaChalkboardTeacher className={`flex-shrink-0 w-7 h-7`} />
              <span className={`ms-3`}>Faculty</span>                  
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/AdmCreateStudent"
                onClick={() => handleTabClick('AdmCreateStudent')}
                className={({ isActive, isPending }) =>
                isActive? 'relative flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
}
                data-tab="AdmCreateStudent"
              >
              <FaUserPlus className={`flex-shrink-0 w-7 h-7`} />
              <span className={`ms-3`}>Student</span>                  
              </NavLink>
            </li>




            <li>
              <NavLink
                to="/AdmCreateDepartment"
                onClick={() => handleTabClick('AdmCreateDepartment')}
                className={({ isActive, isPending }) =>
                isActive? 'relative flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
}
                data-tab="AdmCreateDepartment"
              >
              <FaBuilding className={`flex-shrink-0 w-7 h-6`} />
              <span className={`ms-3`}>Department</span>                  
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/AdmProgramCreate"
                onClick={() => handleTabClick('AdmProgramCreate')}
                className={({ isActive, isPending }) =>
                isActive? 'relative flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
}
                data-tab="AdmProgramCreate"
              >
              <FaBook className={`flex-shrink-0 w-7 h-6`} />
              <span className={`ms-3`}>Program</span>                  
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/Logout"
                onClick={() => handleTabClick('Logout')}
                className={({ isActive }) =>
                isActive? 'flex items-center p-3 rounded-lg bg-white text-primary ': 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
  }
                data-tab="AdmLogout"
              >
              <FaSignOutAlt className={`flex-shrink-0 w-7 h-7`} />
              <span className={`ms-3`}>Logout</span>                  
              </NavLink>
            </li>


           


            
            </>
            
           

            {/* ... repeat the above pattern for other navigation links */}
          </ul>

          <div id="scroll-indicator" className="absolute top-0 right-0 w-2 h-11 bg-secondary transition duration-300 ease-out"></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
