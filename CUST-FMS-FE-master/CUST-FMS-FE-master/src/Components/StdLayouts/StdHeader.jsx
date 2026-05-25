import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { baseUrl } from '../config/config';

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  const [isLoading , setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchAnnouncements();
  }, []);

  const fetchUserData = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    console.log(key);
    try {
      setIsLoading(true);
      const config =  {headers: { Accept: 'application/json', Authorization: `Bearer ${key}` }};

      const response = await axios.get('/api/auth/GenUserData', config);

      
      if(response.status !== 497){
        if (!response.data || !response.data.user) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }
      else {
        navigate('/login');
      }
      console.log(response.data);
      setUserData(response.data.user);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      const user = JSON.parse(localStorage.getItem("user"));
      if (!key || !user) return;

      const pstatus = JSON.parse(localStorage.getItem("FYPData"));
      let sendStatus = 'unregistered';
      if (pstatus) {
        if (pstatus.partStatus === 'part-I') sendStatus = 'fyp_groups_part1';
        else if (pstatus.partStatus === 'part-II') sendStatus = 'fyp_groups_part2';
      }

      let supervisorId = '';
      if (pstatus && pstatus.selectedOption) {
        supervisorId = pstatus.selectedOption._id;
      }

      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      let url = `/api/CoordAnnouncementRoutes/announcementsByStatus?role=${user.role}&status=${sendStatus}`;
      if (supervisorId) {
        url += `&supervisorId=${supervisorId}`;
      }

      const response = await axios.get(url, config);
      if (response.status === 200 && response.data) {
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(sorted);
      }
    } catch (error) {
      console.error('Error fetching announcements in header:', error);
    }
  };

  return (
    <>
    <style>{`
      @keyframes fadeInDropdown {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    {isLoading ? (
       
      <LoadingSpinner />
    ) : ( 
    
    <nav className="bg-white border-b border-gray-100 pl-12 fixed w-full top-0 z-10 ">
      <div className="max-w-screen-xl flex flex-wrap items-center pt-6 pb-6 ml-96">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
          <p className="font-bold text-2xl w-56 max-h-16 text-gray-800">HI, {userData ? userData.name : 'Loading...'}</p>
        </a>
        <div className="search flex items-center space-x-4 md:order-2 bg-slate-50 p-3 rounded-full ml-auto border border-gray-100 relative">
          {/* Search Bar */}
          <div className="relative hidden md:block bg-white">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none rounded-full -mr-44" >
              <svg
                className="w-4 h-4 text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 rounded-full text-sm bg-gray-200 text-gray-900 border border-gray-300  focus:ring-blue-500 focus:border-blue-500            "
              placeholder="Search..."
            />
          </div>
          
          {/* Notification Icon */}
          <div 
            className='text-2xl cursor-pointer relative flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors duration-200'
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ width: '36px', height: '36px' }}
          >
            <div className={`text-gray-400 w-full h-full flex items-center justify-center ${showDropdown ? 'text-[#514B96]' : 'hover:text-[#514B96]'}`}>
              <IoIosNotificationsOutline size={26} />
            </div>
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-[#F47458]" />
            )}
          </div>

          {/* Announcements Dropdown */}
          {showDropdown && (
            <div 
              style={{
                position: 'absolute',
                right: '48px',
                top: '56px',
                width: '360px',
                maxHeight: '380px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(81,75,150,0.15), 0 8px 10px -6px rgba(81,75,150,0.15)',
                border: '1px solid #b9b6e3',
                zIndex: 50,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeInDropdown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Dropdown Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #efeffa',
                background: 'linear-gradient(135deg, #efeffa 0%, #f7f6fe 100%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, color: '#514B96', fontSize: '15px' }}>
                  📢 Announcements ({announcements.length})
                </span>
                {announcements.length > 0 && (
                  <span 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/Announcement');
                    }}
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      color: '#F47458', 
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    View All
                  </span>
                )}
              </div>

              {/* Dropdown List */}
              <div style={{ 
                overflowY: 'auto', 
                flex: 1, 
                padding: '8px 0' 
              }}>
                {announcements.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#6b7280' }}>
                    <p style={{ fontSize: '14px', margin: 0 }}>No announcements found</p>
                  </div>
                ) : (
                  announcements.map((item, idx) => (
                    <div 
                      key={item._id}
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/Announcement');
                      }}
                      style={{
                        padding: '12px 20px',
                        borderBottom: idx === announcements.length - 1 ? 'none' : '1px solid #efeffa',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      className="hover:bg-slate-50 text-left"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ 
                          margin: 0, 
                          fontSize: '13px', 
                          fontWeight: 700, 
                          color: '#111827',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          flex: 1,
                          paddingRight: '8px',
                          textAlign: 'left'
                        }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ 
                        margin: '0 0 6px 0', 
                        fontSize: '12px', 
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'left'
                      }}>
                        {item.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#514B96', background: '#efeffa', padding: '2px 8px', borderRadius: '4px' }}>
                          By: {item.uploadedBy?.name || 'Faculty'}
                        </span>
                        {item.file && (
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            📎 Attachment
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Rounded Picture */}
          <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <img src={userData?.image && userData.image !== "undefined" && userData.image !== "" ? `/uploads/${userData.image}` : '/assets/images/CardImg.png'} 
              alt="Profile" 
              className="w-full h-full object-fill rounded-full"
              onError={(e) => {
                e.target.src = '/assets/images/CardImg.png';
              }} 
            />
          </div>
        </div>
      </div>
    </nav>
    )}
  </>
  );
};

export default Header;
