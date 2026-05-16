import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import FYPgroupDetails from './SupFYPgroupDetails';
import SupervisionRequests from '../SupRequest/SupSupervisionReqTable';
import ChangeRequests from '../SupRequest/SupFYPChangeReqTable';
import { initFlowbite } from 'flowbite';
import axios from 'axios';

import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';


const Dashboard = () => {
  const currentDate = new Date().toLocaleString('en-US', { weekday: 'long' });
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showSupervisionRequests, setShowSupervisionRequests] = useState(true);
  const [showFYPGroups, setShowFYPGroups] = useState(true);
  const [showChangeRequests, setShowChangeRequests] = useState(true);
  // const [isPanelDetailsOpen, setIsPanelDetailsOpen] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [supData, setSupData] = useState(null);
  const [supRequests, setSupRequests] = useState(null);
  const [approvedProjects, setApprovedProjects] = useState(null);
  const [fypChangeRequests, setFypChangeRequests] = useState(null);
  const [announcementCount, setAnnouncementCount] = useState(0);
  // const [SlotsData, setSlotsData] = useState([]);
  const [allAnnouncements, setAllAnnouncement] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setShowSupervisionRequests(true);
    setShowFYPGroups(true);
    setShowChangeRequests(true);
  }, [navigate])



  const learnMoreAnnouncementClick = () => {
    // Show the announcement text when the "View" button is clicked
    navigate('/SupAnnouncements')
    //setShowAnnouncement(true);
  };

  // const handleViewDetails = () => {
  //   // Redirect to the Project Details tab with the Panel Details section open
  //   // navigate(/ProjectDetails?tab=PanelDetails);

  // };
  const handleViewClick = (id) => {
    console.log('IDDD', id)
    navigate(`/SupRequest?supid=${id}`);

  }

  const handleViewTimetableClick = () => {

    navigate(`/SupTimetable?id=${101}`)

  }

  const handleViewAllClick = () => {

    navigate('/SupPrevSupProj')

  }
  const viewDetailsClickFYPChange = (id) => {

    navigate(`/SupRequest?id=${id}`)

  }

  const viewprojectdetailClick = (id) => {

    //const queryString = new URLSearchParams(id).toString();
    navigate(`/SupPrevSupProj?id=${id}`)

  }




  // const afterregistration = () => {
  //   setShowChangeRequests(true);
  //   setShowSupervisionRequests(false);
  //   setShowFYPGroups(true);

  // }


  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupDashboard';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }

  }, []);







  // const fetchFacultyData = async () => {
  //   console.log("Inside fetch Faculty Data");
  //   try {
  //     setLoadingSpinner(true);
  //     const token = localStorage.getItem('key');
  //     const userData = localStorage.getItem('user');
  //     const parsedUserData = JSON.parse(userData);
  //     const userId = parsedUserData._id;

  //     console.log('user dekh lo', userId);
  //     const response = await fetch(`/api/auth/fetchFacultyData/${userId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'

  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch Data');
  //     }

  //     const data = await response.json();
  //     console.log("Fetched Faculty:", data);


  //     const filteredData = {
  //       _id: data.faculties._id,
  //       name: data.faculties.name,
  //       designation: data.faculties.designation,
  //       role: data.faculties.role,
  //       department: data.faculties.department.departmentName,
  //       program: data.faculties.program.programTitle
  //     };
  //     console.log("filtered Faculty:", filteredData);
  //     setSupData(filteredData);

  //     console.log('Programs data', supData);
  //   } catch (error) {
  //     console.error('Error fetching Data:', error.message);
  //   } finally {
  //     setLoadingSpinner(false);
  //   }
  // };






























  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingSpinner(true);
        const token = localStorage.getItem('key');

        const userData = localStorage.getItem('user');
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData._id;

        const response = await fetch(`/api/fyp/fyprequests/${userId}`, {
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


        console.log('Requested Data', data)
        let serialNum = 1;
        const reqData = data.fypRequests.map(data => {
          //  const date = new Date(data.reqDate);
          //  const formattedDate = date.toISOString().slice(0, 10);

          return {
            _id: data._id,
            groupNo: serialNum++,
            fypTitle: data.topicData.topic,
            SuprvisionRequest: data.reqDate,
            reqStatus: data.reqStatus,
          };
        });



        setSupRequests(reqData);

      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };


    const fetchApprovedGroups = async () => {
      try {
        setLoadingSpinner(true);
        const token = localStorage.getItem('key');
        const userData = localStorage.getItem('user');
        const parsedUserData = JSON.parse(userData);
        const userid = parsedUserData._id;
        // const filter = "approved";

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
          })),
          SuprvisionRequest: data.reqDate,
          term: data.groupMembers[0].term.sessionTerm,
          status: data.reqStatus,
        })); console.log('Real Data', reqData);


        setApprovedProjects(reqData);
        console.log(approvedProjects, 'yaha ha hum')
      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };

    const fetchChangeRequests = async () => {
      try {
        setLoadingSpinner(true);
        const token = localStorage.getItem('key');

        const userData = localStorage.getItem('user');
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData._id;
        const response = await fetch(`/api/fyp/fyp-change-requests/${userId}`, {
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
        const reqData = data.filteredChangeRequests.map(data => {

          return {
            _id: data.fypGroup._id,
            groupNo: serialNum++,
            fypTitle: data.fypGroup.topicData.topic,
            platform: data.fypGroup.selectedPlatform.platformName,
            technology: data.fypGroup.selectedTechnology.techName,
            category: data.fypGroup.topicData.category,
            description: data.fypGroup.topicData.description,
            term: data.requestedBy.term,
          };

        });



        setFypChangeRequests(reqData);
        console.log(data);


      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };

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
          if (response.data.timetableData.length === 0) {
            console.log("Runninggggggggggggggggg");
          }
          else {
            // Handle successful response
            // setSlotsData(response.data.timetableData[0]);

            const foundDayData = response.data.timetableData[0][currentDate];
            setSelectedDayData(foundDayData);
            console.log("tmetable", response.data.timetableData[0])
            console.log("current tmetable", foundDayData)

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

    const fetchUserData = async () => {
      const key = JSON.parse(localStorage.getItem("key"));
      // console.log(key);
      try {
        setLoadingSpinner(true);
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



        const filteredData = {
          _id: response.data.user._id,
          name: response.data.user.name,
          designation: response.data.user.designation,
          role: response.data.user.role,
          department: response.data.user.department.departmentName,
          program: response.data.user.program.programTitle,
          image: response.data.user.image,
        };
        console.log("filtered Faculty:", filteredData);
        setSupData(filteredData);

        localStorage.setItem('studentData', JSON.stringify(response.data.user));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingSpinner(false);
      }
    };


    const fetchAnnnouncements = async () => {
      try {
        setLoadingSpinner(true); // Show loading spinner while processing

        const userData = localStorage.getItem('user');
        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData._id;
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);

        const response = await fetch(`/api/auth/get-supannouncement/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'

          },
        });
        const data = await response.json();
        const otherAnnouncements = data.announcements.otherAnnouncements;
        const announcementCount = otherAnnouncements.length;

        console.log('Number of other announcements:', otherAnnouncements);
        //  setAnnouncementCount(announcementCount);
        setAllAnnouncement(otherAnnouncements);

        // console.log("Print kr do bhai !!!",newAnnouncement);
        // console.log("Yeh bhi Print kr do bhai !!!",AllAnnouncement);

      }
      catch (error) {
        console.error('Error Fetching Announcements:', error);
        // Handle network errors or other exceptions
      } finally {
        setLoadingSpinner(false); // Hide loading spinner after processing
      }
    }

    const fetchAnnouncementData = async () => {

      try {
        setLoadingSpinner(true);
        const key = JSON.parse(localStorage.getItem("key"));
        const userData = JSON.parse(localStorage.getItem("user"));
        const Role = userData.role;
        let role = '';
        if (Role === 'faculty' || Role === 'hod' || Role === 'coordinator') {
          role = 'supervisor'
        }
        console.log("Checking Role of Studenttttttttt", role);

        let SendStatus = 'supervisors';

        let supervisorId = userData._id;




        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

        // Construct the URL with partStatus, supervisorId, and coordinatorId
        const url = `/api/CoordAnnouncementRoutes/announcementsByStatus?role=${role}&status=${SendStatus}&supervisorId=${supervisorId}`;

        const response = await axios.get(url, config);

        if (response.status !== 497) {
          if (!response.data || !response.data) {
            console.error('Error fetching announcement data:', response.statusText);
            return;
          }
        } else {
          // Force recompile
          navigate('/login');
        }
        console.log("Checking fetching Announcement Data", response.data);
        const annCount = response.data.length;
        setAnnouncementCount(annCount);
        console.log("Checking ANnouncement Count", annCount);



        // Process the fetched announcement data
        // Assuming you have a function to handle this, e.g., setAnnouncementData
        // setAnnouncementData(response.data);

        // Optionally, you can save the announcement data to localStorage
        // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
      } catch (error) {
        console.error('Error fetching announcement data:', error);
      } finally {
        setLoadingSpinner(false);
      }
    };

    //fetchFacultyData();
    fetchRequests();
    fetchApprovedGroups();
    fetchChangeRequests();
    fetchTimetableData();
    fetchUserData();
    fetchAnnnouncements();
    fetchAnnouncementData();

  }, []);









  useEffect(() => { }, [])


  console.log("Sup", supData)























  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className="">

          <div className='relative'>
            <img src='/assets/images/DashboardBanner.png' alt='Dashboard Banner' className='w-full object-cover' />
            <div className='absolute inset-0 bg-white opacity-10 pointer-events-none'></div>
            <div className='announcement pl-20 md:pl-10 pt-14 bg-slate-50 pr-20 md:pr-10'>
              <h1 className='font-bold text-4xl mt-20 lg:mt-28'>Announcements</h1>

              <div>
                <div className='announcementSection bg-white rounded-3xl border-gray-200 p-6 h-36 mt-5 mb-3 mr-48 w-[100%]' style={{ border: '1px solid #e5e7eb' }}>
                  <div className='flex space-x-2'>
                    <div className='smallCircle w-6 h-6 flex items-center justify-center bg-gry text-white rounded-full text-xs'>
                      {announcementCount ? announcementCount : '0'}
                    </div>
                    <h1 className='font-medium'>Announcement Notifications</h1>
                  </div>
                  {showAnnouncement && (allAnnouncements && allAnnouncements.length > 0) && (
                    <div className='notificationDescription ml-8 mt-2 text-sm max-h-14 overflow-y-auto flex flex-row space-x-2'>
                      <p className='font-semibold text-sm text-black'>{allAnnouncements[announcementCount - 1].title}</p>

                    </div>
                  )}
                  <div className='announcementLinkButtons mt-3 flex flex-row space-x-5'>
                    <div className='LearnMore flex flex-row space-x-1 mt-5' onClick={learnMoreAnnouncementClick}>
                      <button className='font-medium text-green-600 hover:underline'>
                        Learn More
                      </button>
                      <GoArrowUpRight className='w-4 h-4 mt-1 text-green-600' />
                    </div>

                  </div>
                </div>
              </div>



              {supData && (<div className='max-w-lg bg-white border border-gray-200 rounded-lg shadow  absolute inset-0 mx-auto h-64 mt-20'>
                <button>
                  <img className='rounded-t-lg h-24' src='/assets/images/CardBg.png' alt='Cards backgrounds' />
                </button>
                <div className='h-[5.625rem] mt-[-4.0625rem]'>
                  <img className='rounded-full w-24 h-24 object-contain mx-auto' src={`/uploads/${supData.image}`} alt='Card' />
                </div>
                <div className='p-5'>
                  <div className='StudentName'>
                    <h1 className='font-bold text-center'>{supData.name}</h1>
                    <p className='font-light text-sm text-center'>{supData.designation}</p>
                  </div>
                  <div className='regCgpa flex flex-row justify-center space-x-10 text-xs ml-1 mt-2'>
                    <div className='text-center'>
                      <h1 className='font-bold'>Role</h1>
                      <p className='font-light'>{supData.role}</p>
                    </div>
                    <div className='text-center'>
                      <h1 className='font-bold'>Department</h1>
                      <p className='font-light'>{supData.department}</p>
                    </div>
                    <div className='text-center'>
                      <h1 className='font-bold'>Qualification</h1>
                      <p className='font-light'>{supData.program}</p>
                    </div>
                    <div className='text-center'>
                      <h1 className='font-bold'>Designation</h1>
                      <p className='font-light'>{supData.designation}</p>
                    </div>
                  </div>
                </div>
              </div>)}
              <div className=' grid grid-cols-12 '>
                <div className='projDetails col-span-10'>
                  <div className='my-4 mx-3'>
                    <span className='text-primary font-bold text-2xl uppercase tracking-tight'>My Timetable</span>
                  </div>
                  <div className='h-53 w-[40%] mb-0'>
                    {supData && (<div href="#" className="rounded-3xl w-full p-2 bg-white border border-gray-200 shadow-md grid grid-cols-2 overflow-hidden">
                      <div className='text-gray-800 h-32 p-3 border-l-4 border-primary'>
                        <p className='font-normal text-gray-500'>Day: {currentDate}</p>
                        <p className='font-bold mt-1 text-primary'>Free Slots</p>
                        <div className='h-24 md:h-20 overflow-y-auto '>
                          {selectedDayData ? (
                            selectedDayData
                              .filter(slot => slot.class === 'available')
                              .map((slot, index) => (
                                <p key={index} className='font-normal mt-2 text-sm text-gray-700'>Slot {index + 1} : {slot.slot}</p>
                              ))
                          ) : (
                            <p className='text-gray-400 italic text-sm mt-2'>No slots available for today</p>
                          )}
                        </div>
                        <div className='mb-0'>
                          <button className="text-primary hover:text-secondary underline text-xs font-bold transition-colors" onClick={handleViewTimetableClick} >View All</button>
                        </div>
                      </div>

                      <div className='freeslotback relative w-80 md:w-auto h-44 pr-12 md:pr-0 border-l border-gray-100'>
                        <img src='/assets/images/freeSlotsBack.png' alt='SupervisorName' className='w-full h-full object-cover' />
                        <div className='absolute inset-0 flex flex-wrap justify-center mt-3 ml-10 md:ml-6 '>
                          <p className='text-white text-base font-bold w-36'>{supData.name}</p>
                        </div>
                      </div>
                    </div>)}
                  </div>
                </div>
                {/* <div className="test">
                  <Simple text={'After Registration'} onClick={afterregistration} />
                </div> */}
                {showSupervisionRequests && supRequests && (

                  <div className='supervisionreq col-span-12 my-1'>
                    <h1 className='text-primary text-2xl font-bold my-4 mx-4 uppercase tracking-tight'>Supervision Requests</h1>
                    <SupervisionRequests groupData={supRequests} viewButtonClick={handleViewClick} />
                  </div>
                )}
                {showFYPGroups && approvedProjects && (<div className='projDetails col-span-8 my-1'>
                  <FYPgroupDetails data={approvedProjects} clickOnviewAllinFYPGroup={handleViewAllClick} viewprojectdetailClick={viewprojectdetailClick} />
                </div>)}
                <div className=' col-span-4'>

                </div>
              </div>
              {showChangeRequests && (<div className=' ChangeReq '>
                <h1 className='text-primary text-2xl font-bold my-4 mx-4 uppercase tracking-tight'>Change Requests</h1>
                <ChangeRequests groupData={fypChangeRequests} viewDetailsClickFYPChange={viewDetailsClickFYPChange} />
              </div>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
