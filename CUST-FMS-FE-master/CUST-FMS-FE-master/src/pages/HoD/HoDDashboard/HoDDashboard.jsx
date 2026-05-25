import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HoDDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [HoDData, setHoDData] = useState('');
  const [PanelCount, setPanelCount] = useState('');
  const [StudCount, setStudCount] = useState('');
  const [ProjCount, setProjCount] = useState('');
  const [ResultCount, setResultCount] = useState('');

  useEffect(() => {
    // Fetch data from local storage
    const userData = localStorage.getItem('user');

    // Check if userData is not null
    if (userData) {
      // Parse the JSON string to an object
      const parsedUserData = JSON.parse(userData);

      // Set the parsed user data to the state
      setHoDData(parsedUserData);
    }

    // Fetch fresh user data from backend to ensure profile picture and other info is synchronized in real-time
    const fetchFreshUserData = async () => {
      const key = localStorage.getItem("key") ? JSON.parse(localStorage.getItem("key")) : null;
      if (!key) return;
      try {
        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
        const response = await axios.get('/api/auth/GenUserData', config);
        if (response.status !== 497 && response.data && response.data.user) {
          setHoDData(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching fresh user data:', error);
      }
    };

    fetchFreshUserData();
  }, []);


  const handleViewExamPanels = () => {
    navigate('/HoDExaminerPanel');
  };

  const handleViewStudents = () => {
    navigate('/HoDStudentList');
  };

  const handleViewProjects = () => {
    navigate('/HoDProjectList');
  };

  const handleViewResults = () => {
    navigate('/HoDResults');
  };

  useEffect(() => {
    fetchExaminerPanelCount();
    fetchStudentCount();
    fetchProjectCount();
    fetchResultCount();
  }, [])

  const fetchExaminerPanelCount = async () => {

    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      const userData = JSON.parse(localStorage.getItem("user"));
      const depId = userData?.department?._id || userData?.department;

      if (!depId) {
        console.warn('No department ID found for examiner panel count fetch');
        return;
      }

      // Construct the URL with department ID string
      const url = `/api/manageexampanels/getPanelCount/${depId}`;

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching Examiner Panel Count:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Checking Total Panel Countsssssssssssssssssssssssss", response.data.totalPanels);

      setPanelCount(response.data.totalPanels);

    } catch (error) {
      console.error('Error fetching Coordinator ID:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchStudentCount = async () => {

    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      const userData = JSON.parse(localStorage.getItem("user"));
      const depId = userData?.department?._id || userData?.department;

      // Construct the URL with department ID parameter
      const url = depId ? `/api/fyp/GetStudentCount/${depId}` : '/api/fyp/GetStudentCount/all';

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching Student Count:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Studdddddd Count", response.data.studentCount);

      setStudCount(response.data.studentCount);

    } catch (error) {
      console.error('Error fetching Student Count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectCount = async () => {

    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Construct the URL
      const url = '/api/fyp/GetProjectCount';

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching Project Count:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Projecttttttttt Count", response.data.projectCount);

      setProjCount(response.data.projectCount);

    } catch (error) {
      console.error('Error fetching Project Count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResultCount = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      const response = await axios.get('/api/ExamType/GetCreatedExamType', config);
      if (response.data && Array.isArray(response.data)) {
        // dynamic count of created exams + 1 (Overall Result)
        setResultCount(response.data.length + 1);
      }
    } catch (error) {
      console.error('Error fetching Result Count:', error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className='relative'>
            <img src='/assets/images/DashboardBanner.png' alt='Dashboard Banner' className='w-full object-cover' />
            <div className='absolute inset-0 bg-white opacity-10 pointer-events-none'></div>

            <div className='max-w-lg bg-white border border-gray-200 rounded-lg shadow     absolute inset-0 mx-auto h-60 mt-28 z-10'>
              <a href='#'>
                <img className='rounded-t-lg h-24 w-full object-cover' src='/assets/images/CardBg.png' alt='Cards background' />
              </a>
              <div className='h-[5.625rem] mt-[-4.0625rem] rounded-full relative z-20'>
                {HoDData?.image && HoDData.image !== "undefined" && HoDData.image !== "" ? (
                  <img
                    className='rounded-full w-24 h-24 object-fill mx-auto border-white border-4 shadow-md bg-white'
                    src={`/uploads/${HoDData.image}`}
                    alt='Card Image'
                    onError={(e) => {
                      e.target.src = '/assets/images/CardImg.png';
                    }}
                  />
                ) : (
                  <div className='rounded-full w-24 h-24 mx-auto border-white border-4 shadow-md bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-bold uppercase'>
                    {HoDData?.name ? HoDData.name.charAt(0).toUpperCase() : 'H'}
                  </div>
                )}
              </div>
              <div className='p-5 '>
                <div className='AdmName'>
                  <h1 className='font-bold text-center'>{HoDData ? HoDData.name : 'Loading...'}</h1>
                  <p className='font-light text-sm text-center'>{HoDData ? HoDData.role : 'Loading...'}</p>
                </div>
                <div className='regCgpa flex flex-row justify-center space-x-10 text-xs ml-1 mt-2'>
                  <div className='text-center'>
                    <h1 className='font-bold'>CNIC</h1>
                    <p className='font-light'>{HoDData ? HoDData.cnic : 'Loading...'}</p>
                  </div>
                  <div className='text-center'>
                    <h1 className='font-bold'>Email</h1>
                    <p className='font-light'>{HoDData ? HoDData.email : 'Loading...'}</p>
                  </div>
                  <div className='text-center'>
                    <h1 className='font-bold'>Phone no.</h1>
                    <p className='font-light'>{HoDData ? HoDData.phoneNumber : 'Loading...'}</p>
                  </div>
                  {/* <div className='text-center'>
                  <h1 className='font-bold'>ID</h1>
                  <p className='font-light'>{AdmData ? AdmData.facultyId : 'Loading...'}</p>
                </div> */}
                </div>
              </div>
            </div>
          </div>


          <div className='mx-16'>
            <div className='StudentCards  flex flex-row space-x-6 mt-40'>
              <div className='StudentCard max-w-3xl w-96 h-64 '>
                <a href='/HoDExaminerPanel' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                  <div className='ml-3 text-white'>
                    <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                      <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Examiner Panels</h5>
                    </div>
                    <p className='font-bold text-3xl text-primary'>{PanelCount || 0}</p>

                    <button
                      type='button'
                      className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                      onClick={handleViewExamPanels}
                    >
                      View
                    </button>
                  </div>
                </a>
              </div>

              <div className='FacultyCard max-w-3xl w-96 h-52 '>
                <a href='/HoDStudentList' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                  <div className='ml-3 text-white'>
                    <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                      <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Students</h5>
                    </div>
                    <p className='font-bold text-3xl text-primary'>{StudCount || 0}</p>

                    <button
                      type='button'
                      className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                      onClick={handleViewStudents}
                    >
                      View
                    </button>
                  </div>
                </a>
              </div>

              <div className='FYPSessionCard max-w-3xl w-96 h-52 '>
                <a href='/HoDProjectList' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                  <div className='ml-3 text-white'>
                    <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                      <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Projects</h5>
                    </div>
                    <p className='font-bold text-3xl text-primary'>{ProjCount || 0}</p>

                    <button
                      type='button'
                      className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                      onClick={handleViewProjects}
                    >
                      View
                    </button>
                  </div>
                </a>
              </div>
              <div className='DepartmentCard max-w-3xl w-96 h-52 '>
                <a href='/HoDResults' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                  <div className='ml-3 text-white'>
                    <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                      <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Results</h5>
                    </div>
                    <p className='font-bold text-3xl text-primary '>{ResultCount || 0}</p>

                    <button
                      type='button'
                      className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                      onClick={handleViewResults}
                    >
                      View
                    </button>
                  </div>
                </a>
              </div>




            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HoDDashboard;
