import { initFlowbite } from 'flowbite';
import React, { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import { IoMdHome } from 'react-icons/io';
import { FaClock, FaSignOutAlt } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { IoIosPeople } from "react-icons/io";
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import { TfiAnnouncement } from 'react-icons/tfi';
import { RiFileEditLine } from 'react-icons/ri';
import { GrCatalog } from 'react-icons/gr';
const Sidebar = () => {
  useEffect(() => {
    initFlowbite();
    setScrollbarPosition('Dashboard');
  }, []);

  // const [selectedTab, setSelectedTab] = useState('Dashboard');
  const sidebarRef = useRef(null);

  const handleTabClick = (tabName) => {
    // setSelectedTab(tabName);
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
        className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0 bg-primary shadow-2xl"
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 py-4">
          <Link to="/SupDashboard" className="flex items-center justify-center ps-2.5 mb-5 w-full overflow-x-hidden relative">
            <img src="/assets/images/Sidebarlogo.png" className="h-40 w-40 me-3" alt="Cust Logo" />
            <div className="absolute bottom-0 w-full left-0 right-0 border-b border-white border-opacity-10"></div>
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/SupProfile"
                onClick={() => handleTabClick('SupProfile')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                // className={`relative flex items-center p-3 rounded-lg   hover:bg-gray-100 dark:hover:bg-gray-700`}
                data-tab="SupProfile"
              >
                <CgProfile
                  className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupDashboard"
                onClick={() => handleTabClick('SupDashboard')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupDashboard"
              >
                <IoMdHome className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupuploadFYPtopic"
                onClick={() => handleTabClick('SupuploadFYPtopic')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupuploadFYPtopic"
              >
                <FileUploadRoundedIcon className={`flex-shrink-0 w-9 h-9`} />
                <span className={`ms-3`}>Upload FYP Topic</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupRequest"
                onClick={() => handleTabClick('SupRequest')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupRequest"
              >
                <RiFileEditLine className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Request</span>
              </NavLink>
            </li>
            <li>
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
            </li>
            {/* <li>
              <NavLink
                to="/SupProjectDetails"
                onClick={() => handleTabClick('SupProjectDetails')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupProjectDetails"
              >
                <CgDetailsMore className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Project Details</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/SupAssignedExam"
                onClick={() => handleTabClick('SupAssignedExam')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAssignedExam"
              >
                <AssignmentTurnedInOutlinedIcon className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Assigned Exams</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupPanelDetails"
                onClick={() => handleTabClick('SupPanelDetails')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupPanelDetails"
              >
                <IoIosPeople className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Panel Details</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupTimetable"
                onClick={() => handleTabClick('SupTimetable')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupTimetable"
              >
                <FaClock className={`flex-shrink-0 w-7 h-7`} />
                <span className={`ms-3`}>Timetable</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupAttendance"
                onClick={() => handleTabClick('SupAttendance')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAttendance"
              >
                <EmojiPeopleOutlinedIcon className={`flex-shrink-0 w-8 h-7`} />
                <span className={`ms-3`}>Attendance</span>
              </NavLink>
            </li>
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
            <li>
              <NavLink
                to="/SupAnnouncements"
                onClick={() => handleTabClick('SupAnnouncements')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupAnnouncements"
              >
                <TfiAnnouncement className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Announcements</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SupCourseCatalog"
                onClick={() => handleTabClick('SupCourseCatalog')}
                className={({ isActive }) =>
                  isActive ? 'flex items-center p-3 rounded-lg bg-white text-primary' : 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-white hover:bg-opacity-10'
                }
                data-tab="SupCourseCatalog"
              >
                <GrCatalog className={`flex-shrink-0 w-7 h-6`} />
                <span className={`ms-3`}>Course Catalog</span>
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
                <FaSignOutAlt className={`flex-shrink-0 w-7 h-7`} />
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
