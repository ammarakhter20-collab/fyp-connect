import React, { useEffect, useState } from 'react';

import { DashData } from './StdDashData';
// import { projectInfoData, AttendenceData, testData } from '../StdProjectDetails/StdProjData/Stddata';

import ProjDetails from './StdprojDetails';
import GroupMembers from './StdGroupMembers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../../Components/config/config';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { GoArrowUpRight } from "react-icons/go";


// const SlotsData = [
//   {
//     Day: 'Monday',
//     Slots: ['8:00AM - 12:00PM', '4:00PM - 6:00PM', '1:00PM - 2:00PM'],
//   },
//   {
//     Day: 'Tuesday',
//     Slots: ['8:00AM - 12:00PM', '4:00PM - 6:00PM', '1:00PM - 2:00PM'],
//   },
//   {
//     Day: 'Wednesday',
//     Slots: ['8:00AM - 12:00PM', '4:00PM - 6:00PM', '1:00PM - 2:00PM', '1:00PM - 2:00PM', '1:00PM - 2:00PM', '1:00PM - 2:00PM'],
//   },
//   {
//     Day: 'Thursday',
//     Slots: ['8:00AM - 12:00PM', '4:00PM - 6:00PM', '1:00PM - 2:00PM'],
//   },
//   {
//     Day: 'Friday',
//     Slots: ['8:00AM - 12:00PM', '4:00PM - 6:00PM', '1:00PM - 2:00PM', '1:00PM - 2:00PM', '1:00PM - 2:00PM'],
//   },
// ];

const Dashboard = ({ isFYPRegistered, accordionId }) => {
  // const { token } = useUser();
  const [studentData, setStudentData] = useState(null);
  /* const [userFypData, setUserFypData] = useState(null); */
  // Move useNavigate inside the functional component
  const currentDate = new Date().toLocaleString('en-US', { weekday: 'long' });
  const [selectedDayData, setSelectedDayData] = useState('');
  const [showRegAnnouncement, setShowRegAnnouncement] = useState(false);
  const navigate = useNavigate();
  /* const [openAccordions, setOpenAccordions] = useState([]); */
  /* const [selectedAccordion, setSelectedAccordion] = useState(null); */
  const [FypData, setFypData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  /* const [GroupAttendance, setGroupAttendance] = useState(''); */
  const [ReqStatus, setReqStatus] = useState('');
  const [FypGroupFeedback, setFypGroupFeedback] = useState('');
  const [SlotsData, setSlotsData] = useState([]);
  const [SupervisorTimetableData, setSupervisorTimetableData] = useState('');

  const [announcementCount, setAnnouncementCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);




  /* const handleDismiss = () => {
    setShowAnnouncement(false);
  }; */

  // console.log("Checking Latesttttttttt Announcement Data", latestAnnoun);

  // useEffect(() => {
  //   if (Array.isArray(AnnouncementData) && AnnouncementData.length > 0) {
  //     // Count the number of announcements
  //     console.log("Checking Announcement Data lengthhhhhhhhhhhhhhhhhhhhhhhhhhhhh", AnnouncementData.length);
  //     setAnnCount(AnnouncementData.length);

  //     // Find the latest (newest) announcement
  //     const latestAnnouncement = AnnouncementData.reduce((latest, current) => {
  //       return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
  //     }, AnnouncementData[0]); // Initialize with the first announcement

  //     // Set the latest announcement state
  //     setLatestAnnoun(latestAnnouncement);
  //   }
  // }, [AnnouncementData]); // Update when AnnouncementData changes
  // console.log("CHecking Statussssssssssssssssss req", FypData && FypData.reqStatus);
  useEffect(() => {
    if (FypData && FypData.reqStatus === 'approved' && !localStorage.getItem('hasReloaded')) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload(true);
    }
  }, [FypData]);

  useEffect(() => {
    if (SupervisorTimetableData) {
      const dynamicSlotsData = Object.keys(SupervisorTimetableData).map((day) => {
        // Check if SupervisorTimetableData[day] is an array before mapping over it
        const slots = Array.isArray(SupervisorTimetableData[day]) ? SupervisorTimetableData[day].map((slotData) => ({
          slot: slotData.slot,
          class: slotData.class,
          _id: slotData._id
        })) : [];
        return {
          Day: day,
          Slots: slots,
        };
      });
      setSlotsData(dynamicSlotsData);
    }
  }, [SupervisorTimetableData]);

  useEffect(() => {
    // Retrieve RegistrationOpen value from localStorage
    const registrationOpen = JSON.parse(localStorage.getItem('RegistrationOpen'));

    if (registrationOpen === true) {
      setShowRegAnnouncement(true);
    }
    else {
      setShowRegAnnouncement(false);
    }
  }, []);



  const handleStorageChange = (event) => {
    // Handle storage change event if needed
    console.log('Storage change event:', event);
  };


  const handleView = () => {
    // setShowAnnouncement(true);
  };


  const handleRegisterFYP = () => {
    navigate('/FYPRegistration')
  }

  const panelCardToProjDet = () => {
    navigate('/ProjectDetails')
  }

  const AttendanceVigetToAttendDet = () => {
    navigate('/ProjectDetails')
  }

  const ProjDetVigetToProjDet = () => {
    navigate('/ProjectDetails')
  }

  const dashToSupTimetable = () => {
    navigate('/Timetable')
  }

  const handleBack = () => {
    console.log("Handle back called");
    setShowFeedback(false);
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
  }


  const fetchAnnouncementData = async () => {
    console.log("Inside Fetch Announcement Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const userData = JSON.parse(localStorage.getItem("user"));
      const role = userData.role;
      console.log("Checking Role of Studenttttttttt", role);
      const pstatus = JSON.parse(localStorage.getItem("FYPData"));


      let SendStatus = '';
      if (pstatus) {
        const partStatus = pstatus.partStatus;

        if (partStatus === 'part-I') {
          SendStatus = 'fyp_groups_part1';
        }
        if (partStatus === 'part-II') {
          SendStatus = 'fyp_groups_part2';
        }
      }
      else {
        SendStatus = 'unregistered';

      }



      // console.log("Checking fetching part Status", partStatus);
      console.log("Checking Send Status", SendStatus);
      let supervisorId = '';


      const supId = JSON.parse(localStorage.getItem("FYPData"));
      if (supId) {
        supervisorId = supId.selectedOption._id;
      }








      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Construct the URL with partStatus, supervisorId, and coordinatorId
      let url = `/api/CoordAnnouncementRoutes/announcementsByStatus?role=${role}&status=${SendStatus}`;
      if (supId && supervisorId) {

        url += `&supervisorId=${supervisorId}`
      }

      console.log("URLlllllllll", url);

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data || !response.data) {
          console.error('Error fetching announcement data:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Checking fetching Announcement Data", response.data);
      console.log("Length oF Announcementssssssssssssss", response.data.length);
      setAnnouncementCount(response.data.length);



      // Process the fetched announcement data
      // Assuming you have a function to handle this, e.g., setAnnouncementData


      // Optionally, you can save the announcement data to localStorage
      // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
    } catch (error) {
      console.error('Error fetching announcement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchCoordinatorId = async () => {

  //   try{
  //     setIsLoading(true);
  //     const key = JSON.parse(localStorage.getItem("key"));
  //   const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

  //     // Construct the URL with partStatus, supervisorId, and coordinatorId
  //     const url = `/api/auth/getPartAnnouncement/${partStatus}/${supervisorId}/${coordinatorId}`;

  //     const response = await axios.get(url, config);

  //     if (response.status !== 497) {
  //       if (!response.data || !response.data) {
  //         console.error('Error fetching announcement data:', response.statusText);
  //         return;
  //       }
  //     } else {
  //       navigate('/login');
  //     }
  //     // console.log("Checking fetching Announcement Data", response.data.announcement);
  //     // console.log("Checking fetching Announcement Data", response.data.announcement);
  //     // console.log("Checking fetching Announcement Data", response.data.announcement);


  //     // Process the fetched announcement data
  //     // Assuming you have a function to handle this, e.g., setAnnouncementData
  //     console.log("AnnNNNnnouncementtttttttttttttttttttttttttttttt", response.data.annoncement);
  //     setAnnouncementData(response.data.announcement);

  //     // Optionally, you can save the announcement data to localStorage
  //     // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
  //   } catch (error) {
  //     console.error('Error fetching announcement data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  useEffect(() => {
    // fetchCoordinatorId();
    fetchAnnouncementData();
  }, [])




  useEffect(() => {
    if (!FypData) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [FypData]);

  useEffect(() => {
    if (!studentData) {
      setIsLoading(true); // Set isLoading to true if FypData is not loaded
    } else {
      setIsLoading(false); // Set isLoading to false if FypData is loaded
    }
  }, [studentData]);





  useEffect(() => {

    // if (!localStorage.getItem('key')) {
    //   navigate('/login');
    // }


    window.addEventListener('storage', handleStorageChange);
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    }
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.onpopstate = null;
    };
  }, []);

  // console.log("Called SlotsData", SlotsData);

  useEffect(() => {
    const foundDayData = SlotsData.find((item) => item.Day === currentDate);

    setSelectedDayData(foundDayData);
  }, [SlotsData, currentDate]);
  // console.log("Checking Slotssssssssssssssssssssssss Dataaaaaaaa", SlotsData);
  // console.log("Today TImetable Data founddddddddddddddddddddddddddddddd", selectedDayData);
  // console.log(token);
  const fetchUserData = async () => {
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

      setStudentData(response.data.user);
      localStorage.setItem('studentData', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupFeedback = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
      const fypRegData = JSON.parse(localStorage.getItem("FYPData"));
      if (!fypRegData) {
        console.log("No user FYP registration found in localStorage.");
        setIsLoading(false);
        return;
      }
      const groupId = fypRegData._id;
      // console.log("Checking current logged in user fyp group", groupId);
      // console.log("Checking current logged in user fyp group", groupId);
      // console.log("Checking current logged in user fyp group", groupId);
      // console.log("Checking current logged in user data", currentUserId);
      // console.log("Checking current logged in user data", currentUserId);
      // console.log("Checking current logged in user data", currentUserId);
      // console.log("Checking current logged in user data", currentUserId);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };


      const url = `/api/suptopic/fetchFeedback?groupId=${groupId}`;


      // console.log("Before fetching FYP data");
      const response = await axios.get(url, config);


      // console.log("Checking Feedback of Fyp Group", response.data);

      if (response.status === 200) {
        setFypGroupFeedback(response.data.feedback);
        localStorage.setItem('GroupFeedback', JSON.stringify(response.data.feedback));

        console.log("Chekcing group feedbackkkkkkkkkkkkkk", FypGroupFeedback[0].feedback);

      } else {
        console.error('Error fetching user fyp group feedback:');
      }

    } catch (error) {
      console.error('Error during fetch Fyp Group Feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }





  useEffect(() => {
    fetchGroupFeedback();
    fetchTimetableData();
    // fetchAttendanceData();
  }, [])
  // console.log("Attendanceeeeeeeeeeeeeeeeeeeeee Dataaaaaaaaaaaaaaaa", AttendanceData);





  // console.log("Checking user data nowww", allStudentData);

  const fetchFypDetails = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      // console.log("Token:", key);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserRegNum = currentUser.registrationNumber;
      // console.log("Checking current logged in user data", currentUserRegNum);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };

      const url = `/api/fyp/fypdata?registrationNumber=${currentUserRegNum}`;


      console.log("Before fetching FYP data");
      const response = await axios.get(url, config);
      if (response.status === 404) {
        console.log("Data not Found");
        setIsLoading(false);
        return;
      }

      if (response.status === 200) {
        const FYPData = response.data.FYPDatas && response.data.FYPDatas.length > 0 ? response.data.FYPDatas[0] : null;
        if (!FYPData) {
          console.log("No registration details found in StdDashboard");
          setIsLoading(false);
          return;
        }
        // console.log("Checking FYPData", FYPData);

        // // Log the relevant properties
        // console.log('User ID:', FYPData._id);
        // console.log('Group Members:', FYPData.groupMembers);
        // console.log('Selected Option:', FYPData.selectedOption);
        // console.log('Selected Technology:', FYPData.selectedTechnology);
        // console.log('Selected Category:', FYPData.selectedCategory)

        localStorage.setItem('FYPData', JSON.stringify(FYPData));
        setFypData(FYPData);
        localStorage.setItem('isFormSubmitted', 'true');
      } else {
        console.error('Error fetching user fyp data:');
      }

    } catch (error) {
      console.error('Error during fetchFypDetails:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const CheckReqStatus = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      // console.log("Token:", key);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserRegNum = currentUser.registrationNumber;
      // console.log("Checking current logged in user data", currentUserRegNum);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };

      const url = `/api/fyp/fypdata?registrationNumber=${currentUserRegNum}`;


      console.log("Before fetching FYP data");
      const response = await axios.get(url, config);
      if (response.status === 404) {
        console.log("Data not Found");
        setIsLoading(false);
        return;

      }

      // console.log("Checking FYPData", FYPData);

      // // Log the relevant properties
      // console.log('User ID:', FYPData._id);
      // console.log('Group Members:', FYPData.groupMembers);
      // console.log('Selected Option:', FYPData.selectedOption);
      // console.log('Selected Technology:', FYPData.selectedTechnology);
      // console.log('Selected Category:', FYPData.selectedCategory)

      if (response.status === 200) {

        const FYPData = response.data.FYPDatas && response.data.FYPDatas.length > 0 ? response.data.FYPDatas[0] : null;
        if (!FYPData) {
          console.log("No request status data found");
          setIsLoading(false);
          return;
        }
        // if (FYPData.reqStatus === 'approved' && !hasReloaded.current) {
        //   window.location.reload(); // Reload the page
        //   hasReloaded.current = true; // Set the flag to indicate that the page has reloaded
        // }

        setReqStatus(FYPData.reqStatus);




      } else {
        console.error('Error fetching user fyp data:');
      }

    }
    catch (error) {
      console.error('Error during fetchFypDetails:', error);
    }
    finally {
      setIsLoading(false);

    }
  }

  useEffect(() => {
    CheckReqStatus();
  }, [])

  console.log("Checking Request Statussssssssssssssssssssssssss", ReqStatus);

  // useEffect(() => {
  //   console.log("ReqStatus:", ReqStatus);
  //   if (ReqStatus === 'approved' || ReqStatus === 'rejected') {
  //     window.location.reload();
  //   }
  // }, [ReqStatus])
  const fetchTimetableData = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const user = JSON.parse(localStorage.getItem("FYPData"));
      if (!user) {
        console.log("No user FYP registration found in localStorage.");
        setIsLoading(false);
        return;
      }
      // console.log("Checking user in supervisor timetable", user.selectedOption._id);
      const userId = user.selectedOption._id;
      // console.log("Checking user ID", userId);

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };

      const url = `/api/fyp/FetchStudTimetable?userId=${userId}`; // Update with the correct endpoint URL

      // console.log("Before fetching timetable data");
      const response = await axios.get(url, config);

      // console.log("Checking timetable data:", response.data);

      if (response.status === 200) {
        // console.log("Checking fetched supervisor timetable", response.data.timetableData[0]);
        setSupervisorTimetableData(response.data.timetableData[0]);
        // console.log('Timetable data fetched successfully');

        // Do something with the timetable data
      } else {

        console.error('Error fetching timetable data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch timetable data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("Checking supervisors timetable dataaaaaaaaaaaaaaaaaaaa", SupervisorTimetableData);



  const handleLearnMoreClick = () => {

    navigate('/Announcement');

  };




  useEffect(() => {
    fetchUserData();
    if (studentData && studentData.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    // 


    fetchUserData();
    fetchFypDetails();
  }, []);

  console.log("Checkinngggggggggggggggggggggggggggggggggggggggggggggg Req Status", ReqStatus);
  // useEffect(() => {
  //   console.log("ReqStatus:", ReqStatus);
  //   if (ReqStatus === 'approved' || ReqStatus === 'rejected') {
  //     window.location.reload();
  //   }
  // }, [ReqStatus === 'approved' || ReqStatus === 'rejected']);


  useEffect(() => {
    const img = new Image();
    img.src = '/assets/images/DashboardBanner.png';

    // img.onload = () => {
    setIsLoading(false); // Image loaded successfully
    // };

    img.onerror = () => {
      setIsLoading(true); // Image failed to load
    };


  }, []);

  // useEffect(() => {
  //   let isMounted = true; // Flag to check if component is mounted

  //   const loadData = async () => {
  //     try {


  //       setIsLoading(true); // Start loading
  // await fetchUserData();
  //       await fetchFypDetails();
  //       await fetchAllStudentsData();
  //       await fetchAllFacultyData();
  //       const img = new Image();
  //       img.src = '/assets/images/DashboardBanner.png';

  //       await new Promise((resolve, reject) => {
  //         img.onload = resolve; // Resolve the promise when the image loads successfully
  //         img.onerror = reject; // Reject the promise if the image fails to load
  //       });

  //       if (isMounted) {
  //         setIsLoading(false); // Set isLoading to false after all data is loaded
  //       }
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //       setIsLoading(true); // Set isLoading to true if any error occurs
  //     }
  //     finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData(); // Call loadData function

  //   // Clean up function to set isMounted to false when component unmounts
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // console.log("Checking last selectedDayDataaaaaaaaaaaa", selectedDayData);


  return (
    <>

      {isLoading ? (
        <LoadingSpinner />
      ) : showFeedback ? (
        <div className='mx-16 mt-10'>
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text="Feedback" accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              {FypGroupFeedback && (
                <div className="pt-0 pb-0 max-h-52 h-52 bg-white border border-b-0 border-gray-200 relative">
                  <p className='pl-4 mt-1'>{FypGroupFeedback[0].feedback}</p>
                  <div className="table-container overflow-x-auto relative">
                    <div className="flex justify-end items-center"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row justify-end mr-9 mt-2'>
            <button
              type='button'
              className='text-white py-3 px-12 mt-3 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium  text-sm '
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className='relative'>
          <img src='/assets/images/DashboardBanner.png' alt='Dashboard Banner' className='w-full object-cover' />
          <div className='absolute inset-0 bg-white opacity-10 pointer-events-none'></div>

          <div className='announcement pl-20 pt-14 bg-slate-50 pr-20'>
            <h1 className='font-bold text-4xl mt-20'>Announcements

              {/* {FypData ? FypData.groupMembers.join(', ') : 'Loading...'}   */}
            </h1>
            {isFYPRegistered && (
              <div>
                <div className='announcementSection bg-white rounded-3xl border-gray-200 p-6 h-36 mt-5 mb-3 mr-48' style={{ border: '1px solid #e5e7eb' }}>
                  <div className='flex space-x-2'>
                    <div className='smallCircle w-6 h-6 flex items-center justify-center bg-gry text-white rounded-full text-xs'>
                      {announcementCount ? announcementCount : '0'}
                    </div>
                    <h1 className='font-medium'>Announcement Notification</h1>

                  </div>

                  <div className='announcementLinkButtons mt-3 flex flex-row space-x-5'>
                    <div className='LearnMore flex flex-row space-x-1 mt-3' onClick={handleView}>
                      <a href='#' className='font-medium text-green-600 hover:underline' onClick={handleLearnMoreClick}>
                        Learn More
                      </a>
                      <GoArrowUpRight className='w-4 h-4 mt-1 text-green-600' />
                    </div>

                  </div>
                </div>
              </div>
            )}


            {!isFYPRegistered && (
              <div>
                <div className='announcementSection bg-white rounded-3xl border-gray-200 p-6 h-36 mt-5 mb-3 mr-48' style={{ border: '1px solid #e5e7eb' }}>
                  <div className='flex space-x-2'>
                    <div className='smallCircle w-6 h-6 flex items-center justify-center bg-gry text-white rounded-full text-xs'>
                      {announcementCount ? announcementCount : '0'}
                    </div>
                    <h1 className='font-medium'>Announcement Notifications</h1>
                  </div>
                  {showRegAnnouncement && (
                    <div className='notificationDescription ml-8 mt-2 text-sm max-h-14 overflow-y-auto flex flex-row space-x-2'>
                      <p className='font-semibold text-sm text-black'>Register your FYP here! </p>
                      <a href='#' className='font-semibold hover:underline  text-sm text-green-600' onClick={handleRegisterFYP}>
                        Register your FYP!
                      </a>
                    </div>
                  )}
                  <div className='announcementLinkButtons mt-3 flex flex-row space-x-5'>
                    <div className='LearnMore flex flex-row space-x-1' onClick={handleView}>
                      <a href='#' className='font-medium text-green-600 hover:underline ' onClick={handleLearnMoreClick}>
                        Learn More
                      </a>
                      <GoArrowUpRight className='w-4 h-4 mt-1 text-green-600' />
                    </div>

                  </div>
                </div>

              </div>
            )}
            <div>
              {FypData ? (
                <div className='TitleCard w-96 h-72 overflow-hidden overflow-y-auto'>

                  {/* <a href='/' className='block max-w-md p-6 pb-0 bg-primary border border-gray-200 rounded-2xl shadow hover:bg-[#514B96 ]'> */}


                  <div className='ml-3 text-gray-800 block max-w-md p-6 pb-0 bg-white border border-gray-200 rounded-2xl shadow-md border-l-4 border-primary'>
                    <h5 className='mb-2 text-2xl font-bold tracking-tight text-primary'> FYP-I Attendance</h5>
                    <div className='TitleAndApprovedStatus flex flex-row space-x-2 justify-between'>
                      <h5 className='mb-2 text-lg font-normal tracking-tight dark:text-white'>FYP Title</h5>
                      <div className='flex flex-row space-x-2'>
                        <h5 className='mb-2 text-base font-normal tracking-tigh'>Status: </h5>
                        <h5 className={`mb-2 text-base font-normal tracking-tight ${FypData && FypData.reqStatus === "pending" ? 'text-white' : FypData.reqStatus === "approved" ? 'text-green-500' : FypData.reqStatus === "rejected" ? 'text-red-500' : FypData && FypData.reqStatus === "partial-deny" ? 'text-yellow-500' : ''}`}>
                          {FypData && FypData.reqStatus}
                        </h5>
                      </div>

                    </div>

                    <div className='flex flex-row space-x-20 ml-2'>
                      <p className='font-semibold text-lg '>{FypData.topicData.topic}</p>
                      <div className=''>
                        {FypData && (FypData.reqStatus === "rejected" || FypData.reqStatus === "partial-deny") && (
                          <button className="underline" onClick={handleViewFeedback}>View Feedback</button>
                        )}
                      </div>
                    </div>
                    <div className='mt-6 flex flex-row space-x-3'>
                      {FypData && (FypData.reqStatus === "pending" || FypData.reqStatus === "partial-deny") ? (
                        <div className='flex flex-row space-x-2'>
                          <p className='text-secondary'>Supervision Request to: </p>
                          <p className='text-white'>{FypData && FypData.selectedOption?.name}</p>
                        </div>
                      ) : (
                        <div className='flex flex-row space-x-2'>
                          <p className='text-secondary'>Supervised by: </p>
                          <p className='text-white'>{FypData && FypData.selectedOption?.name} </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* </a> */}
                </div>
              ) : (
                null
              )}
            </div>



            {studentData ? (
              DashData.map((item, index) => (

                <div key={index} className='max-w-lg bg-white border border-gray-200 rounded-lg shadow     absolute inset-0 mx-auto h-60 mt-20'>
                  <a href='#'>
                    <img className='rounded-t-lg h-24' src='/assets/images/CardBg.png' alt='Card back' />
                  </a>
                  <div className='h-[5.625rem] mt-[-4.0625rem] rounded-full'>
                    <img 
                      className='rounded-full w-24 h-24 object-fill mx-auto' 
                      src={studentData?.image && studentData.image !== "undefined" && studentData.image !== "" ? `/uploads/${studentData.image}` : '/assets/images/CardImg.png'} 
                      alt='Student Profile' 
                      onError={(e) => {
                        e.target.src = '/assets/images/CardImg.png';
                      }}
                    />
                  </div>
                  <div className='p-5'>
                    <div className='StudentName'>
                      <h1 className='font-bold text-center'>{studentData ? studentData?.name : 'Loading...'}</h1>
                      <p className='font-light text-sm text-center'>{studentData ? studentData.role : 'Loading...'}</p>
                    </div>
                    <div className='regCgpa flex flex-row justify-center space-x-10 text-xs ml-1 mt-2'>
                      <div className='text-center'>
                        <h1 className='font-bold'>Registration No</h1>
                        <p className='font-light'>{studentData ? studentData.registrationNumber : 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold'>Program</h1>
                        <p className='font-light'>{studentData ? studentData.program.programTitle : 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold'>CGPA</h1>
                        <p className='font-light'>{studentData ? studentData.cgpa : 'Loading...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              null
            )}


            {isFYPRegistered && (
              <div>

                <div className='projDetails md:mt-9 ' onClick={ProjDetVigetToProjDet}>
                  {/* <ProjDetails data={projectInfoData} isFYPRegistered={isFYPRegistered} /> */}
                  <ProjDetails />
                </div>

                {/* <div className='AttendaceDetails '>
    <Attendance data={AttendenceData} />
  </div> */}


                <div className=' rounded-2xl hover:cursor-pointer' onClick={AttendanceVigetToAttendDet}>
                  {/* <div className='AttendanceDetails'>
            <Attendance data={AttendenceData} GroupAttendanceData={GroupAttendance} />
          </div> */}
                </div>

                <div className='mt-8 font-semibold text-lg'>
                  <div className='grid grid-cols-2 w-[87%] gap-20'>
                    <div className='supervisorSlots'>
                      <h1 className='text-black'>Supervisor's free slots</h1>
                    </div>
                    <div className='groupMembers'>
                      <h1 className='text-black'>Group Members</h1>
                    </div>
                  </div>
                  <div className='w-[92%] grid grid-cols-2 gap-0 mt-3'>
                    <div className='rounded-3xl bg-white w-[90%] hover:bg-slate-100 hover:cursor-pointer' onClick={dashToSupTimetable}>

                      <div className='h-56 w-[87%] mt-9 mb-0 mx-auto'>
                        {SupervisorTimetableData && SupervisorTimetableData ? (
                          <div className="rounded-3xl w-full p-2 bg-white border border-gray-200 shadow-md grid grid-cols-2 overflow-hidden border-l-4 border-primary">
                            <div className='text-gray-800 h-32 p-3'>
                              <p className='font-normal text-gray-500'>Day: {currentDate}</p>
                              <p className='font-bold mt-1 text-primary'>Free Slots</p>
                              <div className='h-24 md:h-20 overflow-y-auto '>
                                {selectedDayData ? (
                                  selectedDayData.Slots
                                    .filter(slot => slot.class === 'available')
                                    .map((slot, index) => (
                                      <p key={index} className='font-normal mt-2 text-sm text-gray-700'>Slot {index + 1} : {slot.slot}</p>
                                    ))
                                ) : (
                                  <p className='text-gray-400 italic text-sm mt-2'>No slots available for today</p>
                                )}
                              </div>
                              <div className='mb-0'>
                                <button className="text-primary hover:text-secondary underline text-xs font-bold transition-colors" onClick={dashToSupTimetable} >View All</button>
                              </div>
                            </div>
                            <div className='freeslotback relative w-80 md:w-auto h-44 pr-12 md:pr-0 border-l border-gray-100'>
                              <img src='/assets/images/freeSlotsBack.png' alt='SupervisorName' className='w-full h-full object-cover' />
                              <div className='absolute inset-0 flex flex-wrap justify-center mt-3 ml-10'>
                                <p className='text-white text-base font-bold w-36'>{FypData && FypData.selectedOption?.name}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className='text-center text-sm  font-normal text-gray-500'>Supervisor Not Uploaded Their Timetable yet</p>
                        )}
                      </div>

                    </div>
                    <div className='bg-white rounded-2xl hover:bg-slate-100 hover:cursor-pointer' onClick={panelCardToProjDet}>
                      <div className='groupMemDetails'>
                        <GroupMembers />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      )}



    </>
  );
};

export default Dashboard;

