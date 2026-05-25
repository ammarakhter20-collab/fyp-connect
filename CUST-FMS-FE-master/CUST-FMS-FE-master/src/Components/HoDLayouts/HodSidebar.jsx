import { initFlowbite } from 'flowbite';
import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import { IoMdHome } from 'react-icons/io';
import { CgDetailsMore, CgWebsite } from 'react-icons/cg';
import { IoPersonSharp } from 'react-icons/io5';
import { MdOutlineTask } from 'react-icons/md';
import { FaChartPie, FaClock, FaFileAlt, FaPencilRuler, FaPlusCircle, FaRocketchat, FaTasks } from 'react-icons/fa';
import { TfiAnnouncement } from 'react-icons/tfi';
import { RiFileEditLine } from 'react-icons/ri';
import { FaBusinessTime } from 'react-icons/fa';
import { IoMdLock } from 'react-icons/io';
import { MdBarChart } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { RiFeedbackLine } from "react-icons/ri";
import { Dropdown } from "flowbite-react";


import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { IoIosPeople } from "react-icons/io";
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import { BsBarChart } from "react-icons/bs";
import { GrCatalog, GrTechnology } from 'react-icons/gr';
import { BiCategory } from 'react-icons/bi';
import { TiThList } from 'react-icons/ti';



const Sidebar = () => {



  const [selectedItem, setSelectedItem] = useState('');
  // Initialize isOpen state with keys for each dropdown
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownStates, setDropdownStates] = useState({
  
    supervisionDropdown: true,
    projectsDropdown: true,
    examsDropdown: true,

  });

  // const toggleDropdown = (dropdownId) => {
  //   // Use the dropdownId to toggle the specific dropdown
  //   setIsOpen((prevState) => ({
  //     ...prevState,
  //     [dropdownId]: !prevState[dropdownId]
  //   }));
  // };

  const toggleDropdown = (dropdownId) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [dropdownId]: !prevState[dropdownId],
    }));
  };





  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

















  useEffect(() => {
    initFlowbite();
    setScrollbarPosition('HoDDashboard');
  }, []);

  const [selectedTab, setSelectedTab] = useState('CoodDashboard');
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




  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0 bg-primary"
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 py-4">
          <Link to="/" className="flex items-center justify-center ps-2.5 mb-5 w-full overflow-x-hidden relative">
            <img src="/assets/images/Sidebarlogo.png" className="h-40 w-40 me-3" alt="Cust Logo" />
            <div className="absolute bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/HoDProfile"
                onClick={() => handleTabClick('HoDProfile')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                // className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`}
                data-tab="CoodProfile"
              >
                <CgProfile
                  className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}> My Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/HoDDashboard" 
                onClick={() => handleTabClick('HoDDashboard')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDDashboard"
              >
                <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Dashboard</span>
              </NavLink>
            </li>




            <li>
              <NavLink
                to="/HoDCourseCatalog"
                onClick={() => handleTabClick('HoDCourseCatalog')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDCourseCatalog"
              >
                <GrCatalog className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Course Catalog</span>
              </NavLink>
            </li>
  

            <li>
      <div className="dropdown">
        <div
          onClick={() => toggleDropdown('projectsDropdown')}
          className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
        >
          <BsBarChart className="flex-shrink-0 w-7 h-7" />
          <span className="flex items-center justify-between flex-1">
            <span className="ms-3">Projects</span>
            <svg
              className={`w-4 h-4 transform ${dropdownStates.projectsDropdown ? 'rotate-180' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </span>
        </div>

        {dropdownStates.projectsDropdown && (
          <ul className="space-y-2 font-medium ms-3">
            <li>
              <NavLink
                to="/HoDTechnology"
                onClick={() => handleTabClick('HoDTechnology')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDTechnology"
              >
                <GrTechnology className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Technology</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/HoDPlatform"
                onClick={() => handleTabClick('HoDPlatform')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDPlatform"
              >
                <CgWebsite className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Platform</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/HoDCategories"
                onClick={() => handleTabClick('HoDCategories')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDCategories"
              >
                <BiCategory className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/HoDStudentList"
                onClick={() => handleTabClick('HoDStudentList')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDStudentList"
              >
                <TiThList className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Student list</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/HoDProjectList"
                onClick={() => handleTabClick('HoDProjectList')}
                className={({ isActive }) =>
                  isActive ? 'relative flex items-center p-3 rounded-lg bg-white text-primary ' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDProjectList"
              >
                <TiThList className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Project list</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </li>

    <li>
              <div className="dropdown">
                <div
                  onClick={() => toggleDropdown('examsDropdown')}
                  className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
                >
                  <FaTasks className={`flex-shrink-0 w-7 h-7`} />

                  <span className={`flex items-center justify-between flex-1`}>
                    <span className={`ms-3`}>Exams</span>
                    <svg
                      className={`w-4 h-4 transform ${dropdownStates.examsDropdown ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </span>
                </div>

                {dropdownStates.examsDropdown && (
                  <ul className='space-y-2 font-medium ms-3'>
                    <li>
                      <NavLink
                        to="/HoDExamTypes"
                        onClick={() => handleTabClick('HoDExamTypes')}
                        className={({ isActive, isPending }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="HoDExamTypes"
                      >
                        <FaPlusCircle className={`flex-shrink-0 w-7 h-6`} />
                        <span className={`ms-3`}>Exam Types</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/HoDExamlist"
                        onClick={() => handleTabClick('HoDExamlist')}
                        className={({ isActive, isPending }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="HoDExamlist"
                      >
                        <FaPencilRuler className={`flex-shrink-0 w-7 h-6`} />
                        <span className={`ms-3`}>Exam List</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/HoDClos"
                        onClick={() => handleTabClick('HoDClos')}
                        className={({ isActive, isPending }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="HoDClos"
                      >
                        <FaFileAlt className={`flex-shrink-0 w-7 h-6`} />
                        <span className={`ms-3`}>Exam CLO's</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
            </li>
           
             
            <li>
              <NavLink
                to="/HoDResults"
                onClick={() => handleTabClick('HoDResults')}
                className={({ isActive }) =>
                  isActive ? 'relative flex items-center p-3 rounded-lg bg-white text-primary ' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDResults"
              >
                <FaChartPie className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Results</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/HoDFeedback"
                onClick={() => handleTabClick('HoDFeedback')}
                className={({ isActive }) =>
                  isActive ? 'relative flex items-center p-3 rounded-lg bg-white text-primary ' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDFeedback"
              >
                <RiFeedbackLine className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Feedback</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/HoDExaminerPanel"
                onClick={() => handleTabClick('HoDExaminerPanel')}
                className={({ isActive }) =>
                  isActive ? 'relative flex items-center p-3 rounded-lg bg-white text-primary ' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="HoDExaminerPanel"
              >
                <IoIosPeople className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Examiner Panels</span>
              </NavLink>
            </li>



            
            <li>
              <NavLink
                to="/Logout"
                onClick={() => handleTabClick('Logout')}
                className={({ isActive }) =>
                  isActive ? 'relative flex items-center p-3 rounded-lg bg-white text-primary ' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="Logout"
              >
                <IoMdLock className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Logout</span>
              </NavLink>
            </li>






            {/* ... repeat the above pattern for other navigation links */}
          </ul>

          <div id="scroll-indicator" className="absolute top-0 right-0 w-2 h-11 bg-secondary transition duration-300 ease-out"></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;





