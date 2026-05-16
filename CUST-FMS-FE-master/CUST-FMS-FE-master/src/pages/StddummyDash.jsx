import { initFlowbite } from 'flowbite';
import React, { useEffect, useState, useRef } from 'react';
import { IoMdHome } from "react-icons/io";
import { CgDetailsMore } from "react-icons/cg";
import { IoPersonSharp } from "react-icons/io5";
import { MdOutlineTask } from "react-icons/md";
import { FaRocketchat } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { MdBarChart } from "react-icons/md";

const Sidebar = () => {
  useEffect(() => {
    initFlowbite();
    setScrollbarPosition("Dashboard");
  }, []);

  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const sidebarRef = useRef(null);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setScrollbarPosition(tabName);
  };

  const setScrollbarPosition = (tabName) => {
    const sidebar = sidebarRef.current;
    const indicator = sidebar.querySelector('#scroll-indicator');

    if (indicator) {
      const selectedTab = sidebar.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  };

  return (
    <>
      <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar" ref={sidebarRef}>
        <div className="h-full px-3 py-4 bg-primary  ">
          <a href="#" className="flex items-center justify-center ps-2.5 mb-5 w-full overflow-x-hidden relative">
            <img src="/assets/images/Sidebarlogo.png" className="h-40 w-40 me-3" alt="Cust Logo" />
            <div className="absolute bottom-0 w-full left-0 right-0 border-b border-white"></div>
          </a>

          <ul className="space-y-2 font-medium">
            <li>
              <a href="/Dashboard" onClick={() => handleTabClick("Dashboard")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Dashboard">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Dashboard" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <IoMdHome />
                </svg>
                <span className={`ms-3 ${selectedTab === "Dashboard" ? 'text-white' : 'text-gray-400'}`}>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/FYPRegistration" onClick={() => handleTabClick("FYP Registration")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="FYP Registration">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "FYP Registration" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <IoMdHome />
                </svg>
                <span className={`ms-3 ${selectedTab === "FYP Registration" ? 'text-white' : 'text-gray-400'}`}>FYP Registration</span>
              </a>
            </li>
            <li>
              <a href="/ProjectDetails" onClick={() => handleTabClick("Project Details")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Project Details">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Project Details" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < CgDetailsMore />
                </svg>
                <span className={`ms-3 ${selectedTab === "Project Details" ? 'text-white' : 'text-gray-400'}`}>Project Details</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleTabClick("Request")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Request">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Request" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < IoPersonSharp />
                </svg>
                <span className={`ms-3 ${selectedTab === "Request" ? 'text-white' : 'text-gray-400'}`}>Request</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleTabClick("Assigned Tasks")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Assigned Tasks">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Assigned Tasks" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < MdOutlineTask />
                </svg>
                <span className={`ms-3 ${selectedTab === "Assigned Tasks" ? 'text-white' : 'text-gray-400'}`}>Assigned Tasks</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleTabClick("Chat & Call")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Chat & Call">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Chat & Call" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < FaRocketchat />
                </svg>
                <span className={`ms-3 ${selectedTab === "Chat & Call" ? 'text-white' : 'text-gray-400'}`}>Chat & Call</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleTabClick("Timetable")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Timetable">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Timetable" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < FaBusinessTime />
                </svg>
                <span className={`ms-3 ${selectedTab === "Timetable" ? 'text-white' : 'text-gray-400'}`}>Timetable</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleTabClick("Logout")} className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`} data-tab="Logout">
                <svg className={`flex-shrink-0 w-7 h-7 text-gray-400 transition duration-75   group-hover:text-gray-900   ${selectedTab === "Logout" ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  < IoMdLock />
                </svg>
                <span className={`ms-3 ${selectedTab === "Logout" ? 'text-white' : 'text-gray-400'}`}>Logout</span>
              </a>
            </li>


          </ul>

          {/* Scroll indicator */}
          <div id="scroll-indicator" className="absolute top-0 right-0 w-2 h-11 bg-secondary transition duration-300 ease-out"></div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
