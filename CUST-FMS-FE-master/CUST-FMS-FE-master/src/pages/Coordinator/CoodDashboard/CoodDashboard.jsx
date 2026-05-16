import React, { useEffect, useState } from 'react'
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { Navigate, useNavigate } from 'react-router-dom';
import GradeCard from '../../../Components/Cards/GradeCard';
// import AdmStudentDetails from './AdmStudentDetails';
// import AdmFacultyDetails from './AdmFacultyDetails';
import axios from 'axios';
import { initFlowbite } from 'flowbite';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { Select } from 'flowbite-react';
import Exams from './Exams';
import ExaminerPanels from './ExaminerPanels';

const CoodDashboard = () => {
const [AdmData,setAdmData] = useState('');
const [isLoading, setIsLoading] = useState(false);
// const [studentCount, setStudentCount] = useState(null);
const [programCount, setProgramCount] = useState(null);
const [hideFacStudTab, setHideFacStudTab] = useState(null);
const [fyptermCount, setFYPTermCount] = useState(null);
const [students, setStudents] = useState([]);
const [faculties, setFaculty] = useState([]);
const [departmentCount, setDepartmentCount] = useState(null);
    const navigate = useNavigate();
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [creditHours, setCreditHours] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [gpa, setGpa] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [secondaryEmail, setSecondaryEmail] = useState('');
    const [cnic, setCnic] = useState('');
    const [address, setAddress] = useState('');
    const [NoStudentsFound, setNoStudentsFound] = useState(false);
    const [showStudModal, setShowStudModal] = useState(false);
    const [showFacModal, setShowFacModal] = useState(false);
   
    
    const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [facultyId, setFacultyId] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [facPhoneNumber, setFacPhoneNumber] = useState('');
  // const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  // const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  // const [selectedTerm, setSelectedTerm] = useState(null);
  const [extension, setExtension] = useState('');
  const [dob, setDob] = useState('');
  // const [email, setEmail] = useState('');
  // const [secondaryEmail, setSecondaryEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  // const [cnic, setCnic] = useState('');
  // const [address, setAddress] = useState('');
  const [CoordinatorData, setCoordinatorData] = useState('');
  const [PanelCount, setPanelCount] = useState('');
  const [ExamCount, setExamCount] = useState('');
 
  useEffect(() => {
    // Fetch data from local storage
    const userData = localStorage.getItem('user');
    
    // Check if userData is not null
    if (userData) {
      // Parse the JSON string to an object
      const parsedUserData = JSON.parse(userData);
      
      // Set the parsed user data to the state
      setCoordinatorData(parsedUserData);
    }
  }, []); 

  const fetchExaminerPanelCount = async () => {

    try{
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
    const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      
    // Construct the URL with partStatus, supervisorId, and coordinatorId
    const url = '/api/manageexampanels/getPanelCount';

    const response = await axios.get(url, config);

    if (response.status !== 497) {
      if (!response.data || !response.data) {
        console.error('Error fetching Examiner Panel Count:', response.statusText);
        return;
      }
    } else {
      navigate('/login');
    }

    setPanelCount(response.data.totalPanels);

  } catch (error) {
    console.error('Error fetching Coordinator ID:', error);
  } finally {
    setIsLoading(false);
  }
};
  const fetchExamCount = async () => {

    try{
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
    const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      
    // Construct the URL with partStatus, supervisorId, and coordinatorId
    const url = '/api/ExamCreationRoutes/examCount';

    const response = await axios.get(url, config);

    if (response.status !== 497) {
      if (!response.data || !response.data) {
        console.error('Error fetching Exams Count:', response.statusText);
        return;
      }
    } else {
      navigate('/login');
    }

    setExamCount(response.data.totalExams);

  } catch (error) {
    console.error('Error fetching Coordinator ID:', error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
    fetchExaminerPanelCount();
}, [])
useEffect(() => {
    fetchExamCount();
}, [])



  const handleCreateFYPRegistration = () => {
    navigate('/CoodFypRegistration');
  };

  const handleViewExaminerPanels = () => {
    navigate('/CoodExaminerPanel');
  };

  const handleViewResults = () => {
    navigate('/CoodResults');
  };
    
  const handleCreateExam = () => {
    navigate('/CoodCreateExam');
  };

  
   

      // if data is send as a prop 
      // useEffect(() => {

      //   if (AdmData && Object.keys(AdmData).length > 0) {
      //     setIsLoading(false);
      //   }
      // }, [AdmData]); 
     
    return (
        <>
          
          {isLoading ? (
       
        <LoadingSpinner />
      ) : (

      <div>
          <div className='relative'>
            <img src='/assets/images/DashboardBanner.png' alt='Dashboard Banner' className='w-full object-cover' />
            <div className='absolute inset-0 bg-white opacity-10 pointer-events-none'></div>
    
            
                
                <div className='max-w-lg bg-white border border-gray-200 rounded-lg shadow     absolute inset-0 mx-auto h-60 mt-28'>
                  <a href='#'>
                    <img className='rounded-t-lg h-24' src='/assets/images/CardBg.png' alt='Cards backgrounds' />
                  </a>
                  <div className='h-[5.625rem] mt-[-4.0625rem] rounded-full'>
                    <img
                     className='rounded-full w-24 h-24 object-fill mx-auto'  
                     src={`/uploads/${CoordinatorData.image}`}
                      alt='Card Image' />
                  </div>
                  <div className='p-5 '>
                    <div className='AdmName'>
                      <h1 className='font-bold text-center'>{CoordinatorData ? CoordinatorData?.name: 'Loading...'}</h1>
                      <p className='font-light text-sm text-center'>{CoordinatorData ? CoordinatorData.role: 'Loading...'}</p>
                    </div>
                    <div className='regCgpa flex flex-row justify-center space-x-10 text-xs ml-1 mt-2'>
                      <div className='text-center'>
                        <h1 className='font-bold'>CNIC</h1>
                        <p className='font-light'>{CoordinatorData ? CoordinatorData.cnic: 'Loading...'}</p>
                        <h1 className='font-bold text-slate-800'>CNIC</h1>
                        <p className='font-light text-slate-600'>{CoordinatorData ? CoordinatorData.cnic: 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold text-slate-800'>Email</h1>
                        <p className='font-light text-slate-600'>{CoordinatorData ? CoordinatorData.email: 'Loading...'}</p>
                      </div>
                      <div className='absolute inset-0 bg-white opacity-10 pointer-events-none'></div>
            <div className='announcement pl-20 md:pl-10 pt-14 bg-slate-50 pr-20 md:pr-10'>
              <h1 className='font-bold text-4xl mt-20 lg:mt-28 text-primary uppercase tracking-tight'>Announcements</h1>
                        <p className='font-light text-slate-600'>{CoordinatorData ? CoordinatorData.phoneNumber: 'Loading...'}</p>
                      </div>
                      {/* <div className='text-center'>
                        <h1 className='font-bold'>ID</h1>
                        <p className='font-light'>{AdmData ? AdmData.facultyId: 'Loading...'}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
            
              
   
            
            
            
            </div>
            <div className='mx-16'>


            {showStudModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50'>
            <div className='bg-white p-4 rounded-lg w-[31.25rem]  relative'>
            <form >
              <button
                className='absolute top-2 right-2 text-gray-600 focus:outline-none'
                onClick={() => {
                  setShowStudModal(false);
                  setHideFacStudTab(false);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
              <div className='font-bold text-xl flex flex-row justify-center'>
                <p>{ 'View Student'}</p>
              </div>
              {/* Form Fields */}
              <div
                className='mt-8 space-y-4 overflow-y-auto max-h-[540px] mx-6 relative'
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1', paddingRight: '10px' }}
              >
                <div className='flex flex-col mt-1'>
                  <label htmlFor='registrationNumber' className='block mb-1 text-sm font-medium text-black'>
                    Registration Number
                  </label>
                  <input
                    type='text'
                    id='registrationNumber'
                    name='registrationNumber'
                    value={registrationNumber}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                    
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='studentName' className='block mb-1 text-sm font-medium text-black'>
                    Student Name
                  </label>
                  <input
                    type='text'
                    id='studentName'
                    name='studentName'
                    value={studentName}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='phoneNumber' className='block mb-1 text-sm font-medium text-black'>
                    Phone Number
                  </label>
                  <input
                    type='text'
                    id='phoneNumber'
                    name='phoneNumber'
                    value={phoneNumber}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='creditHours' className='block mb-1 text-sm font-medium text-black'>
                    Credit Hours
                  </label>
                  <input
                    type='text'
                    id='creditHours'
                    name='creditHours'
                    value={creditHours}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='cgpa' className='block mb-1 text-sm font-medium text-black'>
                    CGPA
                  </label>
                  <input
                    type='text'
                    id='cgpa'
                    name='cgpa'
                    value={cgpa}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='gpa' className='block mb-1 text-sm font-medium text-black'>
                    GPA
                  </label>
                  <input
                    type='text'
                    id='gpa'
                    name='gpa'
                    value={gpa}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                   
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='secondaryEmail' className='block mb-1 text-sm font-medium text-black'>
                    Secondary Email
                  </label>
                  <input
                    type='email'
                    id='secondaryEmail'
                    name='secondaryEmail'
                    value={secondaryEmail}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='passowrd' className='block mb-1 text-sm font-medium text-black'>
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='program' className='block mb-1 text-sm font-medium text-black'>
                    Program
                  </label>
                  <input
                    type='text'
                    id='program'
                    name='program'
                    value={selectedProgram.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='department' className='block mb-1 text-sm font-medium text-black'>
                    Department
                  </label>
                  <input
                    type='text'
                    id='department'
                    name='department'
                    value={selectedDepartment.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>

                <div className='flex flex-col mt-1'>
                  <label htmlFor='department' className='block mb-1 text-sm font-medium text-black'>
                    Term
                  </label>
                  <input
                    type='text'
                    id='term'
                    name='term'
                    value={selectedTerm.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>

                




                <div className='flex flex-col mt-1'>
                  <label htmlFor='cnic' className='block mb-1 text-sm font-medium text-black'>
                    CNIC
                  </label>
                  <input
                    type='text'
                    id='cnic'
                    name='cnic'
                    value={cnic}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
              
                </div>

                <div className='flex flex-col mt-1'>
                  <label htmlFor='address' className='block mb-1 text-sm font-medium text-black'>
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={address}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
             
                </div>
              </div>
              {/* Buttons */}
              
              </form>
            </div>
          </div>
        )}


            {showFacModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50'>
            <div className='bg-white p-4 rounded-lg w-[31.25rem]  relative'>
            <form >
              <button
                className='absolute top-2 right-2 text-gray-600 focus:outline-none'
                onClick={() => {
                  setShowFacModal(false);
                  setHideFacStudTab(false);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
              <div className='font-bold text-xl flex flex-row justify-center'>
                <p>{ 'View Faculty'}</p>
              </div>
              {/* Form Fields */}
              <div
                className='mt-8 space-y-4 overflow-y-auto max-h-[540px] mx-6 relative'
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1', paddingRight: '10px' }}
              >
                <div className='flex flex-col mt-1'>
                  <label htmlFor='registrationNumber' className='block mb-1 text-sm font-medium text-black'>
                    Faculty ID
                  </label>
                  <input
                    type='text'
                    id='facId'
                    name='facId'
                    value={facultyId}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                    
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='studentName' className='block mb-1 text-sm font-medium text-black'>
                    Faculty Name
                  </label>
                  <input
                    type='text'
                    id='facName'
                    name='facName'
                    value={facultyName}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='phoneNumber' className='block mb-1 text-sm font-medium text-black'>
                    Role
                  </label>
                  <input
                    type='text'
                    id='role'
                    name='role'
                    value={selectedRole.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='creditHours' className='block mb-1 text-sm font-medium text-black'>
                    Phone Number
                  </label>
                  <input
                    type='text'
                    id='phoneNumber'
                    name='phoneNumber'
                    value={phoneNumber}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='cgpa' className='block mb-1 text-sm font-medium text-black'>
                    Designation
                  </label>
                  <input
                    type='text'
                    id='des'
                    name='des'
                    value={selectedDesignation.value}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='gpa' className='block mb-1 text-sm font-medium text-black'>
                    Program
                  </label>
                  <input
                    type='text'
                    id='program'
                    name='program'
                    value={selectedProgram.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                   
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                    Department
                  </label>
                  <input
                    type='text'
                    id='department'
                    name='department'
                    value={selectedDepartment.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                    Term
                  </label>
                  <input
                    type='text'
                    id='term'
                    name='term'
                    value={selectedTerm.label}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                  </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                    Extension
                  </label>
                  <input
                    type='text'
                    id='extension'
                    name='extension'
                    value={extension}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                    Date of Birth
                  </label>
                  <input
                    type='date'
                    id='Dob'
                    name='Dob'
                    value={dob}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='secondaryEmail' className='block mb-1 text-sm font-medium text-black'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='Email'
                    name='Email'
                    value={email}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='secondaryEmail' className='block mb-1 text-sm font-medium text-black'>
                    Secondary Email
                  </label>
                  <input
                    type='email'
                    id='secondaryEmail'
                    name='secondaryEmail'
                    value={secondaryEmail}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                 
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='passowrd' className='block mb-1 text-sm font-medium text-black'>
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>
                <div className='flex flex-col mt-1'>
                  <label htmlFor='program' className='block mb-1 text-sm font-medium text-black'>
                    Joining Date
                  </label>
                  <input
                    type='date'
                    id='jd'
                    name='jd'
                    value={joiningDate}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
                
                </div>
            




                <div className='flex flex-col mt-1'>
                  <label htmlFor='cnic' className='block mb-1 text-sm font-medium text-black'>
                    CNIC
                  </label>
                  <input
                    type='text'
                    id='cnic'
                    name='cnic'
                    value={cnic}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
              
                </div>

                <div className='flex flex-col mt-1'>
                  <label htmlFor='address' className='block mb-1 text-sm font-medium text-black'>
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={address}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    disabled
                  />
             
                </div>
              </div>
              {/* Buttons */}
              
              </form>
            </div>
          </div>
        )}





            <div className='StudentCards  flex flex-row space-x-6 mt-40'>
              <div className='StudentCard max-w-3xl w-96 h-64 '>
              <a href='/CoodFypRegistration' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>FYP Registration</h5>
                  </div>
                  <p className='font-bold text-3xl text-primary '>1</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateFYPRegistration}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>

              <div className='FacultyCard max-w-3xl w-96 h-52 '>
              <a href='/CoodExaminerPanel' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Examiner Panels</h5>
                  </div>
                  <p className='font-bold text-3xl text-primary'>1</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleViewExaminerPanels}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>

              <div className='FYPSessionCard max-w-3xl w-96 h-52 '>
              <a href='/CoodCreateExam' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Exams</h5>
                  </div>
                  <p className='font-bold text-3xl text-primary'>1</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateExam}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>
              <div className='DepartmentCard max-w-3xl w-96 h-52 '>
              <a href='/CoodResults' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Results</h5>
                  </div>
                  <p className='font-semibold text-2xl text-white '>1</p>

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
          
              <div className='mb-5'>
              <Exams accordionId = {363} handleViewExamButtonClick={handleCreateExam}/>
              </div>
              <div className='mb-5'>
              <ExaminerPanels accordionId = {364} handleViewButtonClick={handleViewExaminerPanels}/>
              </div>
            </div>

            {/* <div className='mx-16'>
  {!hideFacStudTab && (
    <AdmStudentDetails students={students} onViewStudent={handleViewStudent} />
  )}
</div>
<div className='mx-16'>
  {!hideFacStudTab && (
    <AdmFacultyDetails faculties={faculties} onViewFaculty={handleViewFaculty}/>
  )}
</div> */}
            
            </div>
      
    )}
        </>
      );
    };

export default CoodDashboard
