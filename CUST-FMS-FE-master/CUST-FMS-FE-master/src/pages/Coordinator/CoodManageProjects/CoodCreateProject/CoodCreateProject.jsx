import React, { useState, useEffect, useRef } from 'react'
import CardOneButton from '../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';
import AccordionGenericTable from '../../../../TESTING/AccordionTableGeneric';
import { initFlowbite, } from 'flowbite';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import AllTopicsOffered from '../../../Student/StdFYPRegister/AllTopicsOffered';
import Submit from '../../../../Components/Buttons/Submit';
import TopicsCard from '../../../../Components/Cards/TopicsCard';
import GenAccor from '../../../../Components/Accordians/GenAccor';
import { categoryOptions } from '../../../Student/StdFYPRegister/StdRegData';
import FilterButton from '../../../../Components/Buttons/FilterButton';
import ButbgPrimary from '../../../../Components/Buttons/ButbgPrimary';
import {useNavigate} from "react-router-dom"







const CoodCreateProject = ({ accordionId }) => {
  // const { onclose, handleSaveSchedule } = props;
  const [showAddProject, setshowAddProjectCard] = useState(false);
  const [panel, setPanel] = useState('');
  const [program, setProgram] = useState('');
  const [supervisorPercentage, setSupervisorPercentage] = useState('');
  const [TermData, setTermData] = useState('');
  const [Programs, setPrograms] = useState('');
  const [selProgramId, setSelProgramId] = useState('');
  const [GroupForAddMembber, setGroupForAddMembber] = useState('');
  const [selTermId, setSelTermId] = useState('');
  const [StudentsOfTerm, setStudentsOfTerm] = useState('');
  const [showAddStud, setShowAddStud] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showAccor, setShowAccor] = useState(true);
  const [showEditProjCard, setShowEditProjCard] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [fypProjects, setfypProjects] = useState([]);
  const [panelData, setPaneldata] = useState([]);
  const [groupIdtoAssignPanel, setGroupIdtoAssignPanel] = useState([]);
  const [panelAssignedStatuses, setPanelAssignedStatuses] = useState([]);
  const [filteredData, setFilteredData] = useState(fypProjects);
  const [panelAssigned, setPanelAssigned] = useState({});
  const [groupIdForStudDel, setGroupIdForStudDel] = useState('');
  const [selectedOptionOfBut, setSelectedOptionOfBut] = useState({ label: 'All', value: 'All' });





  const navigate = useNavigate();









  const [showFYPRegistrationCreationCard, setshowFYPRegistrationCreationCard] = useState(false);
  const [term, setTerm] = useState('');

  const [FypRegistrationData, setFypRegistrationData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [supervisorTopics, setSupervisorTopics] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [deleteStudentInGroup, setDeleteStudentInGroup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [ViewButton, setViewButton] = useState(false);
  const [SelectInCard, setSelectInCard] = useState(false);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [registrationOptions, setRegistrationOptions] = useState([]);
  const [SupTopics, setSupTopics] = useState([]);
  const [TechnologyOptions, setTechnologyOptions] = useState([]);
  const [PlatformOptions, setPlatformOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Categories, setCategories] = useState([]);
  const [StudWhoSendFypForm, setStudWhoSendFypForm] = useState('');
  const [AllOfferedTopics, setAllOfferedTopic] = useState([]);
  const [ShowFeedbackResponse, setShowFeedbackResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ShowDetAfterSub, setShowDetAfterSub] = useState(false);
  const [FypGroupFeedback, setFypGroupFeedback] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [SelectedTopicId, setSelectedTopicId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupMembersBorderColor, setGroupMembersBorderColor] = useState('');

  const cardRef = useRef(null);

  const handlePanelChange = (selectedOption) => {
    console.log("SelectedOptionnnnnnnnn", selectedOption);
    setPanel(selectedOption);
  };



  // console.log("Checking FYP Projecccccctssssssss", fypProjects);
  // const handleSubmit = () => {
  //   const selectedPanel = panel.value
  //   AssignPanel(selectedPanel, groupIdtoAssignPanel)
  //   //handleSaveSchedule(data);
  //   setPanel('');
  //   setshowAddProjectCard(false);
  //   //onclose();
  // };

  const handleCreateProject = () => {

  
    setshowAddProjectCard(true);
    setShowAccor(false);
    setShowCard(false);
  };

  console.log("idddddddd Programmmmmmmmmmmmm", selProgramId);
  console.log("idddddddd Termmmmmmmmmmmmmmmm", selTermId);

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setShowAssignPanel(false);
      //onclose();
    }
  };

  const handleCreateProjectCLose = () => {
    setshowAddProjectCard(false)

  }


  useEffect(() => {
    const fetchAssignedStatuses = async () => {
      if (!filteredData.length) return; // Avoid unnecessary calls if no projects

      const statuses = {};
      await Promise.all(
        filteredData.map(async (item) => {
          const groupId = item._id; // Ensure you are using the correct property for groupId
          const assigned = await CheckPanelAssigned(groupId);
          statuses[groupId] = assigned;
        })
      );
      console.log("Statuses:", statuses);
      setPanelAssigned(statuses);
    };

    fetchAssignedStatuses();
  }, [filteredData]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const fetchPanelAssignments = async () => {
      const panelStatuses = {};
      for (const item of filteredData) {
        const status = await CheckPanelAssigned(item.groupId);
        panelStatuses[item.groupId] = status;
      }
      setPanelAssigned(panelStatuses);
    };

    fetchPanelAssignments();
  }, [filteredData]);



  const handleAssignPanelClick = (id) => {

    setGroupIdtoAssignPanel(id);
    setShowAssignPanel(true);
  }


  const CheckPanelAssigned = async (groupId) => {
    try {
      setLoadingSpinner(true);
      console.log("Checking Group ID", groupId);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/manageexampanels/CheckPanelAssignedOrNot/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Program Data');
      }

      const data = await response.json();
      console.log("Data Check Panel Assigned", data.isPanelAssigned);
      return data.isPanelAssigned;
    } catch (error) {
      console.error('Error fetching Data:', error.message);
      return false; // Return false in case of error
    } finally {
      setLoadingSpinner(false);
    }
  };

  const fetchProjectData = async () => {
    console.log("fetchProjectData Calleddddddddd");
    try {
      setLoadingSpinner(true);

      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/fyp/getAllfypdata`, {
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
      console.log("Dataaaaaaaaa allFYPRegistration", data.allFypRegistrations);
      const fyps = data.allFypRegistrations.map((item, index) => ({
        index: index + 1,
        Topic: item.topicData,
        members: item.groupMembers.map(member => ({
          name: member.name,
          registrationNumber: member.registrationNumber,
          program: member.program._id,
          department: member.department._id,
          email: member.email,
          secondaryEmail: member.secondaryEmail,
          term: member.term,
          cnic: member.cnic,
          address: member.address,
          role: member.role,
          creditHours: member.creditHours,
          cgpa: member.cgpa,
          gpa: member.gpa,
          _id: member._id
        })),
        term: item.term ? item.term.sessionTerm : 'N/A',
        termid: item.term ? item.term._id : 'N/A',
        reqStatus: item.reqStatus,
        selectedOption: item.selectedOption ? item.selectedOption.name : 'N/A',
        selectedOptionId: item.selectedOption ? item.selectedOption._id : 'N/A',
        Technology: item.selectedTechnology ? item.selectedTechnology : 'N/A',
        Platform: item.selectedPlatform ? item.selectedPlatform : 'N/A',
        assignedPanel: item.assignedPanel,
        _id: item._id,
      }));
      console.log("Checking Fypsssssssssssssssssssssssssss", fyps);

      setfypProjects(fyps);
      setFilteredData(fyps);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
  const fetchPrograms = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/auth/fetchProgramData`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Porgram Data');
      }

      const data = await response.json();
      console.log("Before Programsssssssssssssssss", data.programs);
      const dataofProgram = data.programs.map((program, index) => ({
        ...program,
        label: program.programTitle,
        value: program._id,
      }))

      console.log("Programsssssssssssssssssssssssss", dataofProgram);


      setPrograms(dataofProgram);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
  // console.log("FYP Projeccccccccccccccccctssssssssssssss", fypProjects);

  useEffect(() => {
    fetchPrograms();
  }, [])

  // useEffect (() => {
  //   CheckPanelAssigned();
  // }, [])



  console.log("Checking Panel Assigned bool", panelAssigned);


  const fetchPanels = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/manageexampanels/get-all-panels`, {
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
      console.log(data, 'fetched Panels')
      const paneldata = data.panels.map((data, index) => ({

        index: index + 1,
        PanelMembers: data.PanelMembers.map(member => ({
          member: member.member.name,
          role: member.role,
          department: member.member.department.departmentName,
          designation: member.member.designation,
          _id: member.member._id
        })),
        term: data.term.sessionTerm,
        panelCode: data.panelCode,
        label: data.panelName,
        value: data._id,
        _id: data._id,

        // ...data,

      }));
      setPaneldata(paneldata);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const convertToNormalDateFormat = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const dropdownOptionsWithAll = [...TermData];





  const AssignPanel = async (panelId, registrationId,) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/manageexampanels/assign-panel`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panelId, registrationId
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Panel Assigned successfully');
        window.location.reload();
      } else {
        console.log('Failed Panel Assignment ');
      }
    }
    catch (error) {
      console.error('Error creating ExamCLo :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }







  useEffect(() => {
    fetchProjectData();
    fetchPanels();
  }, [])








  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCreateProject';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  const fetchAllStudentData = () => {
    try {
      setIsLoading(true);
      const storedData = localStorage.getItem('allStudentData');
      if (!storedData) {
        console.error('Student data not found in local storage');
        return [];
      }

      const studentData = JSON.parse(storedData);

      // const registrationNumberOptions = studentData.map(student => ({
      //   value: student._id,
      //   label: student.registrationNumber, // Customize label as needed
      //   // Add other necessary fields here
      // }));
      //   setRegistrationOptions(registrationNumberOptions);


      const currentUser = JSON.parse(localStorage.getItem('user'));
      // console.log("Checking logged in user's data", currentUser);

      // Extract the registration number from the logged-in user's data
      const currentUserDepartment = currentUser.department;
      const currentUserProgram = currentUser.program;
      const currentUserReg = currentUser.registrationNumber;
      // console.log("Current user department Id", currentUserDepartment);

      // Filter the student data to find students with matching department and registration number
      const matchedStudents = studentData.filter(student => {
        return student.department._id === currentUserDepartment && student.program._id === currentUserProgram && student.registrationNumber !== currentUserReg;
      });

      // Create options array containing the registration number options based on the matched student data
      const registrationNumberOptions = matchedStudents.map(student => ({
        value: student._id,
        label: `${student.registrationNumber} - ${student.name}`,
        // Add other necessary fields here
      }));

      // Set the registration options state
      setRegistrationOptions(registrationNumberOptions);
      // console.log("Checking student registration Number options", registrationNumberOptions);

      // return registrationNumberOptions;
    } catch (error) {
      console.error('Error fetching all student data:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = (group) => {
    // console.log("Grouppppppp", group._id);
    setGroupForAddMembber(group._id);
    setShowAddStud(true);
    setSelProgramId(group.members[0].program);
    setSelTermId(group.termid);


    console.log("Hanlde Add Student Called");
  }

  const handleDeleteStudent = (group) => {
    console.log("Group Members in delete", group);
    setGroupIdForStudDel(group._id);
    setGroupMembers(group.members);
    setDeleteStudentInGroup(true);
    // console.log("Handle Delete Student Called");

  }
  const handleDeleteProject = async (group) => {
    console.log("Inside Delete Project Func");
    console.log("Group Member", group);
    const groupId = group._id;
    console.log("Checking Group Id to delete", groupId);
    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/fyp/DeleteWholeProject/${groupId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        console.log("Project Deleted successfully");
        window.location.reload();
        // Handle any other actions after successful deletion
      } else {
        console.error("Failed to Delete Project");
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error in Deleting Whole project:", error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);
    }

  }

  const handleEditProj = (group) => {
    console.log("Grouppppppppppppppppppp", group);
    setGroupId(group._id);
    setSelProgramId(group.members[0].program);
    setSelectedOption({
      value: group.selectedOption._id,
      label: group.selectedOption.name
    });


    if(group.assignedPanel)
    {

    setPanel({
      value: group.assignedPanel._id,
      label: group.assignedPanel.panelCode
    })
  }

    setSelectedTerm({
      value: group.termid,
      label: group.term
    });
    setSelectedPlatform({
      value: group.Platform._id,
      label: group.Platform.platformName
    });
    setSelectedTechnology({
      value: group.Technology._id,
      label: group.Technology.techName
    });
    setSelectedTopic(group.Topic.topic);
    // setSelectedTechnology(group.)
    setShowEditProjCard(true);
    console.log("Handle Edit Project Called");
    setSelectedOption({
      value: group.selectedOptionId,
      label: group.selectedOption
    });
    setSelectedCategory({
      value: group.Topic.category,
      label: group.Topic.category
    });

    console.log("Updated Supervisor",)
  }


  const handleDeleteMember = async (memberId) => {
    console.log("Handle Delete Member Id", memberId);
    const studentId = memberId;
    const groupId = groupIdForStudDel;
    console.log("Checking StudentId to delete Student", studentId);
    console.log("Checking Groupid from which student delete", groupId);
    try {
      setIsLoading(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/fyp/Group/${groupId}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

      });

      const data = await response.json();

      if (response.ok) {
        console.log('Member deleted successfully:', data);
        window.location.reload();
        // Optionally, perform any UI updates here
      } else {
        console.error('Failed to delete member:', data.message);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting member:', error.message);
      // Handle network errors or other exceptions
    } finally {
      setIsLoading(false);
    }
  }



  const updatedData = fypProjects.map((data, index) => ({
    ...data,
    index: index + 1,
  }));


  const handleFilterClick = (option) => {
    console.log('Checkinng Optionnnnnn in hanlde filter click', option);
    if (option.value === 'All') {
      // Show all panels when "All" is selected
      setFilteredData(fypProjects);

    } else {


      // Filter panels based on the selected term
      const filteredData = updatedData.filter(proj => proj.term === option.label);
      console.log("FIltereeeeeeeedddddd data", filteredData);
      setFilteredData(filteredData);
    }
  };

  const fetchAllOfferedTopics = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    const user = JSON.parse(localStorage.getItem("user"));
    const CurrentUserDepartment = user.department;
    console.log("checking Current User Department", CurrentUserDepartment);
    try {
      setIsLoading(true);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      console.log("REquest senttttttttttttttttttttttttttttttttttttttttttttt Topicsssssssssssssssssssssss")

      const response = await axios.get(`/api/auth/getAllTheTopicsOfDep?departmentId=${CurrentUserDepartment}`, config);
      // console.log("Response data", response.data);
      console.log("Checking Offered Topicsssssssssssssssssssssss", response.data);

      if (response.status !== 497) {
        if (!response.data) {
          console.error('Error fetching user data:', response.statusText);
          return;
        }

      }

      else {
        Navigate('/login');
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
        Navigate('/login');
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

  const handleBackFromForm = () => {
    console.log("Handle Back from Form Called");
    setShowCard(true);
    setShowAccor(true);
    setshowAddProjectCard(false);
  }

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
        Navigate('/login');
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
        Navigate('/login');
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
        Navigate('/login');
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
    fetchGroupFeedback();
  }, [])

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




  useEffect(() => {
    const fetchFacultyOfProgram = async () => {
      try {
        setLoadingSpinner(true);
        const programId = selProgramId && selProgramId;
        console.log("Program iddddddd in fetchAll Student", programId);
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        const userData = localStorage.getItem('user');
        // const parsedUserData = JSON.parse(userData);
        // const userid = parsedUserData._id;
        const response = await fetch(`/api/auth/getFacultyOfProgram?programId=${programId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'

          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Faculty Data');
        }
        const data = await response.json();
        //Fetched  Data
        console.log(data.facultyMembers, 'fetched Faculty')
        const matchedFaculty = data.facultyMembers;

        console.log("Facultyyyyyyyyyyyyyyyyyyyyyy Beforeeeeeeeeeeee", matchedFaculty);

        const FacultyOptions = matchedFaculty.map(faculty => ({
          value: faculty._id,
          label: `${faculty.name} - ${faculty.program.programTitle}`,
          // Add other necessary fields here
        }));

        console.log("FacultyOptionsssssssssss after", FacultyOptions);

        // Set the registration options state
        setSupervisorOptions(FacultyOptions);

        // Create options array containing filtered faculty options

        // return facultyOptions;
      } catch (error) {
        console.error('Error fetching all faculty data:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacultyOfProgram();
  }, [selProgramId])

  const fetchGroupFeedback = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const fypRegData = JSON.parse(localStorage.getItem("userFypRegistration"));

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
    selectedDescription: '',
    selectedTerm: '',
    selectedProgram: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      groupMembers: '',
      selectedOption: '',
      selectedTechnology: '',
      selectedCategory: '',
      selectedTopic: '',
      selectedDescription: '',
      selectedPlatform: '',
    };

    // Perform your validation logic here
    if (groupMembers.length < 2) {
      isValid = false;
      errors.groupMembers = 'Please add at least two group members.';
    }


    if (!selectedOption) {
      isValid = false;
      errors.selectedOption = 'Please select a supervisor.';
    }

    if (!selectedTerm) {
      isValid = false;
      errors.selectedTerm = 'Please select a Term.';
    }


    if (!selectedPlatform) {
      isValid = false;
      errors.selectedPlatform = 'Please select a platform.';
    }
    if (!selectedProgram) {
      isValid = false;
      errors.selectedProgram = 'Please select a program.';
    }

    if (!selectedTechnology) {
      isValid = false;
      errors.selectedTechnology = 'Please select a technology.';
    }

    if (!selectedTopic) {
      isValid = false;
      errors.selectedTopic = 'Please add or select FYP topic.';
    }

    if (!selectedDescription) {
      isValid = false;
      errors.selectedDescription = 'Please provide a description.';
    }


    setFormErrors(errors);
    return isValid;
  };

  const fetchGroupMembersData = () => {

    return new Promise((resolve, reject) => {
      try {
        setIsLoading(true);
        console.log("Inside Fetch Group Memberssssssssssssssss");
        // const currentUserRegNum = JSON.parse(localStorage.getItem('user')).registrationNumber;
        const allStudentData = StudentsOfTerm;

        // Find the current user's details
        // const currentUser = allStudentData.find(student => student.registrationNumber === currentUserRegNum);

        // if (!currentUser) {
        //   console.error('Current user not found in student data');
        //   resolve([]); // Resolve with an empty array if current user's details are not found
        // }
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
        const allMembersData = [...groupMembersData]; // Include current user's details in the group members data
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

  const handleSubmit = async (e) => {
    console.log("Form SUbmittedddd cHeckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", formSubmitted);

    e.preventDefault();

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
            category: selectedCategory.label,
          };
        }
        // const groupData = await fetchGroupMembersData();
        const groupData = await fetchGroupMembersData();
        const FYPDataFin = await fetchFYPDataFunc();
        console.log("Checking FYPDataFin id", FYPDataFin._id);

        console.log("GroupMembers check before sending request", groupData);


        if (FYPDataFin.reqStatus === "pending" || FYPDataFin.reqStatus === "rejected") {
          if (validateForm()) {
            try {
              setIsLoading(true);
              const apiUrl = '/api/fyp/updregistration'; // Adjust the endpoint to include the specific ID
              const userDataString = localStorage.getItem('user');
              const userData = JSON.parse(userDataString);
              const user = userData._id;
              const regid = FYPDataFin._id;
              const reqStatus = "pending";
              const term = selTermId;
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
                // window.location.reload(true);
                setFormSubmitted(true);
                setShowConfirmation(true);
                setShowForm(false);
                setEditMode(true); // Reset edit mode after successful submission
                setShowDetAfterSub(true);

                localStorage.setItem('isFormSubmitted', 'true');
              } else {
                setSubmissionStatus('Failed to submit form. Please try again.');
              }
            } catch (error) {
              console.error('Network error:', error);
              setSubmissionStatus('Failed to submit form. Please try again.');
            } finally {
              setIsLoading(false);
              window.location.reload(true);
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
            category: selectedCategory.label,
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
            const term = selTermId;
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
            console.log('form sent'); // Log this message to confirm that the form was sent


            if (response.ok) {
              console.log("Inisde response Ok ");
              console.log("Posttttttttttttttttttttttt Dataaaaaaaaaaaaaaaaaaaaaaaaaaa Calleddddddddddddddddddddddddddd");
              // window.location.reload(true);
              setFormSubmitted(true);
              setShowConfirmation(true);
              setShowForm(false);
              setEditMode(true); // Reset edit mode after successful submission
              setShowDetAfterSub(true);
              localStorage.setItem('isFormSubmitted', 'true');
              console.log("Inisde response Ok sec");
            } else {
              setSubmissionStatus('Failed to submit form. Please try again.');
            }
          } catch (error) {
            console.error('Network error:', error);
            setSubmissionStatus('Failed to submit form. Please try again.');
          }
          finally {


            setIsLoading(false);
            window.location.reload(true);


          }
        } else {
          console.log('Form has validation errors. Please fix them.');
        }
      }
    }
  };

  const handleTopicChange = (top) => {
    // console.log("Checking topic full", top._id);
    setSelectedTopic(top.target.value);
    setFormErrors({ ...formErrors, selectedTopic: '' });

  };

  const deleteFeedbackOfGroup = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      const fypRegData = JSON.parse(localStorage.getItem("userFypRegistration"));

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
    // handleSupervisorChange({ value: getFYPData.selectedOption._id, label:getFYPData.selectedOption.name });
    setSelectedOption({ value: getFYPData.selectedOption._id, label: getFYPData.selectedOption.name })
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

  const handleTermChange = (selectedTerm) => {
    setSelectedTerm(selectedTerm);
    setSelTermId(selectedTerm._id);
  }
  const handleProgramChange = (selectedProgram) => {
    setSelectedProgram(selectedProgram);
    setSelProgramId(selectedProgram._id)
  }

  const handleSupChangeByCoordinator = (selectedOption) => {
    console.log("Handle Supervisor Change By Coordinator Called");
    setSelectedOption(selectedOption);
  }
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

  useEffect(() => {

    const fetchAllStudent = async () => {
      try {
        setLoadingSpinner(true);
        const termId = selTermId && selTermId;
        const programId = selProgramId && selProgramId;
        console.log("Term Idddddd in fetch All Student", termId);
        console.log("Program iddddddd in fetchAll Student", programId);
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        const userData = localStorage.getItem('user');
        // const parsedUserData = JSON.parse(userData);
        // const userid = parsedUserData._id;
        const response = await fetch(`/api/auth/getStudOfTermAndProgram?termId=${termId}&programId=${programId}`, {
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
        console.log(data.students, 'fetched Studnetsssssssssss')
        setStudentsOfTerm(data.students);
        const matchedStudents = data.students;

        const registrationNumberOptions = matchedStudents.map(student => ({
          value: student._id,
          label: `${student.registrationNumber} - ${student.name}`,
          // Add other necessary fields here
        }));

        // Set the registration options state
        setRegistrationOptions(registrationNumberOptions);

      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };
    fetchAllStudent();
  }, [selProgramId, selTermId])


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

  const AssPanelToGroup = () => {
    const selectedPanel = panel.value
    AssignPanel(selectedPanel, groupIdtoAssignPanel)
    //handleSaveSchedule(data);
    setPanel('');
    setshowAddProjectCard(false);
    //onclose();
  };

  // const MAX_GROUP_MEMBERS = 3;
  // const MIN_GROUP_MEMBERS = 2;




  const handleViewFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  const handleTopicCardViewButton = (val, topic) => {
    console.log("Inside the handleTopicCardViewButton", topic._id);
    console.log("Vlaueeeeeeeeeeeeeeeeeeeee of View Checking", val);
    setViewButton(val);
    console.log("State of View Of Button is ", ViewButton);
    setSelectedTopicId(topic._id);
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
  // useEffect(() => {
  //   fetchAllFacultyData();
  // }, []);
  // const MAX_GROUP_MEMBERS = 5; 
  let errorTimeout;
  const handleInputChange = (newValue) => {

    // Ensure newValue is always a string
    const newMemberValue = typeof newValue === 'object' ? newValue.label : newValue.toString();
    setNewMember(newMemberValue);
  };

  console.log("New Added Memberrrrrrrrrrrrrrrr", newMember);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key
      addGroupMember(); // Call addGroupMember function to handle adding a group member
    }
  };

  const addGroupMember = () => {
    if (newMember.trim() !== '') {
      // Check if the registration number is already in the group
      if (groupMembers.find((member) => member.label === newMember)) {
        setErrorMessage('This registration number is already added.');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        return;
      }
      console.log("Checkiing adding new Members", newMember);
      // Add the selected member to groupMembers
      setGroupMembers([...groupMembers, { label: newMember }]);
      setNewMember(''); // Clear the input field after adding the member
      setGroupMembersBorderColor(''); // Reset border color
    } else {
      setGroupMembersBorderColor('border-red-500');
      setErrorMessage('Please enter a group member');
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  console.log("Checking Addeddddddddddddddddddddddddddddddd Group Membersssssssssssss", groupMembers);

  const removeGroupMember = (index) => {
    const updatedMembers = [...groupMembers];
    updatedMembers.splice(index, 1);
    setGroupMembers(updatedMembers);
  };
  const handleOptionClick = (option) => {
    addGroupMember(); // Add the selected option to the cart when clicked
  };



  const editUpdProjByCoord = async (e) => {
    e.preventDefault();
    const userDataString = localStorage.getItem('user');
    const userData = JSON.parse(userDataString);
    const user = userData._id;
    const regid = groupId;
    console.log("RegistratoinID", regid);
    console.log("SelectedOption.value", selectedOption.value);
    console.log("SelectedTechnology.value", selectedTechnology.value);
    console.log("Assigned Panel", panel.value);
    console.log("topic", selectedTopic);
    console.log("SelectedPlatform", selectedPlatform.value);
    console.log("SelectedCategory", selectedCategory.value);
    console.log("Term.value", selectedTerm.value);

    try {
      setIsLoading(true);
      const apiUrl = '/api/fyp/updProjByCoord'; // Adjust the endpoint to include the specific ID
      const userDataString = localStorage.getItem('user');
      const userData = JSON.parse(userDataString);
      const user = userData._id;
      const regid = groupId;
      const token = JSON.parse(localStorage.getItem("key"));

      console.log("Checking Regiddddddddddddddddddddddddd", regid);

      const response = await fetch(apiUrl, {
        method: 'PATCH', // Change the method to PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify({
          regid,
          selectedOption: selectedOption.value,
          selectedTechnology: selectedTechnology.value,
          assignedPanel: panel.value,
          topic: selectedTopic,
          selectedPlatform: selectedPlatform.value,
          selectedCategory: selectedCategory.value,
          term: selectedTerm.value,
        }),
      });

      console.log("Request sentttttttttttttttttttttttttt");

      if (response.ok) {
        // window.location.reload(true);
        setShowEditProjCard(false);
        window.location.reload(true);
      } else {
        console.log('Failed to Edit Project.');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
    console.log("EditUpdate Done buttonnnnnnnn calleddddddddd");
    console.log("Supervisor", selectedOption.value);
    console.log("Panel", panel.value);
    console.log("Term", selectedTerm.value);
    console.log("FYP Topic", selectedTopic);
    console.log("Technology", selectedTechnology.value);
    console.log("Category", selectedCategory.value);
    console.log("Platform", selectedPlatform.value);
  }




  console.log("Checking selected topic ", SelectInCard);
  console.log("Checking selected topic true or false =  ", ViewButton);
  const RegFormSubmitted = localStorage.getItem('isFormSubmitted') === 'true'


  const handleFYPRegistrationCreation = () => {
    console.log("Hanlde Handle Called");
    setshowFYPRegistrationCreationCard(true);
  };

  // console.log("Checking Registration Stateeeeeeeeeeeeee", setshowFYPRegistrationCreationCard);
  // const handleClickOutside = (event) => {
  //   if (cardRef.current && !cardRef.current.contains(event.target)) {
  //     setshowFYPRegistrationCreationCard(false);
  //     //onclose();
  //   }
  // };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // API API API API API API API API API API API API API API API API API API API API API 
  // API API API API API API API API API API API API API API API API API API API API API 

  const AddStudToGroup = async () => {
    console.log("Add Stud to group addedddddddddddddddddddddddd", newMember);
    const registrationNumber = newMember.split(' - ')[0];
    console.log("Checking Registration Number", registrationNumber);

    try {
      setIsLoading(true);


      const apiUrl = '/api/fyp/addStudentInGroup';

      const userDataString = localStorage.getItem('user'); // Adjust the key based on how it's stored

      // // Parse the JSON string to get the user data object
      const groupId = GroupForAddMembber;



      // // Extract the userId from the userData

      // console.log(userId);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);


      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId,
          registrationNumber,

        }),
      });




      //  console.log("Data = ", body);
      console.log('form sent'); // Log this message to confirm that the form was sent


      if (response.ok) {
        setShowAddStud(false);
        window.location.reload();
      } else {
        console.log('Failed to Add Student.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    finally {


      setIsLoading(false);
      // window.location.reload(true);


    }

  }
  // console.log("Checking showAddStudddddd", showAddStud);

  const fetchTermData = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/auth/getTermdata`, {
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
      console.log(data, 'fetched Term Data')
      const dataofterm = data.fypTerms.map((term, index) => ({
        ...term,
        label: term.sessionTerm,
        value: term._id,
      }))
      setTermData(dataofterm);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    fetchTermData();
  }, [])






  const fetchFYPRegistrationDeadline = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      console.log("Checking Termmmmmmmm before sending request", term);
      const response = await fetch('/api/CreateFypReg/GetAllFYPRegistrationOfTerm', {
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
      // Fetched Data
      console.log(data, 'fetched DeadlineDataaaaaaaaaaaaaaaaaaaaaaa');

      const reg = data.registration;

      const dueDate = convertToNormalDateFormat(reg.dueDateTime); // Adjusted field name
      const dueTime = new Date(reg.dueDateTime).toLocaleTimeString(); // Extracting time from dueDateTime
      console.log("before return");

      const dataofterm = {
        index: 1,
        term: reg.term.sessionTerm,
        announcementTitle: reg.announcementTitle,
        dueDate: dueDate,
        dueTime: dueTime,
        instructions: reg.instructions,
        _id: reg._id,
      };

      setFypRegistrationData([dataofterm]);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  
const viewDetails = (data) => {
  console.log(data, "View Details fync called");

  navigate(`/CoodViewProjectDetails?id=${data._id}&termId=${data.termid}`)

}






  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
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
        <div className='bg-slate-100 w-full h-full'>
          <div className="mx-10 pt-12 flex flex-col gap-3">
            {showCard && (
              <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                <div id="cardOneButton">
                  <CardOneButton title={"Create Project"} butText={"Create"} onClick={handleCreateProject} />
                </div>
              </div>
            )}

            {showAssignPanel && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowAssignPanel(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {/* <RxCross2 /> */}
                  </button>
                  <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Assign Panel</h4>
                  <form>
                    <div className="my-4">
                      <label htmlFor='term' className="block text-md font-semibold text-gray-700">Panel Code
                        <Select
                          id='term'
                          name='term'
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                          options={panelData}
                          isSearchable
                          onChange={handlePanelChange}
                          value={panel}
                          placeholder='Select or type'
                        />
                      </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                      <Simple text="Add" type="Submit" onClick={AssPanelToGroup} />
                    </div>
                  </form>
                </div>
              </div>

            )}
            {showAddStud && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowAddStud(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {/* <RxCross2 /> */}
                  </button>
                  <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Add Student</h4>
                  <form>
                    <div className="my-4">
                      <label htmlFor='term' className="block text-md font-semibold text-gray-700">Student
                        <Select
                          id='student'
                          name='Student'
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                          options={registrationOptions}
                          isSearchable
                          onChange={handleInputChange}
                          value={registrationOptions.find(option => option.label === newMember)}
                          placeholder='Select or type'
                        />
                      </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                      <Simple text="Add" type="Submit" onClick={AddStudToGroup} />
                    </div>
                  </form>
                </div>
              </div>

            )}

            {deleteStudentInGroup && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setDeleteStudentInGroup(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {/* <RxCross2 /> */}
                  </button>
                  <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Delete Student</h4>

                  <div className="my-4">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Name</th>
                          <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Reg No</th>
                          <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupMembers.map((member, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-300">{member.name}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{member.registrationNumber}</td>
                            <td className="py-2 px-4 border-b border-gray-300">
                              <button
                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                onClick={() => handleDeleteMember(member._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            )}

            {showEditProjCard && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowEditProjCard(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Edit FYP Project Details</h4>
                  <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                      <label htmlFor='groupDropdown' className='block text-sm font-medium text-gray-600'>
                        Supervisor
                      </label>
                      <Select
                        id='groupDropdown'
                        name='groupDropdown'
                        className='mt-1 rounded-md'
                        options={supervisorOptions}
                        isSearchable
                        onChange={handleSupChangeByCoordinator}
                        value={selectedOption}
                        placeholder='Select or type a name'
                        maxMenuHeight={100}
                      />

                      {formErrors.selectedOption && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedOption}</p>
                      )}
                    </div>
                    
                    <div className="my-4">
                      <label htmlFor='term' className="block text-md font-semibold text-gray-700">Panel Code
                        <Select
                          id='panel'
                          name='examPanel'
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                          options={panelData}
                          isSearchable
                          onChange={handlePanelChange}
                          value={panel}
                          placeholder='Select or type'
                        />
                      </label>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='TermDropdown' className='block text-sm font-medium  text-gray-600'>
                        Term
                      </label>
                      <Select
                        id='termDropdown'
                        name='termDropdown'
                        className='mt-1 rounded-md '
                        options={TermData}
                        isSearchable
                        onChange={handleTermChange}
                        value={selectedTerm}
                        placeholder='Select or type a platform'
                        maxMenuHeight={100}
                      />

                      {formErrors.selectedPlatform && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedPlatform}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor='fypTopic' className='block text-sm font-medium text-gray-600'>
                        FYP topic
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
                    <div className='mb-4'>
                      <label htmlFor='technologyDropdown' className='block text-sm font-medium text-gray-600'>
                        Technology
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
                    <div className='mt-3'>
                      <label htmlFor='CategoryDropdown' className='block text-sm font-medium text-gray-600'>
                        Category
                      </label>
                      <Select
                        id='categoryDropdown'
                        name='categoryDropdown'
                        className='mt-1 rounded-md '
                        options={Categories.map(category => ({ label: category.category, value: category.category }))}
                        isSearchable={false}
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        placeholder='Filter'
                        maxMenuHeight={120}
                      />
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='platformDropdown' className='block text-sm font-medium  text-gray-600'>
                        Platform
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
                    <div className="col-span-1 flex justify-center my-2">
                      <Simple text="Done" type="Submit" onClick={editUpdProjByCoord} />
                    </div>
                  </form>
                </div>
              </div>

            )}

            {showAddProject && (
              <div>

                <div className='regForm mx-14 bg-slate-100'>

                  <div className='formHeader text-center pt-7'>
                    <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
                    <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
                  </div>


                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className='formFields grid grid-cols-2 gap-28 justify-between mt-8 mx-3'>
                      <div className='col leftFields'>

                        <div className='mb-4'>
                          <label htmlFor='TermDropdown' className='block text-sm font-medium  text-gray-600'>
                            Select Term
                          </label>
                          <Select
                            id='termDropdown'
                            name='termDropdown'
                            className='mt-1 rounded-md '
                            options={TermData}
                            isSearchable
                            onChange={(selected) => {
                              handleTermChange(selected); // Handle supervisor change
                              // Remove error message for supervisor
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                selectedTerm: '', // Remove the error message
                              }));
                            }}
                            value={selectedTerm}
                            placeholder='Select or type a platform'
                            maxMenuHeight={100}
                          />

                          {formErrors.selectedTerm && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTerm}</p>
                          )}
                        </div>
                        <div className='mb-4'>
                          <label htmlFor='ProgramDropdown' className='block text-sm font-medium  text-gray-600'>
                            Select Program
                          </label>
                          <Select
                            id='programDropdown'
                            name='programDropdown'
                            className='mt-1 rounded-md '
                            options={Programs}
                            isSearchable
                            onChange={(selected) => {
                              handleProgramChange(selected); // Handle supervisor change
                              // Remove error message for supervisor
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                selectedProgram: '', // Remove the error message
                              }));
                            }}
                            value={selectedProgram}
                            placeholder='Select or type a platform'
                            maxMenuHeight={100}
                          />

                          {formErrors.selectedProgram && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedProgram}</p>
                          )}
                        </div>

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
                            onChange={(selected) => {
                              handleInputChange(selected); // Handle supervisor change
                              // Remove error message for supervisor
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                groupMembers: '', // Remove the error message
                              }));
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type or select a registration number"
                          />
                          {formErrors.groupMembers && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.groupMembers}</p>
                          )}
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
                            onChange={(selected) => {
                              handleTopicChange(selected); // Handle supervisor change
                              // Remove error message for supervisor
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                selectedTopic: '', // Remove the error message
                              }));
                            }}
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
                            onChange={(selected) => {
                              handleDescriptionChange(selected); // Handle supervisor change
                              // Remove error message for supervisor
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                selectedDescription: '', // Remove the error message
                              }));
                            }}
                          />

                          {formErrors.selectedDescription && (
                            <p className='text-red-500 text-sm mt-1'>{formErrors.selectedDescription}</p>
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
                  <div className='text-center mt-6 mr-6'>
                    <Submit text="Back" onClick={handleBackFromForm} />
                  </div>
                </div>

              </div>
            )}

            {showAccor && (
              <div>
                <div className="flex justify-end my-3">
                  <FilterButton dropdownOptions={dropdownOptionsWithAll} text="Filter" onClick={handleFilterClick} />
                </div>
                <div id={`accordion-collapse-${String(accordionId)}`} data-accordion="collapse" className={`mt-1 `}>
                  <h2 id={`accordion-collapse-heading-timetable-${String(accordionId)}`}>
                    <GenAccor text="Projects" accordionId={accordionId} />
                  </h2>

                  <div id={`accordion-collapse-body-timetable-${String(accordionId)}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${String(accordionId)}`}>
                    <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                      {/* Timetable Table */}
                      <div className="table-container overflow-x-auto relative">
                        <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                          <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                            <tr className='border-b text-center'>
                              <th className="px-6 py-3 w-28">Sr. No</th>
                              <th className="px-6 py-3">FYP Title</th>
                              <th className="px-6 py-3">Members</th>
                              <th className="px-6 py-3">Term</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3">Supervisor</th>
                              <th className="px-6 py-3">Assign Panel</th>
                              <th className="px-6 py-3">Add Student</th>
                              <th className="px-6 py-3">Delete Student</th>
                              <th className="px-6 py-3">Project</th>
                              <th className="px-6 py-3">Edit Details</th>
                              {/* <th className="px-6 py-3">View Details</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(filteredData) && filteredData.length > 0 ? (
                              filteredData.map((item, index) => {
                                const srno = index + 1;
                                console.log(`Panel assigned status for groupId ${item._id}:`, panelAssigned[item._id]);
                                return (
                                  <tr key={index} className="text-center font-normal">
                                    <td className="px-6 py-4">{srno}</td>
                                    <td className="px-6 py-4">{item.Topic.topic}</td>
                                    <td className="px-6 py-4">
                                      {item.members.map((member) => (
                                        <div key={member._id}>
                                          {member.name} ({member.registrationNumber})
                                        </div>
                                      ))}
                                    </td>
                                    <td className="px-6 py-4">{item.term}</td>
                                    <td className="px-6 py-4">{item.reqStatus}</td>
                                    <td className="px-6 py-4">{item.selectedOption}</td>
                                    <td className="px-6 py-4">
                                      {panelAssigned[item._id] ? (
                                        <button className="underline mx-2" disabled>Assigned</button>
                                      ) : (
                                        <button className="underline mx-2" onClick={() => handleAssignPanelClick(item)}>Assign</button>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      <button className="underline mx-2" onClick={() => handleAddStudent(item)}>Add</button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <button className="underline mx-2" onClick={() => handleDeleteStudent(item)}>Delete</button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <button className="underline mx-2" onClick={() => handleDeleteProject(item)}>Delete</button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <button className="underline mx-2" onClick={() => handleEditProj(item)}>Edit</button>
                                    </td>


                                    {/* <td className="px-6 py-4">
                                      <button className="underline mx-2" onClick={() => viewDetails(item)}>View</button>
                                    </td> */}

                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan='11' className='text-center py-4'>No Data Found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            )}


          </div>
        </div>)}
    </>
  );
};

export default CoodCreateProject;

