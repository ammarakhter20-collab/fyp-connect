import { initFlowbite } from 'flowbite';
import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import { IoMdHome } from 'react-icons/io';
import { CgDetailsMore, CgWebsite } from 'react-icons/cg';
import { IoCreateOutline, IoPersonSharp } from 'react-icons/io5';
import { MdOutlineTask } from 'react-icons/md';
import { FaBook, FaCalendarAlt, FaCalendarCheck, FaChartPie, FaClipboardList, FaClock, FaFileAlt, FaPencilRuler, FaPlusCircle, FaQuestion, FaRocketchat, FaTasks, FaTrophy } from 'react-icons/fa';
import { FaBusinessTime } from 'react-icons/fa';
import { IoMdLock } from 'react-icons/io';
import { MdBarChart } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { RiFeedbackLine, RiFileEditLine } from "react-icons/ri";
import { Dropdown } from "flowbite-react";
import { GrCatalog, GrCatalogOption, GrTechnology } from "react-icons/gr";
import { TiThList } from "react-icons/ti";
import { GoProject } from "react-icons/go";
import { GiFlatPlatform } from "react-icons/gi";
import { BiCategory } from "react-icons/bi";
import { CiFileOn } from "react-icons/ci";




import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { IoIosPeople } from "react-icons/io";
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import { BsBarChart } from "react-icons/bs";
import { TfiAnnouncement } from 'react-icons/tfi';
import { AiOutlineAudit } from 'react-icons/ai';




const Sidebar = () => {



  const [selectedItem, setSelectedItem] = useState('');
  // Initialize isOpen state with keys for each dropdown
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownStates, setDropdownStates] = useState({
    reportsDropdown: true,
    manageProjectsDropdown: true,
    manageExamsDropdown: true,
    manageCLosDropdown: true,
    supervisionDropdown: true,
  });
  

  const toggleDropdown = (dropdownId) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [dropdownId]: !prevState[dropdownId],
    }));
  };
  // const toggleDropdown = (dropdownId) => {
  //   // Use the dropdownId to toggle the specific dropdown
  //   setIsOpen((prevState) => ({
  //     ...prevState,
  //     [dropdownId]: !prevState[dropdownId]
  //   }));
  // };



  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

















  useEffect(() => {
    initFlowbite();
    setScrollbarPosition('CoodDashboard');
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
                to="/CoodProfile"
                onClick={() => handleTabClick('CoodProfile')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
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
                to="/CoodDashboard" 
                onClick={() => handleTabClick('CoodDashboard')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodDashboard"
              >
                <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodAnnouncement" 
                onClick={() => handleTabClick('CoodAnnouncement')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodAnnouncement"
              >
                <TfiAnnouncement className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Announcement</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodFypRegistration"
                onClick={() => handleTabClick('CoodFypRegistration')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodFypRegistration"
              >
                <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>FYP Registration</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/SupuploadFYPtopic"
                onClick={() => handleTabClick('SupuploadFYPtopic')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupuploadFYPtopic"
              >
                <FileUploadRoundedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Upload FYP Topic</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupRequest"
                onClick={() => handleTabClick('SupRequest')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupRequest"
              >
                <IoPersonSharp className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Request</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupPrevSupProj"
                onClick={() => handleTabClick('SupPrevSupProj')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupPrevSupProj"
              >
                <InfoOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>My Projects / Thesis</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/CoodAssignedExam"
                onClick={() => handleTabClick('CoodAssignedExam')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodAssignedExams"
              >
                <AssignmentTurnedInOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Assigned Exams</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/SupTimetable"
                onClick={() => handleTabClick('SupTimetable')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupTimetable"
              >
                <FaBusinessTime className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Timetable</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupAttendance"
                onClick={() => handleTabClick('SupAttendance')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAttendance"
              >
                <EmojiPeopleOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Attendance</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupAssignedTasks"
                onClick={() => handleTabClick('SupAssignedTasks')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAssignedTasks"
              >
                <MdOutlineTask className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Tasks</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupChatCall"
                onClick={() => handleTabClick('SupChatCall')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupChatCall"
              >
                <FaRocketchat className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Chat & Call</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupAnnouncements"
                onClick={() => handleTabClick('SupAnnouncements')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAnnouncements"
              >
                <CampaignOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Announcements</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/SupCourseCatalog"
                onClick={() => handleTabClick('SupCourseCatalog')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupCourseCatalog"
              >
                <SourceOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Course Catalog</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/CoodFeedback"
                onClick={() => handleTabClick('CoodFeedback')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodFeedback"
              >
                <RiFeedbackLine className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Feedback</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodExaminerPanel"
                onClick={() => handleTabClick('CoodExaminerPanel')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodExaminerPanel"
              >
                <IoIosPeople className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Examiner Panels</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodCourseCat"
                onClick={() => handleTabClick('CoodCourseCat')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCourseCat"
              >
                <GrCatalog className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Course Catalog</span>
              </NavLink>
            </li>

            {/* Supervision Section */}
            <li>
              <div className="dropdown">
                <div
                  onClick={() => toggleDropdown('supervisionDropdown')}
                  className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10 cursor-pointer"
                >
                  <InfoOutlinedIcon className="flex-shrink-0 w-7 h-7" />
                  <span className="flex items-center justify-between flex-1">
                    <span className="ms-3">Supervision</span>
                    <svg
                      className={`w-4 h-4 transform ${dropdownStates.supervisionDropdown ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </span>
                </div>

                {dropdownStates.supervisionDropdown && (
                  <ul className="space-y-2 font-medium ms-3">
                    <li>
                      <NavLink
                        to="/CoodUploadFYPTopic"
                        onClick={() => handleTabClick('CoodUploadFYPTopic')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodUploadFYPTopic"
                      >
                        <FileUploadRoundedIcon className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Upload FYP Topic</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodSupRequest"
                        onClick={() => handleTabClick('CoodSupRequest')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodSupRequest"
                      >
                        <RiFileEditLine className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodMyProjects"
                        onClick={() => handleTabClick('CoodMyProjects')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodMyProjects"
                      >
                        <SourceOutlinedIcon className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">My Projects / Thesis</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodSupAssignedExam"
                        onClick={() => handleTabClick('CoodSupAssignedExam')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodSupAssignedExam"
                      >
                        <AssignmentTurnedInOutlinedIcon className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Assigned Exams</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodPanelDetails"
                        onClick={() => handleTabClick('CoodPanelDetails')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodPanelDetails"
                      >
                        <IoIosPeople className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Panel Details</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodTimetable"
                        onClick={() => handleTabClick('CoodTimetable')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodTimetable"
                      >
                        <FaClock className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Timetable</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodAttendance"
                        onClick={() => handleTabClick('CoodAttendance')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodAttendance"
                      >
                        <EmojiPeopleOutlinedIcon className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Attendance</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodSupAnnouncements"
                        onClick={() => handleTabClick('CoodSupAnnouncements')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodSupAnnouncements"
                      >
                        <TfiAnnouncement className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Announcements</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
            </li>


            <li>
      <div className="dropdown">
        <div
          onClick={() => toggleDropdown('reportsDropdown')}
          className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
        >
          <BsBarChart className="flex-shrink-0 w-7 h-7" />
          <span className="flex items-center justify-between flex-1">
            <span className="ms-3">Reports</span>
            <svg
              className={`w-4 h-4 transform ${dropdownStates.reportsDropdown ? 'rotate-180' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </span>
        </div>

        {dropdownStates.reportsDropdown && (
          <ul className="space-y-2 font-medium ms-3">
            <li>
              <NavLink
                to="/CoodStudentList"
                onClick={() => handleTabClick('CoodStudentList')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodStudentList"
              >
                <TiThList className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Student List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodProjectsLists"
                onClick={() => handleTabClick('CoodProjectsLists')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodProjectsLists"
              >
                <TiThList className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Project List</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </li>



            <li>
      <div className="dropdown">
        <div
          onClick={() => toggleDropdown('manageProjectsDropdown')}
          className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
        >
          <GoProject className="flex-shrink-0 w-7 h-7" />
          <span className="flex items-center justify-between flex-1">
            <span className="ms-3">Manage Projects</span>
            <svg
              className={`w-4 h-4 transform ${dropdownStates.manageProjectsDropdown ? 'rotate-180' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </span>
        </div>

        {dropdownStates.manageProjectsDropdown && (
          <ul className="space-y-2 font-medium ms-3">
            <li>
              <NavLink
                to="/CoodCreateProject"
                onClick={() => handleTabClick('CoodCreateProject')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreateProject"
              >
                <IoCreateOutline className="flex-shrink-0 w-7 h-7" />
                <span className="ms-3">Create Project</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodCreateTechnology"
                onClick={() => handleTabClick('CoodCreateTechnology')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreateTechnology"
              >
                <GrTechnology className="flex-shrink-0 w-7 h-7" />
                <span className="ms-3">Technology</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodCreatePlatform"
                onClick={() => handleTabClick('CoodCreatePlatform')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreatePlatform"
              >
                <CgWebsite className="flex-shrink-0 w-7 h-7" />
                <span className="ms-3">Platform</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodCreateCategories"
                onClick={() => handleTabClick('CoodCreateCategories')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreateCategories"
              >
                <BiCategory className="flex-shrink-0 w-7 h-7" />
                <span className="ms-3">Categories</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </li>




            <li>
      <div className="dropdown">
        <div
          onClick={() => toggleDropdown('manageExamsDropdown')}
          className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
        >
          <FaTasks className="flex-shrink-0 w-7 h-7" />
          <span className="flex items-center justify-between flex-1">
            <span className="ms-3">Manage Exams</span>
            <svg
              className={`w-4 h-4 transform ${dropdownStates.manageExamsDropdown ? 'rotate-180' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </span>
        </div>

        {dropdownStates.manageExamsDropdown && (
          <ul className="space-y-2 font-medium ms-3">
            <li>
              <NavLink
                to="/CoodCreateExamType"
                onClick={() => handleTabClick('CoodCreateExamType')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreateExamType"
              >
                <FaPlusCircle className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Create Exam Type</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CoodCreateExam"
                onClick={() => handleTabClick('CoodCreateExam')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodCreateExam"
              >
                <FaPencilRuler className="flex-shrink-0 w-7 h-6" />
                <span className="ms-3">Create Exam</span>
              </NavLink>
            </li>
            <li>
              <div className="dropdown">
                <div
                  onClick={() => toggleDropdown('manageCLosDropdown')}
                  className="flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10"
                >
                  <FaClipboardList className="flex-shrink-0 w-7 h-6" />
                  <span className="flex items-center justify-between flex-1">
                    <span className="ms-3">Manage CLOs</span>
                    <svg
                      className={`w-4 h-4 transform ${dropdownStates.manageCLosDropdown ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </span>
                </div>

                {dropdownStates.manageCLosDropdown && (
                  <ul className="space-y-2 font-medium ms-3">
                    <li>
                      <NavLink
                        to="/CoodManageExamClo"
                        onClick={() => handleTabClick('CoodManageExamClo')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-100 hover:bg-white hover:bg-opacity-10'
                        }
                        data-tab="CoodManageExamClo"
                      >
                        <FaFileAlt className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">CLOs for Exams</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodManageClos"
                        onClick={() => handleTabClick('CoodManageClos')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg hover:bg-gray-100 text-white' : 'flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:bg-opacity-10'
                        }
                        data-tab="CoodManageClos"
                      >
                        <FaBook className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">CLO</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/CoodManageQuestions"
                        onClick={() => handleTabClick('CoodManageQuestions')}
                        className={({ isActive }) =>
                          isActive ? 'flex items-center p-3 rounded-lg hover:bg-gray-100 text-white' : 'flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:bg-opacity-10'
                        }
                        data-tab="CoodManageQuestions"
                      >
                        <FaQuestion className="flex-shrink-0 w-7 h-6" />
                        <span className="ms-3">Questions</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        )}
      </div>
    </li>


                    {/* <li>
                      <NavLink
                        to="/CoodManagePercentage"
                        onClick={() => handleTabClick('CoodManagePercentage')}
                        className={({ isActive, isPending }) =>
                          isActive ? 'flex items-center p-3 rounded-lg hover:bg-gray-100 text-white' : 'flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-100 hover:bg-opacity-10'
                        }
                        data-tab="CoodManagePercentage"
                      >
                        <RiFeedbackLine className={`flex-shrink-0 w-7 h-7`} />
                        <span className={`ms-3`}>Manage Percentage</span>
                      </NavLink>
                    </li> */}


            <li>
              <NavLink
                to="/CoodResults"
                onClick={() => handleTabClick('CoodResults')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodResults"
              >
                <IoMdLock className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Results</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/CoodEvaluationStatuses"
                onClick={() => handleTabClick('CoodEvaluationStatuses')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="CoodEvaluationStatuses"
              >
                <AiOutlineAudit className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Evaluation Status</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Logout"
                onClick={() => handleTabClick('Logout')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
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





