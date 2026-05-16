import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Submit from '../../../Components/Buttons/Submit';
import TopicsCard from '../../../Components/Cards/TopicsCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';

import { courseCatalogData } from '../StdCourseCat/StdcourseCatalogData';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import AllTopicsOffered from './AllTopicsOffered';


const FYPRegistration = ({ selectedTab, isFYPRegistered, accordionId }) => {
  /* const [groupMembers, setGroupMembers] = useState([]); */
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [supervisorTopics, setSupervisorTopics] = useState([]);
  // const [SelGroupMembersData, setSelGroupMembersData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  // const [description, setDescription] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showForm, setShowForm] = useState(true);
  // const [editMode, setEditMode] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [FypGroupFeedback, setFypGroupFeedback] = useState('');
  // const [filteredData, setFilteredData] = useState(courseCatalogData);
  const [ViewButton, setViewButton] = useState(false);
  const [SelectInCard, setSelectInCard] = useState(false);
  // const [allStudentData, setAllStudentData] = useState([]);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  // const [selectedSupervisor, setSelectedSupervisor] = useState([]);
  // const [setSelectedRegistration, setSelectedRegistration] = useState([]);
  const [registrationOptions, setRegistrationOptions] = useState([]);
  const [SupTopics, setSupTopics] = useState([]);
  const [TechnologyOptions, setTechnologyOptions] = useState([]);
  const [PlatformOptions, setPlatformOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [SelectedTopicId, setSelectedTopicId] = useState('');
  const [Categories, setCategories] = useState([]);
  const [StudWhoSendFypForm, setStudWhoSendFypForm] = useState('');
  const [FYPReqStatus, setFYPReqStatus] = useState('');
  const [AllOfferedTopics, setAllOfferedTopic] = useState([]);
  const [ShowFeedbackResponse, setShowFeedbackResponse] = useState(false);
  const [showBackButtOnExpiry, setShowBackButtOnExpiry] = useState(false);
  // const [FYPDetailsData, setFypDetailsData] = useState('');



  // const [groupMembersBorderColor, setGroupMembersBorderColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [submissionStatus, setSubmissionStatus] = useState('');
  // const [FYPDataFinal, setFYPDataFinal] = useState('');
  const [ShowDetAfterSub, setShowDetAfterSub] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);

  // const [fileInputKey, setFileInputKey] = useState(Date.now());
  // const [uploadedFileName, setUploadedFileName] = useState('');
  // console.log("Student Data ", allStudentData);

  // console.log("Shooooooooooooooooooooooooowwwwwww Details after SUbmission", ShowDetAfterSub);


  const navigate = useNavigate();



  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }

    // Delay setting the indicator to ensure the DOM is fully rendered
    setTimeout(() => {
      const indicator = document.getElementById('scroll-indicator');
      if (indicator) {
        const tabName = "FYPRegistration";
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
          const topOffset = selectedTab.offsetTop;
          indicator.style.top = `${topOffset}px`;
        }
      }
    }, 100); // Adjust delay time if necessary

  }, [navigate]);


  const convertToDDMMYYYY = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
    fetchFypData();
  }, [])

  const fetchFypData = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserRegNum = currentUser.registrationNumber;
      console.log("Checking current logged in user data", currentUserRegNum);

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };

      // const requestBody = {
      //   currentUserRegNum: currentUserRegNum // Include currentUserRegNum in the request body
      // };

      const url = `/api/fyp/fypdata?registrationNumber=${currentUserRegNum}`;

      console.log("Before fetching FYP data");
      const response = await axios.get(url, config);
      if (response.status === 404) {
        console.log("FYP Data not Found");
        localStorage.removeItem('isFormSubmitted');
        localStorage.removeItem('FYPData');
        setIsLoading(false);
        return;
      }

      if (response.status === 200) {
        const FYPData = response.data.FYPDatas && response.data.FYPDatas.length > 0 ? response.data.FYPDatas[0] : null;
        if (!FYPData) {
          console.log("No registration data found in the response array");
          setIsLoading(false);
          return;
        }
        console.log("Responseeeeeeeeeeeeeeee", FYPData);
        setFYPReqStatus(FYPData.reqStatus)
        
        // If status is anything other than pending, the form is no longer just "submitted"
        // It has been processed. We must clear the local storage so the correct UI shows.
        if (FYPData.reqStatus === 'approved' || FYPData.reqStatus === 'rejected' || FYPData.reqStatus === 'partial-deny') {
          localStorage.removeItem('isFormSubmitted');
        }

        const createdDateOfReg = FYPData.createdAt;
        console.log("Created Date of Reg", createdDateOfReg);
        const formattedCreatedAt = convertToDDMMYYYY(createdDateOfReg.split('T')[0]);
        console.log("Formatted Created At", formattedCreatedAt);
        const currentDate = new Date().toISOString().split('T')[0];
        const currentDateFormatted = convertToDDMMYYYY(currentDate);
        console.log("Formatted Current Date", currentDateFormatted);
        if (currentDateFormatted > formattedCreatedAt) {
          setShowBackButtOnExpiry(true);
        }

      } else {
        console.error('Error fetching user fyp data:', response.statusText);
      }

    } catch (error) {
      console.error('Error during fetchFypDetails:', error);
      if (error.response && error.response.status === 404) {
        localStorage.removeItem('isFormSubmitted');
        localStorage.removeItem('FYPData');
      }
    } finally {
      setIsLoading(false);
    }
  }


  // useEffect(() => {


  //   const indicator = document.getElementById('scroll-indicator');
  //   if (indicator) {
  //     const tabName = 'FYP Registration';
  //     const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  //     const topOffset = selectedTab.offsetTop;
  //     indicator.style.top = `${topOffset}px`;
  //   }
  // }, []);

  // useEffect (() => {
  //   const DataFYP = localStorage.getItem('FYPData');
  //   const fypDat = JSON.parse(DataFYP);
  //   setFYPDataFinal(fypDat);

  // },[])



  // const fetchAllOfferedTopics = async () => {
  //   try {
  //     setIsLoading(true);
  //     const token = localStorage.getItem('key');


  //     const response = await fetch(`/api/auth/getAllTheTopics`, {
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
  //     console.log("Checking Topcis as data", data);

  // // Check if data is a string
  // if (typeof data === 'string') {
  //   // Split the string into an array using the appropriate delimiter
  //   const dataArray = data.split(','); // You may need to adjust the delimiter

  //   // Set the array state
  //   setAllOfferedTopic(dataArray);
  // } else {
  //   // If data is not a string, directly set it in the state
  //   setAllOfferedTopic(data);
  // }

  //     // const topicsOfSup = data.filter(topics => topics.uploadedBy === userId)
  //     // const flatTopics = topicsOfSup.flatMap(topics => topics.topics);
  //     // setOfferedTopic(flatTopics);


  //   } catch (error) {
  //     console.error('Error fetching Data:', error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // console.log("Checking ALl Offered Topicsssssssss", AllOfferedTopics);

  const fetchAllOfferedTopics = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    const user = JSON.parse(localStorage.getItem("user"));
    const CurrentUserProgram = user.program;
    console.log("checking Current User Program", CurrentUserProgram);
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      console.log("REquest senttttttttttttttttttttttttttttttttttttttttttttt Topicsssssssssssssssssssssss")

      const response = await axios.get(`/api/auth/getAllTheTopics?programId=${CurrentUserProgram}`, config);
      // console.log("Response data", response.data);
      console.log("Checking Offered Topicsssssssssssssssssssssss", response.data);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }

      else {
        navigate('/login');
      }
      console.log("Checking Topicssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", response.data);

      // if (typeof response.data === 'string') {
      //   // Split the string into an array using the appropriate delimiter
      //   const dataArray = response.data.split(','); // You may need to adjust the delimiter

      //   // Set the array state
      //   setAllOfferedTopic(dataArray);
      // } else {
      // If data is not a string, directly set it in the state
      setAllOfferedTopic(response.data);
      // }





    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Checking typeeeeeeeeeeeeeeeeeeeeee");
  console.log(typeof AllOfferedTopics);

  const fetchCategories = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      const response = await axios.get('/api/category/GetCategories', config);
      // console.log("Response data", response.data);
      console.log("Checking Categories Response", response.data);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }
      else {
        navigate('/login');
      }
      // console.log("Checking Topics", response.data);

      setCategories(response.data);


    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchAllOfferedTopics();
    fetchCategories();
  }, [])

  console.log("Checking Fetched Categories", Categories);
  console.log(typeof AllOfferedTopics);





  const fetchFYPDataFunc = () => {
    return new Promise((resolve, reject) => {
      try {
        setIsLoading(true);
        // Get FYPData from localStorage
        const fypDataString = localStorage.getItem('FYPData');

        // Parse FYPData from string to object
        const fypData = JSON.parse(fypDataString);

        // Check if FYPData exists
        if (fypData) {
          // Resolve with the fetched FYPData
          resolve(fypData);
        } else {
          // If FYPData is not found in localStorage, resolve with an empty object
          resolve({});
        }
      } catch (error) {
        // If there's any error while fetching or parsing the data, reject with the error
        console.error('Error fetching FYPData:', error);
        reject(error);
      } finally {
        setIsLoading(false);
      }
    });
  };





  // const handleBackToForm = () => {
  //   console.log("Handle back to form function called");
  //   console.log("Handle back to form function called");
  //   console.log("Handle back to form function called");
  //   setShowFeedback(false); // Hide the feedback screen
  //   setFormSubmitted(false);
  // };


  useEffect(() => {
    fetchAllStudentData();
    // const storedAllStudentData = localStorage.getItem('allStudentData');
    // console.log("Stored All student data", storedAllStudentData);
    // if (storedAllStudentData) {
    //   setAllStudentData(JSON.parse(storedAllStudentData));
    // }
  }, []);

  useEffect(() => {
    fetchFypDetails();
  }, [])

  const fetchFypDetails = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("FetchFYP Details calllinnngggggggggggggg");

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserRegNum = currentUser.registrationNumber;
      console.log("Checking currenttttttt logged Reggggggggggggggggggggggggggggggggggggggggggggggggg", currentUserRegNum);

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
          console.log("No registration details found in the response array");
          setIsLoading(false);
          return;
        }
        console.log("Checking Statussssssssssssssssssssssssssss", FYPData.reqStatus)
        localStorage.setItem('FYPData', JSON.stringify(FYPData));
        if (FYPData.reqStatus === 'pending') {
          console.log("FYP Reg RUnniinnnnnnnnninnnnnggggg 2nd (pending)");
          setShowDetAfterSub(true);
          setShowConfirmation(true);
          setShowForm(false);
        } else if (FYPData.reqStatus === 'rejected' || FYPData.reqStatus === 'partial-deny') {
          console.log("FYP Reg RUnniinnnnnnnnninnnnnggggg 2nd (rejected/partial-deny)");
          setShowDetAfterSub(true);
          setShowConfirmation(false);
          setShowForm(true);
        }
      } else {
        console.error('Error fetching user fyp data:');
      }

    } catch (error) {
      console.error('Error during fetchFypDetails:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchAllStudentData = async () => {
    try {
      setIsLoading(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      let studentData = [];
      const storedData = localStorage.getItem('allStudentData');

      if (storedData) {
        studentData = JSON.parse(storedData);
      } else {
        const response = await fetch('/api/auth/fetchStudentData', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          studentData = data.students;
          localStorage.setItem('allStudentData', JSON.stringify(studentData));
        }
      }

      const currentUser = JSON.parse(localStorage.getItem('user'));
      const currentUserDepartment = currentUser.department;
      const currentUserProgram = currentUser.program;
      const currentUserReg = currentUser.registrationNumber;
      const currentUserTerm = currentUser.term;

      const matchedStudents = studentData.filter(student => {
        // Extract IDs safely. The student object has populated fields.
        const stdTermId = student.term?._id || student.term;
        const stdDeptId = student.department?._id || student.department;
        const stdProgId = student.program?._id || student.program;

        // Current user object from localStorage typically has unpopulated ID strings
        const userTermId = currentUserTerm?._id || currentUserTerm;
        const userDeptId = currentUserDepartment?._id || currentUserDepartment;
        const userProgId = currentUserProgram?._id || currentUserProgram;

        // Debug logs
        console.log(`Checking Student: ${student.name}`);
        console.log(`Term: ${stdTermId} vs ${userTermId}`);
        console.log(`Dept: ${stdDeptId} vs ${userDeptId}`);
        console.log(`Prog: ${stdProgId} vs ${userProgId}`);

        return (
          String(stdTermId) === String(userTermId) &&
          String(stdDeptId) === String(userDeptId) &&
          String(stdProgId) === String(userProgId) &&
          student.registrationNumber !== currentUserReg
        );
      });

      // Create options array containing the registration number options based on the matched student data
      const registrationNumberOptions = matchedStudents.map(student => ({
        value: student._id,
        label: `${student.registrationNumber} - ${student.name}`,
        // Add other necessary fields here
      }));

      setRegistrationOptions(registrationNumberOptions);
    } catch (error) {
      console.error('Error fetching all student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Checking Studentssssssssssssssssssssssssssssss", registrationOptions);


  const fetchFYPDataGen = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      const response = await axios.get('/api/suptopic/Fetchtopics', config);
      // console.log("Response data", response.data);


      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }
      else {
        navigate('/login');
      }
      // console.log("Checking Topics", response.data);

      setSupTopics(response.data);

      localStorage.setItem('SupTopics', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupervisorsTopics = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      const response = await axios.get('/api/suptopic/Fetchtopics', config);
      // console.log("Response data", response.data);


      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }
      else {
        navigate('/login');
      }
      // console.log("Checking Topics", response.data);

      setSupTopics(response.data);

      localStorage.setItem('SupTopics', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFYPFromLocal = () => {
    // Get FYP data from local storage
    const fypData = localStorage.getItem('FYPData');

    // Check if FYP data exists in local storage
    if (fypData) {
      const parsedData = JSON.parse(fypData);
      return parsedData;
      // console.log("Parsed Dataaaaaaaaaaaa", parsedData);
      // setFypDetailsData(parsedData);
      // console.log("Stored in state dataaaaaaaaaaaaaa", FYPDetailsData);
    } else {
      // If no FYP data exists, return null or handle accordingly
      return null;
    }
  };

  const fetchTechnologies = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${key}`
        }
      };

      const response = await axios.get('/api/managefyp/fetchtechnology', config);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching technology data:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }



      // console.log("Fetched Technologies:", response.data);
      const technologies = response.data;
      // console.log("Assign data to technologies", technologies);
      const technologyOptionsSel = technologies.map(tech => ({

        value: tech._id,
        label: tech.techName, // Customize label as needed
        // Add other necessary fields here
      }));
      // console.log("Technology value and lable", technologyOptionsSel);

      setTechnologyOptions(technologyOptionsSel);
      // console.log("Techonology Options", TechnologyOptions);

      // Handle the fetched technologies as needed, for example, set them to state
      // setTechnologies(response.data);

      // Optionally, store the fetched technologies in localStorage
      localStorage.setItem('technologies', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching technology data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${key}`
        }
      };

      const response = await axios.get('/api/managefyp/fetchplatform', config);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching platform data:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }

      // console.log("Fetched Platforms:", response.data);
      const platforms = response.data;
      // console.log("Assign data to platforms", platforms);
      const platformOptionsSel = platforms.map(platform => ({
        value: platform._id,
        label: platform.platformName, // Customize label as needed
        // Add other necessary fields here
      }));
      // console.log("Platform value and label", platformOptionsSel);

      setPlatformOptions(platformOptionsSel);
      // console.log("Platform Options", PlatformOptions);

      // Optionally, store the fetched platforms in localStorage
      localStorage.setItem('platforms', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching platform data:', error);
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    fetchSupervisorsTopics();
    fetchTechnologies();
    fetchPlatforms();
    fetchFypStudentExistWhoFillForm();
    // fetchGroupFeedbackFromLocalStorage();
  }, [])






  const fetchAllFacultyData = async () => {
    try {
      setIsLoading(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      let facultyData = [];
      const storedData = localStorage.getItem('allFacultyData');

      if (storedData) {
        facultyData = JSON.parse(storedData);
      } else {
        const response = await fetch('/api/auth/fetchFacultyData', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          facultyData = data.faculties;
          localStorage.setItem('allFacultyData', JSON.stringify(facultyData));
        }
      }

      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      const storedReg = JSON.parse(localStorage.getItem('FYPData')) || {};
      const deniedSups = storedReg.deniedSupervisors || [];

      const filteredFacultyOptions = facultyData.filter(faculty => {
        if (deniedSups.includes(faculty._id)) return false;

        if (faculty.department && faculty.program) {
          // Extract IDs safely
          const facDeptId = faculty.department?._id || faculty.department;
          const facProgId = faculty.program?._id || faculty.program;

          const userDeptId = currentUser.department?._id || currentUser.department;
          const userProgId = currentUser.program?._id || currentUser.program;

          return (
            String(facDeptId) === String(userDeptId) &&
            String(facProgId) === String(userProgId)
          );
        } else {
          return false;
        }
      });

      const facultyOptions = filteredFacultyOptions.map(faculty => ({
        value: faculty._id,
        label: faculty.name,
        departmentId: faculty.department._id,
      }));

      setSupervisorOptions(facultyOptions);
    } catch (error) {
      console.error('Error fetching all faculty data:', error);
    } finally {
      setIsLoading(false);
    }
  };




  // const fetchGroupFeedbackFromLocalStorage = () => {
  //   try {

  //     setIsLoading(true);
  //     const storedFeedback = localStorage.getItem('GroupFeedback');
  //     if (!storedFeedback) {
  //       console.error('Feedback data not found in local storage');
  //       return;
  //     }

  //     const GroupFeedback = JSON.parse(storedFeedback);

  //     setFypGroupFeedback(GroupFeedback);

  //     // return facultyOptions;
  //   } catch (error) {
  //     console.error('Error fetching all faculty data:', error);
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchGroupFeedback = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const fypRegData = JSON.parse(localStorage.getItem("FYPData"));

      if (!fypRegData) {
        console.log('FYP Registration data not found in local storage.');
        return;
      }

      const groupId = fypRegData._id;

      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${key}`
        },
      };

      const url = `/api/suptopic/fetchFeedback?groupId=${groupId}`;

      const response = await axios.get(url, config);

      if (response.status === 200) {
        if (response.data) {
          const feedbackId = response.data.feedback._id;
          console.log("Checking Feedback Id", feedbackId);
          setFypGroupFeedback(response.data.feedback);
          setShowFeedbackResponse(true);
          console.log("Groupppppppppppppppppppppppppppppppppppppppppppppp feedbackkkkkkkkkkkkkkkkkkkkkkkkkkkkk:", response.data.feedback);
        }
        else {
          console.log("Else RUnningggggggggggggggg");
        }
        // localStorage.setItem('GroupFeedback', JSON.stringify(response.data.feedback));
      } else {
        console.error('Error fetching user FYP group feedback:');
      }

    } catch (error) {
      console.error('Error during fetch FYP group feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Checkingggggggggggggggggggggggggggggg Feeeeeeeeeeeeeeeddddddddddddddback", FypGroupFeedback);



  const [formErrors, setFormErrors] = useState({
    groupMembers: '',
    selectedOption: '',
    selectedTechnology: '',
    selectedCategory: '',
    selectedTopic: '',
    description: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      groupMembers: '',
      selectedOption: '',
      selectedTechnology: '',
      selectedCategory: '',
      selectedTopic: '',
      description: '',
      selectedPlatform: '',
    };

    // Perform your validation logic here
    if (groupMembers.length < 1) {
      isValid = false;
      errors.groupMembers = 'Please add at least two group members.';
    }

    if (!selectedOption) {
      isValid = false;
      errors.selectedOption = 'Please select a supervisor.';
    }

    if (!selectedPlatform) {
      isValid = false;
      errors.selectedPlatform = 'Please select a platform.';
    }

    if (!selectedTechnology) {
      isValid = false;
      errors.selectedTechnology = 'Please select a technology.';
    }

    if (!selectedTopic) {
      isValid = false;
      errors.selectedTopic = 'Please add or select FYP topic.';
    }

    // if (!description) {
    //   isValid = false;
    //   errors.description = 'Please provide a description.';
    // }

    setFormErrors(errors);
    return isValid;
  };

  // const handleInputChange = (newValue) => {
  //   setNewMember(newValue); // Update the input field value
  //   setErrorMessage(''); // Clear any previous error message
  // };

  const fetchFypStudentExistWhoFillForm = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserId = currentUser._id;
      // console.log("Checking current logged in user data", currentUserId);
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


      const url = `/api/fyp/checkingUser?user=${currentUserId}`;

      console.log("Before fetching FYP data");
      const response = await axios.get(url, config);


      console.log("Checking user existence who send form", response.data);

      if (response.status === 200) {
        setStudWhoSendFypForm(response.data);

      } else {
        console.error('Error fetching user fyp data:', response.statusText);
      }

    } catch (error) {
      console.error('Error during fetchFypDetails:', error);
    } finally {
      setIsLoading(false);
    }
  }






  const fetchGroupMembersData = () => {

    return new Promise((resolve, reject) => {
      try {
        setIsLoading(true);
        console.log("Inside Fetch Group Memberssssssssssssssss");
        const currentUserRegNum = JSON.parse(localStorage.getItem('user')).registrationNumber;
        const allStudentData = JSON.parse(localStorage.getItem('allStudentData'));

        // Find the current user's details
        const currentUser = allStudentData.find(student => student.registrationNumber === currentUserRegNum);

        if (!currentUser) {
          console.error('Current user not found in student data');
          resolve([]); // Resolve with an empty array if current user's details are not found
        }
        console.log("Checking setted Group Memberssssssssssssssssssssss", groupMembers);
        // Find details of all group members, including the current use
        const groupMembersData = groupMembers.map(member => {
          // Extracting registration number from member.label
          const memberLabelParts = member.label.split(' - ');
          const memberRegistrationNumber = memberLabelParts[0];

          const student = allStudentData.find(student => {
            console.log(`Comparing student with registration number ${student.registrationNumber} and label ${memberRegistrationNumber}`);
            return student.registrationNumber === memberRegistrationNumber;
          });

          console.log("Found student:", student);

          if (!student) {
            console.error(`Student with registration number ${memberRegistrationNumber} not found`);
          } else {
            console.log(`Matching student found for label ${memberRegistrationNumber}: Student registration number is ${student.registrationNumber}`);
          }

          return student;
        }).filter(Boolean);

        console.log("groupMembers dataaaaaaaaaaaaaaaaaaaaaaaaaaaaa", groupMembersData);
        const allMembersData = [currentUser, ...groupMembersData]; // Include current user's details in the group members data
        console.log("CHecking my alllllllllllllllllllllllllllllll selected includingggggg meeeeeeeee Members", allMembersData);

        resolve(allMembersData);
      } catch (error) {
        console.error('Error fetching group members data:', error);
        reject(error); // Reject the error so it can be caught by the caller
      } finally {
        setIsLoading(false);
      }
    });
  };



  // console.log("GroupMembers data outside", SelGroupMembersData);

  const handleSubmit = async (e) => {
    console.log("Form SUbmittedddd cHeck", formSubmitted);

    e.preventDefault();
    console.log("Group Membersssssssssssssssssssssssssssssssssssss lengthhhhhhhhhhhhhhhhh", groupMembers.length)
    if (groupMembers.length < 1 || groupMembers.length > 2) {
      alert('The group must have at least 2 members and a maximum of 3 members.');
      return;
    }

    if (validateForm()) {

      if (localStorage.getItem('FYPData')) {
        console.log("Yes formSubmitted already call update data apiiiiiiiiiiiiiiiiiiiiiii");

        let topicData;
        if (SelectInCard) {
          // If the user selects a topic from the card
          topicData = {
            topic: selectedTopic,
            // description: SelectInCard.description,
            description: selectedDescription,
            category: SelectInCard.category,
          };
        } else {
          // If the user enters their own topic, description, and category
          topicData = {
            topic: selectedTopic,
            // description: description,
            description: selectedDescription,
            category: selectedCategory ? selectedCategory.label : 'General',
          };
        }
        // const groupData = await fetchGroupMembersData();
        const groupData = await fetchGroupMembersData();
        const FYPDataFin = await fetchFYPDataFunc();
        console.log("Checking FYPDataFin id", FYPDataFin._id);


        console.log("GroupMembers check before sending request", groupData);


        if (FYPDataFin.reqStatus === "pending" || FYPDataFin.reqStatus === "rejected" || FYPDataFin.reqStatus === "partial-deny") {
          if (validateForm()) {
            try {
              setIsLoading(true);
              const apiUrl = '/api/fyp/updregistration'; // Adjust the endpoint to include the specific ID
              const userDataString = localStorage.getItem('user');
              const userData = JSON.parse(userDataString);
              const user = userData._id;
              const term = userData.term;
              const regid = FYPDataFin._id;
              const reqStatus = "pending";
              console.log("Checking Regiddddddddddddddddddddddddd", regid);

              const response = await fetch(apiUrl, {
                method: 'PATCH', // Change the method to PATCH
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  regid,
                  groupData,
                  selectedOption: selectedOption.value,
                  selectedTechnology: selectedTechnology.value,
                  topicData,
                  selectedPlatform: selectedPlatform.value,
                  reqStatus,
                  user,
                  term,
                }),
              });

              if (response.ok) {
                console.log("✓ FY registration updated successfully");
                const responseData = await response.json();
                console.log("✓ Updated data:", responseData);

                setFormSubmitted(true);
                setShowConfirmation(true);
                setShowForm(false);
                setShowDetAfterSub(true);
                localStorage.setItem('isFormSubmitted', 'true');

                // Reload ONLY after successful save
                setTimeout(() => {
                  window.location.reload(true);
                }, 1500);
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Failed to update registration:', errorData);
                alert(`Failed to update form: ${errorData.message || 'Please try again.'}`);
              }
            } catch (error) {
              console.error('❌ Network error during update:', error);
              alert('Network error: Failed to update form. Please try again.');
            } finally {
              setIsLoading(false);
              // DO NOT reload here
            }
          }
        } else {
          window.alert("You are not able to edit your FYP Registration!");

        }

      }
      else {
        console.log("Else runninggggggggggggggggggggggg");
        let topicData;
        if (SelectInCard) {
          // If the user selects a topic from the card
          topicData = {
            topic: selectedTopic,
            description: SelectInCard.description,
            category: SelectInCard.category,
          };


        }

        else {
          // If the user enters their own topic, description, and category
          topicData = {
            topic: selectedTopic,
            description: selectedDescription,
            category: selectedCategory ? selectedCategory.label : 'General',
          };
        }
        // console.log("Checking Topic dataaaaaaaaaaaaaaaaaaaa", topicData);

        // Function to fetch data of group members

        const groupData = await fetchGroupMembersData();
        console.log("Group Membersssssssssssssssss", groupData);

        // Perform form submission logic if no errors
        if (validateForm()) {
          try {
            setIsLoading(true);


            const apiUrl = '/api/fyp/Registration';

            const userDataString = localStorage.getItem('user'); // Adjust the key based on how it's stored

            // // Parse the JSON string to get the user data object
            const userData = JSON.parse(userDataString);

            // // Extract the userId from the userData
            const user = userData._id;
            console.log("Checking user Data before sending request", userData);
            const term = userData.term;
            console.log("Before sending request checking Term", term);
            const reqStatus = "pending";
            // console.log(userId);

            console.log("Checking gmDataaaaaa inside submit", groupData);

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                groupData,
                selectedOption: selectedOption.value,
                selectedTechnology: selectedTechnology.value,
                topicData,
                // selectedCategory: selectedCategory.label,
                // selectedTopic: selectedTopicId,
                // description,
                selectedPlatform: selectedPlatform.value,
                reqStatus,
                // selectedFile,
                user,
                term,

              }),
            });

            // const response = await fetch(apiUrl, {
            //   method: 'POST',
            //   body: requestbody,
            // });



            //  console.log("Data = ", body);
            console.log('✓ Form sent to backend');


            if (response.ok) {
              console.log("✓ Response OK - processing response");
              const responseData = await response.json();
              console.log("✓ FYP Registration saved successfully:", responseData);

              setFormSubmitted(true);
              setShowConfirmation(true);
              setShowForm(false);
              setShowDetAfterSub(true);
              localStorage.setItem('isFormSubmitted', 'true');

              // Reload page ONLY after successful save, with a small delay
              setTimeout(() => {
                window.location.reload(true);
              }, 1500); // Wait 1.5 seconds for user to see success message
            } else {
              // Handle API error response
              const errorData = await response.json().catch(() => ({}));
              console.error('❌ Failed to submit form:', response.status, errorData);
              alert(`Failed to submit form: ${errorData.message || 'Please try again.'}`);
            }
          } catch (error) {
            console.error('❌ Network error during submission:', error);
            alert('Network error: Failed to submit form. Please check your connection and try again.');
          }
          finally {
            setIsLoading(false);
            // DO NOT reload here - it was causing premature reload before save completed
          }
        } else {
          console.log('Form has validation errors. Please fix them.');
        }
      }
    }
  };


  console.log("Checking Show Confirmationnnnnnnnnnnnn", showConfirmation);
  console.log("checking Show Detialassssssssssssss after reg", ShowDetAfterSub);
  console.log("Checking Feedbakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", showFeedback);


  const handleTopicChange = (top) => {
    // console.log("Checking topic full", top._id);
    setSelectedTopic(top.target.value);
    setFormErrors({ ...formErrors, selectedTopic: '' });

  };

  const deleteFeedbackOfGroup = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      const fypRegData = JSON.parse(localStorage.getItem("FYPData"));

      if (!fypRegData) {
        console.log('FYP Registration data not found in local storage.');
        return;
      }

      const groupId = fypRegData._id;


      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }

      const config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      };

      const deleteUrl = `/api/suptopic/deleteFeedback/${groupId}`;

      const response = await axios.delete(deleteUrl, config);

      if (response.status === 200 && response.data.success) {
        console.log("Feedback deleted successfully:", response.data.message);
        return true;  // Indicate that the deletion was successful
      } else {
        console.error('Error deleting feedback:', response.data.message);
        return false; // Indicate that the deletion was unsuccessful
      }
    } catch (error) {
      console.error('Error during deleteFeedbackOfGroup:', error);
      return false; // Indicate that the deletion was unsuccessful
    }
  };

  const handleBack = async () => {
    const getFYPData = fetchFYPFromLocal();

    setShowConfirmation(false);

    setShowFeedback(false);
    // setGroupMembers({ value: faculty.program._id, label: faculty.program.programTitle });
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserRegistrationNumber = currentUser.registrationNumber;
    const groupMembers = getFYPData.groupMembers
      .filter(member => member.registrationNumber !== currentUserRegistrationNumber)
      .map(member => ({
        label: member.registrationNumber
      }));

    // Set the groupMembers into the state variable
    if (getFYPData.reqStatus === 'rejected') {
      setSelectedOption(null);
    } else {
      setSelectedOption({ value: getFYPData.selectedOption._id, label: getFYPData.selectedOption.name });
    }
    setGroupMembers(groupMembers);
    setSelectedTopic(getFYPData.topicData.topic);
    setSelectedDescription(getFYPData.topicData.description);
    setSelectedTechnology({ value: getFYPData.selectedTechnology._id, label: getFYPData.selectedTechnology.techName })
    setSelectedPlatform({ value: getFYPData.selectedPlatform._id, label: getFYPData.selectedPlatform.platformName })
    setSelectedCategory({ label: getFYPData.topicData.category });
    console.log("Checking selected Optionnnnnnn", selectedOption);


    // If the form was submitted and the user clicks "Back," enable edit mode

    setShowForm(true);
    console.log("Checking FYP Details Dataaaaaaaaaaaa", getFYPData.topicData.category);
    await deleteFeedbackOfGroup();
    // setEditMode(true);

  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setFormErrors({ ...formErrors, selectedCategory: '' });
  };

  const handleSupervisorChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log("Selected Supervisor Selected Option", selectedOption);
    console.log("Checking Sup topics", SupTopics);
    const selectedSupervisor = SupTopics.find((supervisor) => supervisor.uploadedBy === selectedOption.value);
    console.log("selectedSupervisor Topicsssssssssssssss", selectedSupervisor);

    if (selectedSupervisor) {
      console.log("selectedSupervisor Topics", selectedSupervisor.topics);
      setSupervisorTopics(selectedSupervisor.topics);
    } else {
      console.log("No supervisor found with uploadedBy value:", selectedOption.value);
      // Handle the case where no supervisor is found
      setSupervisorTopics([]);
    }

    if (formSubmitted) {
      console.log("Form submitted");
    } else {
      setSelectedTopic('');
      setSelectedDescription('');
      // Reset the selected category when a new supervisor is chosen
      setSelectedCategory(null);
    }
    setFormErrors({ ...formErrors, selectedOption: '' });
  };




  const handleTechnologyChange = (selectedTechnology) => {
    setSelectedTechnology(selectedTechnology);
    setFormErrors({ ...formErrors, selectedTechnology: '' });
  };

  const handlePlatformChange = (selectedPlatform) => {
    setSelectedPlatform(selectedPlatform);
    setFormErrors({ ...formErrors, selectedPlatform: '' });
  };



  const handleDescriptionChange = (e) => {
    setSelectedDescription(e.target.value);
    setFormErrors({ ...formErrors, description: '' });
  };

  const MAX_GROUP_MEMBERS = 3;
  const MIN_GROUP_MEMBERS = 2;




  const handleViewFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  const handleTopicCardViewButton = (val, topic) => {
    console.log("Inside the handleTopicCardViewButton", topic._id);
    console.log("Vlaueeeeeeeeeeeeeeeeeeeee of View Checking", val);

    setViewButton(true);
    console.log("State of View Of Button is ", ViewButton);

    setSelectInCard(topic);

  };
  const handleGoBackFromView = () => {
    setViewButton(false);
  }

  console.log("State of View Button in Outsideeeeeeeeee", ViewButton);




  useEffect(() => {
    return () => {
      clearTimeout(errorTimeout);
    };
  }, []);
  useEffect(() => {
    fetchAllFacultyData();
  }, []);
  // const MAX_GROUP_MEMBERS = 5; 
  let errorTimeout;
  const addGroupMember = (memberToAdd = newMember) => {
    // Ensure we have a string to check
    const memberLabel = typeof memberToAdd === 'object' ? memberToAdd.label : memberToAdd;

    if (memberLabel && memberLabel.trim() !== '') {
      // Check if the registration number is already in the group
      if (groupMembers.find((member) => member.label === memberLabel)) {
        setErrorMessage('This registration number is already added.');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        return;
      }
      console.log("Checkiing adding new Members", memberLabel);
      // Add the selected member to groupMembers
      setGroupMembers([...groupMembers, { label: memberLabel }]);
      setNewMember(''); // Clear the input field after adding the member
      // setGroupMembersBorderColor(''); // Reset border color
    } else {
      // setGroupMembersBorderColor('border-red-500');
      setErrorMessage('Please enter a group member');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGroupMember();
    }
  };

  const handleInputChange = (newValue) => {
    // Ensure newValue is always a string
    const newMemberValue = typeof newValue === 'object' ? newValue.label : newValue.toString();
    setNewMember(newMemberValue);

    // Auto-add on selection
    if (newMemberValue) {
      addGroupMember(newMemberValue);
    }
  };

  console.log("Checking Addeddddddddddddddddddddddddddddddd Group Membersssssssssssss", groupMembers);

  const removeGroupMember = (index) => {
    const updatedMembers = [...groupMembers];
    updatedMembers.splice(index, 1);
    setGroupMembers(updatedMembers);
  };
  // const handleOptionClick = (option) => {
  //   addGroupMember(); // Add the selected option to the cart when clicked
  // };





  console.log("Checking selected topic ", SelectInCard);
  console.log("Checking selected topic true or false =  ", ViewButton);
  const RegFormSubmitted = localStorage.getItem('isFormSubmitted') === 'true';

  if (RegFormSubmitted) {
    console.log("AFfffffffffffffffter Reeeeeeeeeeegggggggggggg Form Called");
    return (
      <>
        {isLoading ? (

          <LoadingSpinner />
        ) : ViewButton ? (
          <div>
            <div className='regForm mx-14'>
              <div className='formHeader text-center pt-7'>
                <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
                <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
              </div>
              <div className='bg-slate-100'>
                <div className="pt-0 pb-5  rounded-lg  border border-b-0 border-gray-200 relative">
                  <div className='bg-white w-full min-h-[80px] pb-5 rounded-2xl border border-gray-200 mt-4'>
                    <div className='mt-7 ml-2 flex flex-row space-x-2 '>
                      <p className='font-semibold'>Title: </p>
                      <p className=''>{SelectInCard.topic}</p>
                    </div>
                  </div>
                  <div className='bg-white w-full min-h-[387px] rounded-2xl border border-gray-200 mt-4'>
                    <div className='mt-4 ml-2 flex flex-row space-x-2 '>
                      <p className='font-semibold'>Description:</p>
                      <p className=''>{SelectInCard.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-row justify-end mr-5 mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBackFromView} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* {isFYPRegistered && ( */}
            {ShowDetAfterSub && (
              <div className='regForm mx-14'>
                {showConfirmation && (
                  <div>
                    <div className='formHeader text-center pt-7'>
                      <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION</h1>
                      <div className="p-4 mb-4 mt-4 text-sm text-green-600 rounded-lg bg-green-200 " role="alert">
                        <span className="font-medium text-center">Form Submitted Successfully. Wait for Supervisor's response</span>
                      </div>

                    </div>

                    {/* <div className='text-left mb-6 ml-6 underline cursor-pointer'>
                <button style={{ textDecoration: 'underline' }} onClick={handleViewFeedback}>View Feedback</button>
              </div> */}
                  </div>
                )}

                {/* Conditional Rendering of Feedback Accordion */}
                {showFeedback && (
                  <div>
                    {ShowFeedbackResponse ? (
                      <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
                        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                          <GenAccor text="Feedback" accordionId={accordionId} />
                        </h2>
                        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                          {FypGroupFeedback && (
                            <div className="pt-0 pb-0 max-h-52 h-52 bg-white border border-b-0 border-gray-200 relative">
                              <p className='pl-4 mt-1'>{FypGroupFeedback[0].feedback}</p>
                              <div className="table-container overflow-x-auto relative">
                                <div className="flex justify-end items-center">

                                </div>

                              </div>
                            </div>
                          )
                          }
                        </div>
                      </div>
                    ) : null}
                    {(StudWhoSendFypForm && showBackButtOnExpiry) || (ShowFeedbackResponse && StudWhoSendFypForm) && (
                      <div className='flex flex-row justify-end mr-9 mt-2'>
                        <button
                          type='button'
                          className='text-white py-3 px-12 mt-3 bg-primary hover:bg-slate-700 focus:ring-4 focus:ring-blue-300 font-medium  text-sm '
                          onClick={handleBack}
                        >
                          Back
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            )}
            {/* Here brackets small then curly */}
            {showForm && (
              <div>

                <div className='regForm mx-14 bg-slate-100'>

                  <div className='formHeader text-center pt-7'>
                    <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
                    <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
                  </div>


                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className='formFields grid grid-cols-2 gap-28 justify-between mt-8 mx-3'>
                      <div className='col leftFields'>
                        <div className="mb-4">
                          <label htmlFor="groupMembers" className="block text-sm font-medium text-gray-600">
                            Add Group members
                          </label>

                          {/* Custom Select component for group members */}
                          <Select
                            id="groupMembers"
                            name="groupMembers"
                            options={registrationOptions}
                            isSearchable
                            value={registrationOptions.find(option => option.label === newMember)}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type or select a registration number"
                          />

                          {/* Display selected group members */}
                          {groupMembers.length > 0 && (
                            <div className="mt-2 space-x-2 flex flex-wrap">
                              {groupMembers.map((member, index) => (
                                <div key={index} className="bg-gray-200 rounded-md px-3 py-1 flex items-center space-x-1">
                                  {/* <span>{member.label}</span> */}
                                  <span>{member.label.split(' - ')[0]}</span> {/* Show only registration number */}
                                  <button
                                    type="button"
                                    onClick={() => removeGroupMember(index)}
                                    className="text-white bg-red-500 rounded-full w-5 h-5 focus:outline-none"
                                  >
                                    X
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Display error messages near the input field */}
                          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                        </div>


                        <div className='mb-4'>
                          <label htmlFor='groupDropdown' className='block text-sm font-medium text-gray-600'>
                            Select Supervisor
                          </label>
                          <Select
                            id='groupDropdown'
                            name='groupDropdown'
                            className='mt-1 rounded-md'
                            options={supervisorOptions}
                            isSearchable
                            onChange={handleSupervisorChange}
                            value={selectedOption}
                            placeholder='Select or type a name'
                            maxMenuHeight={100}
                          />

                          {formErrors.selectedOption && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedOption}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor='fypTopic' className='block text-sm font-medium text-gray-600'>
                            Add FYP topic
                          </label>
                          <input
                            type='text'
                            id='fypTopic'
                            name='fypTopic'
                            className='mt-1 p-2  border border-gray-300 rounded-md w-full'
                            placeholder='Add your FYP topic'
                            value={selectedTopic}
                            onChange={handleTopicChange}
                          />

                          {formErrors.selectedTopic && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTopic}</p>
                          )}
                        </div>


                        <div className='mb-4 mt-3'>
                          <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
                            Description
                          </label>
                          <textarea
                            id='description'
                            name='description'
                            className='mt-1  pt-2 pl-2 border border-gray-300 rounded-md w-full h-32'
                            placeholder='Type your FYP description'
                            value={selectedDescription}
                            onChange={handleDescriptionChange}
                          />

                          {formErrors.description && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.description}</p>
                          )}
                        </div>
                      </div>


                      <div className='col rightFields'>
                        <div className='mb-4'>
                          <label htmlFor='technologyDropdown' className='block text-sm font-medium text-gray-600'>
                            Select Technology
                          </label>
                          <Select
                            id='technologyDropdown'
                            name='technologyDropdown'
                            className='mt-1 rounded-md'
                            options={TechnologyOptions}
                            isSearchable
                            onChange={handleTechnologyChange}
                            value={selectedTechnology}
                            placeholder='Select or type a technology'
                            maxMenuHeight={100}
                          />

                          {formErrors.selectedTechnology && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTechnology}</p>
                          )}
                        </div>

                        <div className='mb-4'>
                          <label htmlFor='platformDropdown' className='block text-sm font-medium  text-gray-600'>
                            Select Platform
                          </label>
                          <Select
                            id='platformDropdown'
                            name='platformDropdown'
                            className='mt-1 rounded-md '
                            options={PlatformOptions}
                            isSearchable
                            onChange={handlePlatformChange}
                            value={selectedPlatform}
                            placeholder='Select or type a platform'
                            maxMenuHeight={100}
                          />

                          {formErrors.selectedPlatform && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedPlatform}</p>
                          )}
                        </div>

                        {/* <div className='mb-4'>
    <label htmlFor='fileInput' className='block text-sm font-medium text-gray-600'>
      Choose File
    </label>
    <input
  type='file'
  id='fileInput'
  name='fileInput'
  key={fileInputKey}
  className='mt-1 p-1 py-1 border bg-white border-gray-300 rounded-md w-full'
  onChange={handleFileChange}
/>
    {uploadedFileName && <p className='text-green-500 text-sm mt-1'>File uploaded: {uploadedFileName}</p>}
  </div> */}

                      </div>
                    </div>


                    {selectedOption ? ( // Render only if supervisor is selected
                      <div className='TopicsOfferedBySupervisor mt-24 '>
                        <h1 className='font-montserrat text-3xl font-medium mx-3'>Topics of Selected Supervisor</h1>
                        <div className='flex justify-end'>
                          <div className='flex mt-2 flex-col '>
                            <div className=''>
                              <h1 className='font-montserrat text-xl font-medium mx-3'>Select Category</h1>
                            </div>
                            <div className='mt-3'>
                              <Select
                                id='categoryDropdown'
                                name='categoryDropdown'
                                className='w-36 mr-11 font-semibold '
                                options={Categories.map(category => ({ label: category.category, value: category.category }))}
                                isSearchable={false}
                                onChange={handleCategoryChange}
                                value={selectedCategory}
                                placeholder='Filter'
                                maxMenuHeight={120}
                              />
                            </div>
                          </div>
                        </div>

                        <div className='FYPTopics mx-3 pr-2 mt-8 font-DmSans text-sm grid grid-cols-5 max-h-80 gap-y-6 gap-x-6 overflow-y-auto pb-8'>
                          <TopicsCard selectedCategory={selectedCategory} supervisorTopics={supervisorTopics} setSelectedTopic={setSelectedTopic} setSelectedDescription={setSelectedDescription} onTopicSelect={handleTopicCardViewButton} />
                        </div>
                      </div>
                    ) : null}

                    <h1 className='font-montserrat text-3xl font-medium mx-3'>FYP Topics offered by Supervisors</h1>
                    <AllTopicsOffered AllOfferedTopics={AllOfferedTopics} Categories={Categories} />

                    <div className='text-right mt-6 mr-6'>
                      <Submit text="Submit" onClick={handleSubmit} />
                    </div>
                  </form>

                </div>

              </div>
            )}
          </div>
        )}

      </>
    );
  }


  if (ViewButton) {
    console.log("Viiiiiiiiiiieeeeeeeeeeeeeeewwwwwwwwwwwww is Rendering");
    console.log("SlectedInCard.topic", SelectInCard.topic);
    console.log("SlectedInCard.Description", SelectInCard.description);
    return (
      <>
        {isLoading ? (

          <LoadingSpinner />
        ) : (
          <div>
            <div className='regForm mx-14'>


              <div className='formHeader text-center pt-7'>
                <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
                <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
              </div>

              <div className='bg-slate-100'>
                <div className="pt-0 pb-5  rounded-lg  border border-b-0 border-gray-200 relative">
                  <div className='bg-white w-full min-h-[80px] pb-5 rounded-2xl border border-gray-200 mt-4'>
                    <div className='mt-7 ml-2 flex flex-row space-x-2 '>
                      <p className='font-semibold'>Title: </p>
                      <p className=''>{SelectInCard.topic}</p>
                    </div>

                  </div>
                  <div className='bg-white w-full min-h-[387px] rounded-2xl border border-gray-200 mt-4'>
                    <div className='mt-4 ml-2 flex flex-row space-x-2 '>
                      <p className='font-semibold'>Description:</p>
                      <p className=''>{SelectInCard.description}</p>
                    </div>


                  </div>


                </div>
              </div>
            </div>
            <div className='flex flex-row justify-end mr-5 mt-5'>

              <ButbgPrimary text="Back" onClick={handleGoBackFromView} />
            </div>
          </div>
        )}

      </>
    );
  }




  return (
    <>
      {isLoading ? (

        <LoadingSpinner />
      ) : (
        <div>

          {isFYPRegistered ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 m-14">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-montserrat font-bold text-gray-800 mb-2">Already Registered</h2>
              <p className="text-gray-500 font-DmSans text-center max-w-md">
                You have already submitted your FYP registration. Please head to the <b>My Project/Thesis</b> tab to view your project details and evaluations.
              </p>
              <button 
                onClick={() => navigate('/Dashboard/StudentProjectDetails')}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md"
              >
                Go to My Project
              </button>
            </div>
          ) : showForm && (


            <div>

              <div className='regForm mx-14 bg-slate-100'>

                <div className='formHeader text-center pt-7'>
                  <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
                  <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
                </div>


                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className='formFields grid grid-cols-2 gap-28 justify-between mt-8 mx-3'>
                    <div className='col leftFields'>
                      <div className="mb-4">
                        <label htmlFor="groupMembers" className="block text-sm font-medium text-gray-600">
                          Add Group members
                        </label>

                        {/* Custom Select component for group members */}
                        <Select
                          id="groupMembers"
                          name="groupMembers"
                          options={registrationOptions}
                          isSearchable
                          value={registrationOptions.find(option => option.label === newMember)}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Type or select a registration number"
                        />

                        {/* Display selected group members */}
                        {groupMembers.length > 0 && (
                          <div className="mt-2 space-x-2 flex flex-wrap">
                            {groupMembers.map((member, index) => (
                              <div key={index} className="bg-gray-200 rounded-md px-3 py-1 flex items-center space-x-1">
                                {/* <span>{member.label}</span> */}
                                <span>{member.label.split(' - ')[0]}</span> {/* Show only registration number */}
                                <button
                                  type="button"
                                  onClick={() => removeGroupMember(index)}
                                  className="text-white bg-red-500 rounded-full w-5 h-5 focus:outline-none"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Display error messages near the input field */}
                        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                      </div>


                      <div className='mb-4'>
                        <label htmlFor='groupDropdown' className='block text-sm font-medium text-gray-600'>
                          Select Supervisor
                        </label>
                        <Select
                          id='groupDropdown'
                          name='groupDropdown'
                          className='mt-1 rounded-md'
                          options={supervisorOptions}
                          isSearchable
                          onChange={handleSupervisorChange}
                          value={selectedOption}
                          placeholder='Select or type a name'
                          maxMenuHeight={100}
                        />

                        {formErrors.selectedOption && (
                          <p className='text-red-500 text-sm mt-1'>{formErrors.selectedOption}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor='fypTopic' className='block text-sm font-medium text-gray-600'>
                          Add FYP topic
                        </label>
                        <input
                          type='text'
                          id='fypTopic'
                          name='fypTopic'
                          className='mt-1 p-2  border border-gray-300 rounded-md w-full'
                          placeholder='Add your FYP topic'
                          value={selectedTopic}
                          onChange={handleTopicChange}
                        />

                        {formErrors.selectedTopic && (
                          <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTopic}</p>
                        )}
                      </div>


                      <div className='mb-4 mt-3'>
                        <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
                          Description
                        </label>
                        <textarea
                          id='description'
                          name='description'
                          className='mt-1  pt-2 pl-2 border border-gray-300 rounded-md w-full h-32'
                          placeholder='Type your FYP description'
                          value={selectedDescription}
                          onChange={handleDescriptionChange}
                        />

                        {formErrors.description && (
                          <p className='text-red-500 text-sm mt-1'>{formErrors.description}</p>
                        )}
                      </div>
                    </div>


                    <div className='col rightFields'>
                      <div className='mb-4'>
                        <label htmlFor='technologyDropdown' className='block text-sm font-medium text-gray-600'>
                          Select Technology
                        </label>
                        <Select
                          id='technologyDropdown'
                          name='technologyDropdown'
                          className='mt-1 rounded-md'
                          options={TechnologyOptions}
                          isSearchable
                          onChange={handleTechnologyChange}
                          value={selectedTechnology}
                          placeholder='Select or type a technology'
                          maxMenuHeight={100}
                        />

                        {formErrors.selectedTechnology && (
                          <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTechnology}</p>
                        )}
                      </div>

                      <div className='mb-4'>
                        <label htmlFor='platformDropdown' className='block text-sm font-medium  text-gray-600'>
                          Select Platform
                        </label>
                        <Select
                          id='platformDropdown'
                          name='platformDropdown'
                          className='mt-1 rounded-md '
                          options={PlatformOptions}
                          isSearchable
                          onChange={handlePlatformChange}
                          value={selectedPlatform}
                          placeholder='Select or type a platform'
                          maxMenuHeight={100}
                        />

                        {formErrors.selectedPlatform && (
                          <p className='text-red-500 text-sm mt-1'>{formErrors.selectedPlatform}</p>
                        )}
                      </div>

                      {/* <div className='mb-4'>
    <label htmlFor='fileInput' className='block text-sm font-medium text-gray-600'>
      Choose File
    </label>
    <input
  type='file'
  id='fileInput'
  name='fileInput'
  key={fileInputKey}
  className='mt-1 p-1 py-1 border bg-white border-gray-300 rounded-md w-full'
  onChange={handleFileChange}
/>
    {uploadedFileName && <p className='text-green-500 text-sm mt-1'>File uploaded: {uploadedFileName}</p>}
  </div> */}

                    </div>
                  </div>


                  {selectedOption ? ( // Render only if supervisor is selected
                    <div className='TopicsOfferedBySupervisor mt-24 '>
                      <h1 className='font-montserrat text-3xl font-medium mx-3'>Topics of Selected Supervisor</h1>
                      <div className='flex justify-end'>
                        <div className='flex mt-2 flex-col '>
                          <div className=''>
                            <h1 className='font-montserrat text-xl font-medium mx-3'>Select Category</h1>
                          </div>
                          <div className='mt-3'>
                            <Select
                              id='categoryDropdown'
                              name='categoryDropdown'
                              className='w-36 mr-11 font-semibold '
                              options={Categories.map(category => ({ label: category.category, value: category.category }))}
                              isSearchable={false}
                              onChange={handleCategoryChange}
                              value={selectedCategory}
                              placeholder='Filter'
                              maxMenuHeight={120}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='FYPTopics mx-3 pr-2 mt-8 font-DmSans text-sm grid grid-cols-5 max-h-80 gap-y-6 gap-x-6 overflow-y-auto pb-8'>
                        <TopicsCard selectedCategory={selectedCategory} supervisorTopics={supervisorTopics} setSelectedTopic={setSelectedTopic} setSelectedDescription={setSelectedDescription} onTopicSelect={handleTopicCardViewButton} />
                      </div>
                    </div>
                  ) : null}

                  <h1 className='font-montserrat text-3xl font-medium mx-3'>FYP Topics offered by Supervisors</h1>
                  <AllTopicsOffered AllOfferedTopics={AllOfferedTopics} Categories={Categories} />

                  <div className='text-right mt-6 mr-6'>
                    <Submit text="Submit" onClick={handleSubmit} />
                  </div>
                </form>

              </div>

            </div>



          )}
        </div>
      )}


    </>


  );
};


export default FYPRegistration;

