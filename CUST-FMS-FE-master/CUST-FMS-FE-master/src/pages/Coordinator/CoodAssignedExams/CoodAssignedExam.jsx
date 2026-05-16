import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react'
import AsCoordinator from './AsCoordinator';
import ActiveExams from './ActiveExams';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const CoodAssignedExam = () => {
    const [isLoading, setIsLoading] = useState(false);  
    const [CoodCreatedExam, setCoodCreatedExam] = useState('');
    const [activeExamsData, setActiveExamsData] = useState([]);

    useEffect(() => {
        initFlowbite();
        // if(!localStorage.getItem('key')){
        //   Navigate('/login');
        // }
        
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
          const tabName = 'CoodAssignedExams';
          const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
          const topOffset = selectedTab.offsetTop;
          indicator.style.top = `${topOffset}px`;
        }
      }, []);
    
      const fetchCoordinatorExam = async () => {
        try {
            setIsLoading(true);
            const key = JSON.parse(localStorage.getItem("key"));
            const user = JSON.parse(localStorage.getItem("user"));
            const role = user?.role;

            console.log(key,  "keyyyy")

            if (!key || !role) {
                console.error('Authorization key or role not found in local storage.');
                return;
            }

            console.log("Checking Role on front end", role);

            const url = `/api/ExamCreationRoutes/getParticularExamOrient?role=${role}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) { // Unauthorized
                Navigate('/login');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                console.log("Coord Exams", data.exams);
                setCoodCreatedExam(data.exams);
            } else {
                console.error('Error fetching Panels:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching Panels Data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchActiveExams = async () => {
        try {
            const key = JSON.parse(localStorage.getItem("key"));
            if (!key) {
                console.error('Authorization key not found in local storage.');
                return;
            }

            const url = `/api/EvaluateExamRoutes/active-exams-with-marks`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                Navigate('/login');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                console.log("Active Exams with Marks", data.activeExams);
                setActiveExamsData(data.activeExams || []);
            } else {
                console.error('Error fetching active exams:', response.statusText);
                setActiveExamsData([]);
            }
        } catch (error) {
            console.error('Error fetching Active Exams Data:', error);
            setActiveExamsData([]);
        }
    };

    

    useEffect(() => {
        fetchCoordinatorExam();
        fetchActiveExams();
    }, [])


  return (
    <>
     {isLoading ? (
           
           <LoadingSpinner />
         ) : (
    <div className='mx-16 mt-10'>
    {/* Tab 1: Existing Coordinator Exams (Attendance/Orientation) */}
    <AsCoordinator accordionId = {364} CoodExam={CoodCreatedExam} />

    {/* Tab 2: All Active Exams with Panel Member Marks */}
    <ActiveExams accordionId={366} activeExams={activeExamsData} onRefresh={fetchActiveExams} />
    </div>
         )}
    </>
  )
}

export default CoodAssignedExam
