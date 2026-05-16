import { initFlowbite } from 'flowbite';
import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { CgDetailsMore } from 'react-icons/cg';
import { FaClock, FaSignOutAlt } from 'react-icons/fa';
import { MdBarChart } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { TfiAnnouncement } from "react-icons/tfi";
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { RiFileEditLine } from 'react-icons/ri';
import { GrCatalog } from 'react-icons/gr';

const Sidebar = ({ isFYPRegistered }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FypData, setFypData] = useState('');
  const [RegOpen, setRegOpen] = useState(false);

  useEffect(() => {
    if (isFYPRegistered?.length < 0) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isFYPRegistered]);

  useEffect(() => {
    setScrollbarPosition('Dashboard');
    initFlowbite();
  }, []);

  useEffect(() => {
    const userFypRegistration = JSON.parse(localStorage.getItem("FYPData"));
    setFypData(userFypRegistration);
  }, []);

  useEffect(() => {
    checkRegistrationOpen();
  }, []);

  const checkRegistrationOpen = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('key'));
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Safely extract term ID whether it's a plain string or populated object
      const term = user.term?._id || user.term;
      
      if (!term) {
        console.log("No term found for current user");
        setRegOpen(false);
        localStorage.setItem('RegistrationOpen', false);
        return;
      }
      
      console.log("Checking registration for term:", term);
      const response = await axios.get(`/api/CreateFypReg/GetFYPRegistrationOfTerm/${term}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Registration response:", response.data.registration);

      const dueDateTime = response.data.registration.dueDateTime;
      console.log("DueDate", dueDateTime);

      const dueDate = new Date(dueDateTime);
      const currentDate = new Date();

      console.log("DueDate Object", dueDate);
      console.log("CurrentDate Object", currentDate);

      if (response.data && response.data.registration && dueDate > currentDate) {
        console.log("Registration is OPEN");
        setRegOpen(true);
        localStorage.setItem('RegistrationOpen', true);
      } else {
        console.log("Registration is CLOSED");
        setRegOpen(false);
        localStorage.setItem('RegistrationOpen', false);
      }

      return response.data;
    } catch (error) {
      // 404 means no registration exists for this term — that's not an error, just no registration yet
      if (error.response && error.response.status === 404) {
        console.log("No FYP registration found for this term");
      } else {
        console.error('Error checking registration existence:', error);
      }
      setRegOpen(false);
      localStorage.setItem('RegistrationOpen', false);
      return false;
    }
  };

  console.log("Checking Reeeeeeeeeeeeggggggggggggiiiiiiiiiiiistration open", RegOpen);

  useEffect(() => {
    console.log("This is first rendered", isFYPRegistered);
  }, [isFYPRegistered]);

  const sidebarRef = useRef(null);

  const handleTabClick = (tabName) => {
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

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0 bg-primary shadow-2xl"
            aria-label="Sidebar"
            ref={sidebarRef}
          >
            <div className="h-full px-3 py-4">
              <Link to="/Dashboard" className="flex items-center justify-center ps-2.5 mb-2 w-full overflow-x-hidden relative">
                <img src="/assets/images/Sidebarlogo.png" className="h-40 w-40 me-3" alt="Cust Logo" />
                <div className="absolute bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
              </Link>

              <ul className="space-y-2 font-medium">
                <div className='ml-14'>
                  <li>
                    <NavLink
                      to="/Profile"
                      onClick={() => handleTabClick('Profile')}
                      className={({ isActive }) =>
                        isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                      }
                      data-tab="Profile"
                    >
                      <CgProfile className={`flex-shrink-0 w-7 h-7`} />
                      <span className={`ms-3`}>Profile</span>
                    </NavLink>
                  </li>
                </div>
                <div className="bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
                <li>
                  <NavLink
                    to="/Dashboard"
                    onClick={() => handleTabClick('Dashboard')}
                    className={({ isActive }) =>
                      isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                    }
                    data-tab="Dashboard"
                  >
                    <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                    <span className={`ms-3`}>Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  {((RegOpen === true || (FypData && (FypData.reqStatus === "pending" || FypData.reqStatus === "rejected" || FypData.reqStatus === "partial-deny"))) && (!FypData || FypData.reqStatus !== "approved")) ? (
                    <NavLink
                      to="/FYPRegistration"
                      onClick={() => handleTabClick('FYP Registration')}
                      className={({ isActive }) =>
                        isActive
                          ? 'flex items-center p-3 rounded-lg bg-white text-primary'
                          : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                      }
                      data-tab="FYPRegistration"
                    >
                      <MdBarChart className={`flex-shrink-0 w-7 h-7`} />
                      <span className={`ms-3`}>FYP Registration</span>
                    </NavLink>
                  ) : null}
                </li>

                {isFYPRegistered && (
                  <>
                    <li>
                      <NavLink
                        to="/StudentProjectDetails"
                        onClick={() => handleTabClick('StudentProjectDetails')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="StudentProjectDetails"
                      >
                        <CgDetailsMore className={`flex-shrink-0 w-7 h-7`} />
                        <span className={`ms-3`}>My Project/Thesis</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/Request"
                        onClick={() => handleTabClick('Request')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="Request"
                      >
                        <RiFileEditLine className={`flex-shrink-0 w-7 h-7`} />
                        <span className={`ms-3`}>Request</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/CourseCatalog"
                        onClick={() => handleTabClick('Course Catalog')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CourseCatalog"
                      >
                        <GrCatalog className={`flex-shrink-0 w-7 h-6`} />
                        <span className={`ms-3`}>Course Catalog</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/Timetable"
                        onClick={() => handleTabClick('Timetable')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="Timetable"
                      >
                        <FaClock className={`flex-shrink-0 w-7 h-7`} />
                        <span className={`ms-3`}>Timetable</span>
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    to="/Announcement"
                    onClick={() => handleTabClick('Announcement')}
                    className={({ isActive }) =>
                      isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                    }
                    data-tab="Announcement"
                  >
                    <TfiAnnouncement className={`flex-shrink-0 w-7 h-7`} />
                    <span className={`ms-3`}>Announcement</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/Logout"
                    onClick={() => {
                      handleTabClick('Logout');
                    }}
                    className={({ isActive }) =>
                      isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                    }
                    data-tab="Logout"
                  >
                    <FaSignOutAlt className={`flex-shrink-0 w-7 h-7`} />
                    <span className={`ms-3`}>Logout</span>
                  </NavLink>
                </li>
              </ul>
              <div id="scroll-indicator" className="absolute top-0 right-0 w-2 h-11 bg-secondary transition duration-300 ease-out"></div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
