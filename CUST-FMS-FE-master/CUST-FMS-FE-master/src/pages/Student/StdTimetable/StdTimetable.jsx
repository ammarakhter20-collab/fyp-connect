// Timetable.jsx
import React, { useState, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import TimetableAccordion from '../../../Components/Accordians/TimetableAccordion';  // Correct import path
import SupervisorTimetable from './StdSupervisorTimetable';
import { initFlowbite } from 'flowbite';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Timetable = () => {
  const [showTimetable, setShowTimetable] = useState(false);
  const [timetableUploaded, setTimetableUploaded] = useState(false); 

  const navigate = useNavigate();

  const handleUploadClick = () => {
    // Toggle TimetableAccordion visibility
    setShowTimetable(!showTimetable);
  };

  


  useEffect(() => {
    initFlowbite();
    if(!localStorage.getItem('key')){
      navigate('/login');
    }
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'Timetable';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect (() => {
    fetchTimetableData();
  }, [])

  useEffect(() => {
    const timetableUploadedStatus = localStorage.getItem('timetableUploaded');
    if (timetableUploadedStatus === 'true') {
      setTimetableUploaded(true);
      setShowTimetable(true);
    } else {
      setTimetableUploaded(false);
    }
  }, []);

  console.log("checking timetable status ", timetableUploaded);

  const fetchTimetableData = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
  
      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      console.log("Checking user ID", userId);
  
      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };
  
      const url = `/api/fyp/FetchStudTimetable?userId=${userId}`; // Update with the correct endpoint URL
  
      console.log("Before fetching timetable data");
      const response = await axios.get(url, config);
  
      console.log("Checking timetable data:", response.data);
  
      if (response.status === 200) {
        if(response.data.timetableData.length === 0){
          console.log("Runninggggggggggggggggg");
          setTimetableUploaded(false);
        }
        else{
        // Handle successful response
      
        setTimetableUploaded(true);
        localStorage.setItem('timetableUploaded', true); // Set timetableUploaded status in local storage


        console.log('Timetable data fetched successfully');
      }
        // Do something with the timetable data
      } else {
        
        console.error('Error fetching timetable data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch timetable data:', error);
    }
  };
  

  return (
    <>
    <div className='bg-slate-100 w-full h-full'>
      <div className=" mx-14 pt-12">
        <div className="bg-white max-h-40 h-40 max-w-xs rounded-lg mb-6">
          <div className=''>
            <p className="font-semibold ml-6 pt-4">Timetable</p>
          </div>
          {!timetableUploaded && (      
          <div className="mt-14 ml-6">
            <Simple text={'Upload'} onClick={handleUploadClick} />
          </div>
          )}
        </div>
        <div>
          {showTimetable && <TimetableAccordion accordionId={1} />}
          <SupervisorTimetable accordionId={2} />
        </div>
      </div>
      </div>
    </>
  );
};

export default Timetable;
