import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { baseUrl } from '../config/config';

const Header = () => {
  const navigate = useNavigate();
  const [AdmData, setAdmData] = useState('');
  const [isLoading , setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  useEffect(() => {
    fetchAdmData();
    fetchAnnouncements();
  }, []);

  const fetchAdmData = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      const response = await axios.get('/api/auth/GenUserData', config);

      if (response.status !== 497) {
        if (!response.data || !response.data.user) {
          return;
        }
      } else {
        navigate('/login');
      }

      setAdmData(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    if (!key) return;
    try {
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      const response = await axios.get('/api/CoordAnnouncementRoutes/getAllCoordAnnouncements', config);
      if (response.status === 200) {
        setAnnouncements(response.data);
      }
      const storedRead = JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
      setReadAnnouncements(storedRead);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const unreadCount = announcements.filter(ann => !readAnnouncements.includes(ann._id)).length;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <nav className="bg-white border-b border-gray-100 pl-12 fixed w-full top-0 z-10 ">
          <div className="max-w-screen-xl flex flex-wrap items-center pt-6 pb-6 ml-96">
            <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
              <p className="font-bold text-2xl w-56 max-h-16 text-gray-800">HI, {AdmData ? AdmData.name : 'Loading...'}</p>
            </a>
            <div className="search flex items-center space-x-4 md:order-2 bg-slate-50 p-3 rounded-full ml-auto border border-gray-100">
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
                  className="block w-full p-2 pl-10 rounded-full text-sm bg-gray-200 text-gray-900 border border-gray-300  focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search..."
                />
              </div>
              
              {/* Notification Icon and Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-gray-400 hover:text-primary transition-colors duration-200 focus:outline-none flex items-center relative text-2xl p-1"
                >
                  <IoIosNotificationsOutline />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Popup */}
                {showDropdown && (
                  <>
                    {/* Backdrop overlay to close when clicking outside */}
                    <div
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-30 overflow-hidden transform origin-top-right transition-all duration-300">
                      {/* Dropdown Header */}
                      <div className="bg-primary px-4 py-3 flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Announcements</span>
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} New
                        </span>
                      </div>

                      {/* Dropdown List */}
                      <div
                        className="max-h-72 overflow-y-auto divide-y divide-slate-100"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
                      >
                        {announcements.length > 0 ? (
                          announcements.map((ann, idx) => {
                            const isRead = readAnnouncements.includes(ann._id);
                            return (
                              <div
                                key={ann._id || idx}
                                onClick={() => {
                                  if (!isRead) {
                                    const updatedRead = [...readAnnouncements, ann._id];
                                    setReadAnnouncements(updatedRead);
                                    localStorage.setItem('readAnnouncements', JSON.stringify(updatedRead));
                                  }
                                  setShowDropdown(false);
                                  navigate('/CoodAnnouncement', { state: { selectedAnnouncementId: ann._id } });
                                }}
                                className={`p-4 hover:bg-slate-50 transition-colors duration-150 text-left cursor-pointer ${isRead ? 'bg-slate-50/50' : 'bg-white'}`}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className={`text-xs text-slate-800 break-words max-w-[80%] ${isRead ? 'font-medium text-slate-400' : 'font-bold text-slate-800'}`}>
                                    {ann.title}
                                  </h4>
                                  <span className="text-[9px] text-slate-400 font-light whitespace-nowrap">
                                    {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <p className={`text-[11px] mt-1 font-light leading-relaxed break-words ${isRead ? 'text-slate-400/80' : 'text-slate-500'}`}>
                                  {ann.description}
                                </p>
                                {ann.file && (
                                  <a
                                    href={`/uploads/${ann.file.split(/[/\\]/).pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`inline-flex items-center text-[10px] hover:underline font-semibold mt-2 ${isRead ? 'text-primary/60' : 'text-primary'}`}
                                  >
                                    📎 Download Attachment
                                  </a>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <span className="text-4xl">🔔</span>
                            <h4 className="font-bold text-sm text-slate-700 mt-3">No announcements</h4>
                            <p className="text-xs text-slate-400 font-light mt-1 max-w-[15rem]">
                              We'll let you know when new updates or announcements arrive!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Rounded Picture */}
              <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                <img alt="Profile" className="w-full h-full object-fill rounded-full" 
                  src={AdmData?.image && AdmData.image !== "undefined" && AdmData.image !== "" ? `/uploads/${AdmData.image}` : '/assets/images/CardImg.png'}
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

