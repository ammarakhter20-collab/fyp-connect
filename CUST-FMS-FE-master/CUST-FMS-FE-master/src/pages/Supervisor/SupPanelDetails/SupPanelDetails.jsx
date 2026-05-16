import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import PanelDetails from './PanelDetails';
import ExaminerDetails from './ExaminerDetails';
// import * as Data from '../SupAttendance/SupAttendanceData';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'

const SupPanelDetails = () => {
  const [showExaminerDetails, setShowExaminerDetails] = useState(false);
  const [showPanelDetails, setShowPanelDetails] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const [penalData, setPenalData] = useState(null);
  const [data, sentData] = useState([]);
  const handleViewClick = (id) => {
    console.log("id of the panel", id)
    const panel = penalData.panels.find(penal => penal._id === id);
    console.log("Panel", panel)
    if (panel) {
      const panelcode = panel.panelCode;
      const selectedMembers = (panel.PanelMembers || []).map(member => ({
        _id: member?.member?._id,
        name: member?.member?.name || 'Unknown',
        designation: member?.member?.designation || 'N/A',
        role: member?.role || 'N/A',
        department: member?.member?.department?.departmentName || 'N/A',
        panelcode: panelcode,
      }));
      console.log('Program to warr gaya #Program_not_working ', panel)
      sentData(selectedMembers);
      setShowExaminerDetails(true)
      setShowPanelDetails(false)
    }
  }
  const handleGoBack = () => {
    setShowPanelDetails(true)
    setShowExaminerDetails(false)
  }





  const fetchPenalDetails = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      const response = await fetch(`/api/manageexampanels/get-penal/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }
      const data = await response.json();

      //Fetched  Data

      setPenalData(data);
      console.log(data, "PenalDetails");


    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    console.log("Use effect called on fetch request called!")
    fetchPenalDetails();
  }, []);
















  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupPanelDetails';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }

    }
    // const data = Data.examGroupData.map(panel => {


    // })
  }, []);
  return (
    <>
      {loadingSpinner ? (

        <LoadingSpinner />

      ) : (<div className='bg-slate-100 w-full h-full'>
        <div className='mx-10 pt-12 flex flex-col gap-3 ' >
          {showPanelDetails && penalData && (<div>
            <PanelDetails groupData={penalData} accordionId={1} handleViewClick={handleViewClick} />
          </div>)}
          {showExaminerDetails && (<div>
            <ExaminerDetails groupData={data} />
            <div className='flex flex-row justify-end  mt-5'>
              <ButbgPrimary text="Back" onClick={handleGoBack} />
            </div>
          </div>)}
        </div>
      </div>)}
    </>
  )

}

export default SupPanelDetails
