import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Simple from '../../../Components/Buttons/Simple';
import TimetableAccordion from './SupTimetableAccordion';  // Correct import path
import StudentTimetable from './StudentTimetable';
import FYPGrpDetail from '../../../Components/Accordians/AccordionGenericTable';
import { initFlowbite } from 'flowbite';
import StdSelectionCard from '../../../Components/Cards/StdSelectionCard';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import axios from 'axios';

import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';


const Timetable = () => {
  const [showTimetable, setShowTimetable] = useState(false);
  const [showUploadTimetableCard, setShowUploadTimetableCard] = useState(true);
  const [isStudentSelectionCardOpen, setIsStudentSelectionCardOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // const [selectedStdTimetable, setSelectedStdTimetable] = useState(null);
  const [iSelectedStdTimetableOpen, setIsSelectedStdTimetableOpen] = useState(false);
  // const [selectedGroupNo, setSelectedGroupNo] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStd, setSelectedStd] = useState(null);
  const [timetableData, setTimetableData] = useState('');
  const [showFYPGroups, setShowFYPGroups] = useState(true)
  const [loadingSpinner, setLoadingSpinner] = useState(false)

  const [appprovedProjects, setApprovedProjects] = useState(null)






  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const PageId = params.get('id');
  console.log(PageId, "PageID")

  useEffect(() => {
    if (PageId === "101") {
      setShowTimetable(true);
      setShowUploadTimetableCard(false);
      setShowFYPGroups(false);
    }
  }, [PageId])








  const handleUploadClick = () => {
    setShowTimetable(!showTimetable);
    setShowUploadTimetableCard(false);
  };

  const handleViewClick = (groupNo) => {

    //Get the selected group
    // const selectedGroup = groupData[groupNo];
    // Extract member details from the selected group only reg no and names baki details selected group mei hai jo abhi hum selected group mei save kry gey
    // setSelectedGroupNo(selectedGroup);


    const Group = appprovedProjects.find(group => (group._id === groupNo))
    // const selectedGroupId = Group._id

    console.log(Group, "group of the ")
    setSelectedGroup(Group);
    // setSelectedGroupNo(selectedGroupId);
    const selectedMembers = Group.members.map(member => ({
      name: member.Name,
      registrationNo: member.RegistrationNo,
      _id: member.id,
    }));

    //Set the selected student with member details
    setSelectedStudent(selectedMembers);

    // Open the student selection card
    setIsStudentSelectionCardOpen(true);
    //console.log(selectedGroupNo)
  }

  const handleSelectionCardClose = () => {
    setIsStudentSelectionCardOpen(false);
  };

  const handleViewTBClick = (RegistrationNo) => {
    // Find the selected student in the selected group
    const student = selectedGroup.members.find(member => member.id === RegistrationNo);
    if (student) {

      const studentId = student.id;
      const selectedStudent = {
        name: student.Name,
        registrationNo: student.RegistrationNo,
        fypGroupTitle: selectedGroup.fypTitle,
      };
      setSelectedStd(selectedStudent)
      fetchTimetableData(studentId)
      setIsSelectedStdTimetableOpen(true)
      // console.log('Selected Student:', selectedStdTimetable);
      // Use the selected student object as needed, such as setting state or updating other components
    } else {
      console.log('Student not found with Registration No:', RegistrationNo);
    }
    setShowTimetable(false)
    setShowUploadTimetableCard(false)
    setIsStudentSelectionCardOpen(false)
    setShowFYPGroups(false)
    setIsSelectedStdTimetableOpen(true)
  }
  const handleGoBack = () => {
    setShowTimetable(true)
    setIsSelectedStdTimetableOpen(false)
    setShowFYPGroups(true)


  }

  const handleAddButtoninTimetable = () => {

  }

  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupTimetable';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
    // ... rest of the useEffect code ...
  }, []);
  //Today working here

  const fetchApprovedGroups = async () => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;
      const response = await fetch(`/api/fyp/fyprequests/${userid}?filter=approved`, {
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
      let serialNum = 1;
      const reqData = data.fypRequests.map(data => ({
        _id: data._id,
        groupNo: serialNum++,
        fypTitle: data.topicData.topic,
        members: data.groupMembers.map(member => ({
          Name: member.name,
          RegistrationNo: member.registrationNumber,
          term: member.term.sessionTerm,
          id: member._id,
          Course: member.course,
        })),
        SuprvisionRequest: data.reqDate,
        term: data.groupMembers[0].term.sessionTerm,
        status: data.reqStatus,
      }));
      setApprovedProjects(reqData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
  useEffect(() => {
    console.log('Selected Student:', selectedStd);
    // Use the selected student object as needed, such as setting state or updating other components
  }, [selectedStd]);





  const fetchTimetableData = async (userId) => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }
      console.log("Checking user ID", userId);

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };

      const url = `/api/fyp/FetchStudTimetable?userId=${userId}`; // Update with the correct endpoint URL

      console.log("Before fetching timetable data");
      const response = await axios.get(url, config);

      console.log("Checking timetable data:", response.data);

      if (response.status === 200) {
        console.log("Checking fetched supervisor timetable", response.data.timetableData[0]);
        setTimetableData(response.data.timetableData[0]);
        console.log('Timetable data fetched successfully');

        // Do something with the timetable data
      } else {

        console.error('Error fetching timetable data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch timetable data:', error);
    }
  };
  useEffect(() => {
    fetchApprovedGroups();
  }, [])
  return (
    <>{loadingSpinner ? (<LoadingSpinner />) : (
      <div>
        <div className='bg-slate-100 w-full h-full'>
          <div className=" mx-10 pt-12 flex flex-col gap-3 ">
            {showUploadTimetableCard && (<div className="bg-primary max-h-40 h-40 max-w-xs rounded-lg mb-6 text-white">
              <div className=''>
                <p className="font-semibold ml-6 pt-4">Timetable</p>
              </div>
              <div className="mt-14 ml-6">
                <Simple text={'Upload'} onClick={handleUploadClick} />
              </div>
            </div>)}
            <div>
              {showTimetable && (
                <div>

                  <TimetableAccordion accordionId={1} addButtonClick={handleAddButtoninTimetable} />
                  {!showFYPGroups && (<div className='flex flex-row justify-end  mt-5'>
                    <ButbgPrimary text="Back" onClick={handleGoBack}
                    />
                  </div>)}
                </div>)}
              {showFYPGroups && (<FYPGrpDetail groupData={appprovedProjects} headers={[
                'Group no',
                'FYP Title',
                'Members',
                'Term',
                'Status',]} accordionId={2} buttons={[
                  {
                    text: 'View',
                    click: handleViewClick, // initialized with click handler function
                  },
                ]}
                tabheading={'FYP Groups'} />)}
            </div>
            <div>
              {iSelectedStdTimetableOpen && (
                <div>
                  <StudentTimetable stdtimetable={timetableData} accordionId={3} selectedStd={selectedStd} />
                  <div className='flex flex-row justify-end  mt-5'>
                    <ButbgPrimary text="Back" onClick={handleGoBack}
                    />
                  </div>
                </div>)
              }

            </div>
          </div>
        </div>
        {isStudentSelectionCardOpen && (
          <div className="fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            {/* Reminder 101 : is mei mapping ki error aa rahi abhi jo mei subha dekhu ga  */}
            {selectedStudent && (<StdSelectionCard selectedGroup={selectedStudent} onViewTBClick={handleViewTBClick} onClose={handleSelectionCardClose} />)}
          </div>
        )}


      </div>)}
    </>
  );
};

export default Timetable;
