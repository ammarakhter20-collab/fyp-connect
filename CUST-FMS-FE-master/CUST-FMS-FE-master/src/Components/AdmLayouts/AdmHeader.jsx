import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { baseUrl } from '../config/config';

const Header = ({AdmDataProp}) => {
  const navigate = useNavigate();
  const [AdmData, setAdmData] = useState('');
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {

    fetchAdmData();
   
}, []);

  const fetchAdmData = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    // console.log(key);
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      const response = await axios.get('/api/auth/GenUserData', config);


      if (response.status !== 497) {
        if (!response.data || !response.data.user) {
          // console.error('Error fetching user data:', response.statusText);
          return;
        }

      }
      else {
        navigate('/login');
      }

      setAdmData(response.data.user);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  
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
              className="block w-full p-2 pl-10 rounded-full text-sm bg-gray-200 text-gray-900 border border-gray-300  focus:ring-blue-500 focus:border-blue-500            "
              placeholder="Search..."
            />
          </div>
          
          {/* Notification Icon */}
          <div className='text-2xl'>
            <div className="text-gray-400 w-full h-full"><IoIosNotificationsOutline /></div>
          </div>
          {/* Rounded Picture */}
          <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            {/* Replace the following line with your actual image */}
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
