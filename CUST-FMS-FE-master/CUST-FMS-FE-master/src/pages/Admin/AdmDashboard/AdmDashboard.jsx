import React, { useEffect, useState } from 'react'
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { Navigate, useNavigate } from 'react-router-dom';
import GradeCard from '../../../Components/Cards/GradeCard';
import AdmStudentDetails from './AdmStudentDetails';
import AdmFacultyDetails from './AdmFacultyDetails';
import axios from 'axios';
import { initFlowbite } from 'flowbite';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { Select } from 'flowbite-react';

const AdmDashboard = () => {
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
 



  const handleCreateStudent = () => {
    navigate('/AdmCreateStudent');
  };

  const handleCreateFaculty = () => {
    navigate('/AdmFacultyCreate');
  };

  const handleCreateDepartment = () => {
    navigate('/AdmCreateDepartment');
  };
    
  const handleCreateTerm = () => {
    navigate('/AdmFYPSessionTerm');
  };

  const handleViewStudent = (student) => {
    setHideFacStudTab(true);
    console.log('View student catch from child:', student);
        setSelectedStudent(student._id);
      setRegistrationNumber(student.registrationNumber);
      setStudentName(student.name);
      setPhoneNumber(student.phoneNumber);
      setCreditHours(student.creditHours);
      setCgpa(student.cgpa);
      setGpa(student.gpa);
      setEmail(student.email);
      setSecondaryEmail(student.secondaryEmail);
      setPassword(student.password);
      setSelectedProgram({ value: student.program._id, label: student.program.programTitle });
      setSelectedDepartment({ value: student.department._id, label: student.department.departmentName });
      setSelectedTerm({ value: student.term._id, label: student.term.sessionTerm });
      setCnic(student.cnic);
      setAddress(student.address);
      setShowStudModal(true);
  };

  const handleViewFaculty = (faculty) => {
    setHideFacStudTab(true);
    console.log('View faculty catch from child:', faculty);
        setSelectedFaculty(faculty._id);
      setFacultyId(faculty.facultyId);
      setFacultyName(faculty.name);
      setSelectedRole({ value: faculty.role, label: faculty.role});
      setPhoneNumber(faculty.phoneNumber);
      setSelectedDesignation({ value: faculty.designation, label: faculty.designation});
      if (faculty.program && faculty.program._id) {
        setSelectedProgram({ value: faculty.program._id, label: faculty.program.programTitle });
      } else {
        setSelectedProgram({ value: '', label: 'N/A' });
      }
      if (faculty.department && faculty.department._id) {
        setSelectedDepartment({ value: faculty.department._id, label: faculty.department.departmentName });
      } else {
        setSelectedDepartment({ value: '', label: 'N/A' });
      }
      if (faculty.term && faculty.term._id) {
        setSelectedTerm({ value: faculty.term._id, label: faculty.term.sessionTerm });
      } else {
        setSelectedTerm({ value: '', label: 'N/A' });
      }
      setExtension(faculty.extension);
      const dobDate = faculty.dateOfBirth ? faculty.dateOfBirth.substring(0, 10) : '';
      setDob(dobDate);
      const joining = faculty.joiningDate ? faculty.joiningDate.substring(0, 10) : '';
      setJoiningDate(joining);
      setEmail(faculty.email);
      setSecondaryEmail(faculty.secondaryEmail);
      setPassword(faculty.password);
      setCnic(faculty.cnic);
      setAddress(faculty.address);
      setShowFacModal(true);
  };

  
  

  
    useEffect(() => {
        // Update the selected tab when the component mounts
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
          const tabName = "AdmDashboard";
          const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
          const topOffset = selectedTab.offsetTop;
          indicator.style.top = `${topOffset}px`;
        }
        
      }, []);

      useEffect(() => {
        initFlowbite();
        if(!localStorage.getItem('key')){
          navigate('/login');
        }
        
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
          const tabName = 'AdmDashboard';
          const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
          const topOffset = selectedTab.offsetTop;
          indicator.style.top = `${topOffset}px`;
        }
       
      }, []);

      const fetchAdmData = async () => {
        console.log("Inside fetch Admin Data");
    try {
      setIsLoading(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch('/api/auth/GenUserData', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      
      const data = await response.json();
      // console.log("Fetched Admin:", data.admin);
      setAdmData(data.user);
      //  console.log('Programs data', programs[0].department.departmentName);
    } catch (error) {
      console.error('Error fetching programs:', error.message);
    } finally {
      setIsLoading(false);
    }
      };
    console.log("Checking spinner", isLoading)
    
      useEffect(() => {
        fetchAdmData(); 
      }, []);

      console.log("Checking adm dataaaaaaaaaaaaaaaaaaaaaaaaaaaa", AdmData);

  

      const fetchProgramCount = async () => {
        try {
          setIsLoading(true);
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
          const response = await fetch('/api/auth/fetchProgCount', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch program count');
          }
    
          const data = await response.json();
          setProgramCount(data.count);
        } catch (error) {
          console.error('Error fetching program count:', error.message);
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        fetchProgramCount();
      }, []);

        const fetchDepartmentCount = async () => {
          try {
            setIsLoading(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch('/api/auth/fetchDepartmentCount', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            if (!response.ok) {
              throw new Error('Failed to fetch department count');
            }
      
            const data = await response.json();
            setDepartmentCount(data.count);
          } catch (error) {
            console.error('Error fetching department count:', error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
      useEffect(() => {
        fetchDepartmentCount();
      }, []);

      const fetchFYPTermCount = async () => {
        try {
          setIsLoading(true);
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
          const response = await fetch('/api/auth/fetchTermCount', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch FYPTerm count');
          }
    
          const data = await response.json();
          setFYPTermCount(data.count);
        } catch (error) {
          console.error('Error fetching FYPTerm count:', error.message);
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        fetchFYPTermCount();
      }, []);

      const fetchStudentsData = async () => {
        try {
          setIsLoading(true);
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
          const response = await fetch('/api/auth/fetchStudentData', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch students data');
          }
      
          const data = await response.json();
          if (data.students.length === 0) {
            // Set a state variable to indicate no students were found
            setNoStudentsFound(true);
          } else {
            // Update the state with the fetched students data
            setStudents(data.students);
          }
        } catch (error) {
          // Handle any errors that occur during fetching
          console.error('Error fetching students data:', error.message);
        } finally {
          setIsLoading(false);
        }
      };
      
    
      useEffect(() => {
        fetchStudentsData();
      }, []); 

      // const fetchFacultyData = async () => {
      //   try {
      //     setIsLoading(true);
      //     const nkey = localStorage.getItem('key');
      //     const token = JSON.parse(nkey);
      //     const response = await fetch('/api/auth/fetchFacultyData', {
      //       method: 'GET',
      //       headers: {
      //         'Authorization': `Bearer ${token}`
      //       },
      //     });
      //     if (!response.ok) {
      //       throw new Error('Failed to fetch faculty data');
      //     }
      
      //     const data = await response.json();
      //     setFaculty(data.faculty);
      
      //     // Check if faculty array is empty
      //     if (data.faculty.length === 0) {
      //       console.log('No faculty found');
      //       // You can set a state variable here to display a message in your UI
      //     }
      //   } catch (error) {
      //     console.error('Error fetching faculty data:', error.message);
      //     // Handle the error, such as displaying an error message to the user
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      

      const fetchFacultyData = async () => {
        try {
          setIsLoading(true);
      
          const apiUrl = '/api/auth/fetchFacultyData'; // Update API endpoint for fetching faculties
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
      
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("Data checking faculty", data);
            setFaculty(data.faculties);
            console.log("Checking faculties data in create faculty", data.faculties);
            if (data.faculties.length === 0) {
              console.log('No faculty found');
              // You can set a state variable here to display a message in your UI
            }
          } else {
            console.log('Failed to fetch faculties');
          }
        } catch (error) {
          console.error('Error fetching faculties:', error);
        } finally {
          setIsLoading(false);
        }
      };
      

      useEffect(() => {
        fetchFacultyData();
      }, []); 

      const facultyCount = () => {
        // Check if faculties is an array and has elements
        if (Array.isArray(faculties) && faculties.length > 0) {
          return faculties.length; // Return the number of faculties in the array
        } else {
          return 0; // Return 0 if faculties array is empty or not an array
        }
      };
      const studentCount = () => {
        // Check if faculties is an array and has elements
        if (Array.isArray(students) && students.length > 0) {
          return students.length; // Return the number of faculties in the array
        } else {
          return 0; // Return 0 if faculties array is empty or not an array
        }
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
                
                <div className='max-w-lg bg-white border border-gray-100 rounded-lg shadow-xl absolute inset-0 mx-auto h-60 mt-28 z-10'>
                  <a href='#'>
                    <img className='rounded-t-lg h-24' src='/assets/images/CardBg.png' alt='Cards backgrounds' />
                  </a>
                  <div className='h-[5.625rem] mt-[-4.0625rem] rounded-full'>
                    <img
                     className='rounded-full w-24 h-24 object-fill mx-auto'  
                     src={`/uploads/${AdmData.image}`}
                      alt='Card Image' />
                  </div>
                  <div className='p-5 '>
                    <div className='AdmName'>
                      <h1 className='font-bold text-center'>{AdmData ? AdmData.name: 'Loading...'}</h1>
                      <p className='font-light text-sm text-center'>{AdmData ? AdmData.role: 'Loading...'}</p>
                    </div>
                    <div className='regCgpa flex flex-row justify-center space-x-10 text-xs ml-1 mt-2'>
                      <div className='text-center'>
                        <h1 className='font-bold'>CNIC</h1>
                        <p className='font-light'>{AdmData ? AdmData.cnic: 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold'>Email</h1>
                        <p className='font-light'>{AdmData ? AdmData.email: 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold'>Phone no.</h1>
                        <p className='font-light'>{AdmData ? AdmData.phoneNumber: 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='font-bold'>ID</h1>
                        <p className='font-light'>{AdmData ? AdmData.facultyId: 'Loading...'}</p>
                      </div>
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
              <div className='StudentCard max-w-3xl w-96 h-52 '>
              <a href='/AdmCreateStudent' className='block w-full px-6 py-4 bg-slate-50 border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-bold tracking-tight text-primary uppercase'>Student</h5>
                  </div>
                  <p className='font-bold text-3xl text-secondary '>{studentCount()}</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-indigo-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateStudent}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>

              <div className='FacultyCard max-w-3xl w-96 h-52 '>
              <a href='/AdmFacultyCreate' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-bold tracking-tight text-primary uppercase'>Faculty</h5>
                  </div>
                  <p className='font-bold text-3xl text-secondary '>{facultyCount()}</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-indigo-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateFaculty}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>

              <div className='FYPSessionCard max-w-3xl w-96 h-52 '>
              <a href='/AdmFYPSessionTerm' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>FYP Session Terms</h5>
                  </div>
                  <p className='font-semibold text-2xl text-black '>{fyptermCount}</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-indigo-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateTerm}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>
              <div className='DepartmentCard max-w-3xl w-96 h-52 '>
              <a href='/AdmCreateDepartment' className='block w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 ' >
                <div className='ml-3 text-white'>
                  <div className='TitleAndApprovedStatus flex flex-row justify-between'>
                    <h5 className='mb-2 text-lg font-normal tracking-tight text-black'>Department</h5>
                  </div>
                  <p className='font-semibold text-2xl text-black '>{departmentCount}</p>

                  <button
                    type='button'
                    className='text-white py-2 px-12 mt-6 bg-primary hover:bg-indigo-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none'
                    onClick={handleCreateDepartment}
                  >
                    Create
                  </button>
                </div>
              </a>
              </div>
    
               
    
                
              </div>
            </div>

            <div className='mx-16'>
  {!hideFacStudTab && (
    <AdmStudentDetails students={students} onViewStudent={handleViewStudent} />
  )}
</div>
<div className='mx-16'>
  {!hideFacStudTab && (
    <AdmFacultyDetails faculties={faculties} onViewFaculty={handleViewFaculty}/>
  )}
</div>
            
            </div>
      
    )}
        </>
      );
    };

export default AdmDashboard
