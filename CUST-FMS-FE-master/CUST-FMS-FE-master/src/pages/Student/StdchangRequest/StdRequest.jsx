import React, { useEffect, useState } from 'react';
import RequestCard from '../../../Components/Cards/RequestCard';
import Simple from '../../../Components/Buttons/Simple';
import Modal from '../../../Components/Modal/reqModal';
import Select from 'react-select';  // Import the react-select library
import { technologyOptions } from '../StdFYPRegister/StdRegData';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const Request = () => {
  const [showModal, setShowModal] = useState(false);
  const [ShowTechModal, setShowTechModal] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [fypTopic, setFypTopic] = useState('');
  const [newFypTopic, setNewFypTopic] = useState('');
  const [techReason, setTechReason] = useState('');
  const [topicReason, setTopicReason] = useState('');
  const [fypTechnology, setFypTechnology] = useState('');
  const [newFypTechnology, setNewFypTechnology] = useState('');
  const [fypTopicError, setFypTopicError] = useState('');
  const [FypData, setFypData] = useState('');
  const [newFypTopicError, setNewFypTopicError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [fypTechnologyError, setFypTechnologyError] = useState('');
  const [newFypTechnologyError, setNewFypTechnologyError] = useState('');
  const [technologyOptions, setTechnologyOptions] = useState('');
  const [loadingSpinner, setloadingSpinner] = useState(false);
  const [TechReqExist, setTechReqExist] = useState('');
  const [TopicReqExist, setTopicReqExist] = useState('');
  const [TopicReqStatus, setTopicReqStatus] = useState('');
  const [TechReqStatus, setTechReqStatus] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showTechnologyModal, setShowTechnologyModal] = useState(false);

  

  useEffect(() => {
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'Request';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    console.log("Checking setTechReqExist", TechReqExist);

  }, [TechReqExist]);
  
  // console.log("Checking topicReq existttttttttttttttttttttttttttttttttttttttttttttttttttt", TopicReqExist);
  // console.log("Checking techReq existttttttttttttttttttttttttttttttttttttttttttttttttttt", TechReqExist);
  const fetchFypDetails = async () => {
    try {
      setloadingSpinner(true);
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

      const url = `/api/fyp/fypdata?registrationNumber=${currentUserRegNum}`;


      console.log("Before fetching FYP data");
      const response = await axios.get(url, config);
      const FYPData = response.data.FYPDatas[0];
      console.log("Checking FYPData", FYPData);

      // // Log the relevant properties
      // console.log('User ID:', FYPData._id);
      // console.log('Group Members:', FYPData.groupMembers);
      // console.log('Selected Option:', FYPData.selectedOption);
      // console.log('Selected Technology:', FYPData.selectedTechnology);
      // console.log('Selected Category:', FYPData.selectedCategory)

      console.log("CHecking topic Request exist or nottttttttttttttttttttt", TopicReqExist);
      if (response.status === 200) {
        if(!TechReqExist ){
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Tech Req nottttttttttttttttttttttttttttttt existttttttttttttttttttttttttttttt");
          // console.log("Checking selected Technology value", FYPData.selectedTechnology.techName);
          // console.log("Checking selected Technology lable", FYPData.selectedTechnology.techName);
          setFypTechnology({ value: FYPData.selectedTechnology.techName, label: FYPData.selectedTechnology.techName })
          
        }
        
          // console.log("FYPData.topicData.topic", FYPData.topicData.topic);
          // console.log("Topic req notttttttttttttttttttttttttttttttt existttttttttttttttttttttttttt");
          // console.log("Topic req notttttttttttttttttttttttttttttttt existttttttttttttttttttttttttt");
          // console.log("Topic req notttttttttttttttttttttttttttttttt existttttttttttttttttttttttttt");
          // console.log("Topic req notttttttttttttttttttttttttttttttt existttttttttttttttttttttttttt");
          setFypTopic(FYPData.topicData.topic)
       

        localStorage.setItem('FYPData', JSON.stringify(FYPData));

        setFypData(FYPData);
        
        
      } else {
        console.error('Error fetching user fyp data:', response.statusText);
      }

    }
    catch (error) {
      console.error('Error during fetchFypDetails:', error);
    }
    finally {
      setloadingSpinner(false);
    }
  }
  useEffect (() => {
    fetchFypDetails();
  }, [])
// useEffect(() => {
  
//   console.log("Checking registered fyp technologyttttttttttttttttttttttttttttt", FypData.selectedTechnology.techName)


// }, [])

  // const handleRegisterNow = (type) => {
  //   setRequestType(type);
  //   setShowModal(true);
  // };
  const handleRegisterTechReq = (type) => {
    setRequestType(type);
    setShowTechModal(true);
  };

  const handleCloseModal = () => {
    setRequestType('');
    setShowModal(false);
  };



  const handleRegisterNow = (type) => {
    if (type === 'Change FYP Topic') {
      setShowTopicModal(true);
    } else if (type === 'Change FYP Technology') {
      setShowTechnologyModal(true);
    }
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
  };

  const handleCloseTechnologyModal = () => {
    setShowTechnologyModal(false);
  };

  const handleSendRequest = () => {
    // Form validation
    let isValid = true;

    // Common validations for all request types
    if (requestType === 'Change FYP Technology') {
      if (!fypTechnology.value) {
        setFypTechnologyError('FYP Technology is required');
        isValid = false;
      } else {
        setFypTechnologyError('');
      }

      if (!newFypTechnology.value) {
        setNewFypTechnologyError('New FYP Technology is required');
        isValid = false;
      } else {
        setNewFypTechnologyError('');
      }
    } else if (requestType === 'Change FYP Topic') {
      if (!fypTopic.trim()) {
        setFypTopicError('FYP Topic is required');
        isValid = false;
      } else {
        setFypTopicError('');
      }

      if (!newFypTopic.trim()) {
        setNewFypTopicError('New FYP Topic is required');
        isValid = false;
      } else {
        setNewFypTopicError('');
      }
    }

    if (!topicReason.trim()) {
      setReasonError('Reason is required');
      isValid = false;
    } else {
      setReasonError('');
    }

    // If form is valid, submit the request
    if (isValid) {
      // Implement your logic for sending the request
      // After handling the request, close the modal
      setShowModal(false);
    }
  };

  

  const fetchTechnologyNames = async () => {
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/managefyp/fetchtechnology'; 
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
        console.log("View technologies", data);
        const techs = data;
        
    
        const technologies = techs.map(tech => ({
          value: tech._id, // Assuming department has an _id field
          label: tech.techName, // Assuming department has a departmentName field
        
        }));
        // setDepartmentExist(true);
        // console.log("departments with term checking", departments);
        setTechnologyOptions(technologies);
        
      } else  {
        console.log('Failed to fetch technology names');
      }
    } catch (error) {
      console.error('Error fetching technology names:', error);
    } finally {
      setloadingSpinner(false);
    }
  };

  useEffect (() => {
    fetchTechnologyNames();
  
  }, [])
  useEffect (() => {
    checkTechReqStatus();
    
    
  }, [TechReqStatus])
  useEffect(() => {
    checkTopicReqStatus();
    // if(TopicReqExist && TopicReqExist.topicReqStatus === "approved"){
      
    //   // setFypTopic("");
    //   setNewFypTopic("");
    //   setTopicReason("");
    // }
  }, [TopicReqStatus])
  
  console.log("Checking Topic request statussssssssssssssssssssss", TopicReqExist.topicReqStatus);
  const checkTechReqStatus = async () => {
    // console.log("Runingggggg");
    try {
      setloadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const FYPDataString = localStorage.getItem('FYPData');
    
    // Parse the JSON string to get the FYPData object
    const fypRegData = JSON.parse(FYPDataString);
    const groupId = fypRegData._id;
    console.log("Checking group id in send tech req api", groupId);
      // Make a GET request to your backend API endpoint with the groupId
      const response = await axios.get(`/api/fyp/fypTechnologyReq/${groupId}`, {
        headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
    });
    
      console.log("Checking response", TechReqExist.techReqStatus);
  
      // Check if the request was successful

      if (response.status === 200) {
        // console.log("Insideeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        setTechReqExist(response.data[0]);
        console.log("old tech", response.data[0].fypTechnology);
        console.log("new tech", response.data[0].newFypTechnology);
        console.log("reason", response.data[0].reasonForChange);
        setTechReqStatus(response.data[0].techReqStatus);
        if(TechReqExist.techReqStatus === "pending"){
             setFypTechnology({ value: response.data[0].fypTechnology, label: response.data[0].fypTechnology });
        setNewFypTechnology({ value: response.data[0].newFypTechnology, label: response.data[0].newFypTechnology });
        setTechReason(response.data[0].reasonForChange);
        }
        
      //   if(TechReqExist.techReqStatus === "pending"){
      //     console.log("Check passeddddddddddddddddddd");
      //   setFypTechnology({ value: response.data[0].fypTechnology, label: response.data[0].fypTechnology });
      //   setNewFypTechnology({ value: response.data[0].newFypTechnology, label: response.data[0].newFypTechnology });
      //   setTechReason(response.data[0].reasonForChange);
      // } else {
      //   console.log("Check faileddddddddddddddddd");
      //   setFypTechnology({ value: response.data[0].fypTechnology, label: response.data[0].fypTechnology });

      // }
        // return response.data;
      } else {
        // Handle other status codes if needed
        console.error('Failed to fetch FYPTechnologyReq:', response.statusText);
        return null; // or throw an error
      }
      console.log("Request sentttttttttt");
      console.log("Request sentttttttttt");
      console.log("Request sentttttttttt");
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error fetching FYPTechnologyReq:', error.message);
      return null; // or throw an error
    } finally {
      setloadingSpinner(false);
    }
  }


  // const checkTopicReqStatus = async () => {
  //   console.log("Running checkTopicReqStatus");
  //   try {
  //     setloadingSpinner(true);
  //     const nkey = localStorage.getItem('key');
  //     const token = JSON.parse(nkey);
  //     const FYPDataString = localStorage.getItem('FYPData');
      
  //     // Parse the JSON string to get the FYPData object
  //     const fypRegData = JSON.parse(FYPDataString);
  //     const groupId = fypRegData._id;
  //     console.log("Checking group id in send topic req api", groupId);
      
  //     // Make a GET request to your backend API endpoint with the groupId
  //     const response = await axios.get(`/api/fyp/fypTopicReq/${groupId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}` // Include the token in the Authorization header
  //       }
  //     });
  
  //     // console.log("Checking topicccccccccccccccccccccccccccccc response", response);
    
  //     // Check if the request was successful
  //     if (response.status === 200) {
  //       setTopicReqExist(response.data[0]);
  //       console.log("old topic", response.data[0].fypTopic);
  //       console.log("new topic", response.data[0].newFypTopic);
  //       console.log("reason", response.data[0].reasonForChange);
  //       console.log("Checking topic request status", TopicReqExist.techReqStatus);
          
  //       if(response.data[0].length !==0 ){
  //         console.log("Check passed");
  //         setFypTopic( response.data[0].fypTopic);
  //         setNewFypTopic(response.data[0].newFypTopic);
  //         setTopicReason(response.data[0].reasonForChange);
  //         setTopicReqStatus(response.data[0].topicReqStatus);
  //         // if(response.data[0].topicReqStatus === "approved"){
  //         //   // setFypTopic("");
  //         //   setNewFypTopic("");
  //         //   setTopicReason("");
  //         // }
  //       } else {
  //         console.log("Check failed");
  //         // setFypTopic({ value: response.data[0].fypTopic, label: response.data[0].fypTopic });
  //       }
  //     } else {
  //       // Handle other status codes if needed
  //       console.error('Failed to fetch FYPTopicReq:', response.statusText);
  //       return null; // or throw an error
  //     }
  //     console.log("Request sent");
  //   } catch (error) {
  //     // Handle any errors that occur during the request
  //     console.error('Error fetching FYPTopicReq:', error.message);
  //     return null; // or throw an error
  //   } finally {
  //     setloadingSpinner(false);
  //   }
  // }

  const checkTopicReqStatus = async () => {
    // console.log("Runingggggg");
    try {
      setloadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const FYPDataString = localStorage.getItem('FYPData');
    
    // Parse the JSON string to get the FYPData object
    const fypRegData = JSON.parse(FYPDataString);
    const groupId = fypRegData._id;
    console.log("Checking group id in send topic req api", groupId);
      // Make a GET request to your backend API endpoint with the groupId
     const response = await axios.get(`/api/fyp/fypTopicReq/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
  
      console.log("Checking topicccccccccccccccccccccccccccccc response", response);
  
      // Check if the request was successful

      if (response.status === 200) {
        // console.log("Insideeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        setTopicReqExist(response.data[0]);
        // console.log("old tech", response.data[0].fypTechnology);
        // console.log("new tech", response.data[0].newFypTechnology);
        // console.log("reason", response.data[0].reasonForChange);
        setTopicReqStatus(response.data[0].topicReqStatus);
        if(TopicReqExist.topicReqStatus === "pending"){
                  setFypTopic( response.data[0].fypTopic);
          setNewFypTopic(response.data[0].newFypTopic);
          setTopicReason(response.data[0].reasonForChange);
          setTopicReqStatus(response.data[0].topicReqStatus);
        }
        
      
      } else {
        // Handle other status codes if needed
        console.error('Failed to fetch FYPTechnologyReq:', response.statusText);
        return null; // or throw an error
      }
      console.log("Request sentttttttttt");
      console.log("Request sentttttttttt");
      console.log("Request sentttttttttt");
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error fetching FYPTechnologyReq:', error.message);
      return null; // or throw an error
    } finally {
      setloadingSpinner(false);
    }
  }
  
  const handleTopicSubmit = async (event) => {
    console.log("hanlde submit topic called");
    event.preventDefault();
    // Form validation
    let isValid = true;
    if (!fypTopic.trim()) {
      setFypTopicError('FYP Topic is required');
      isValid = false;
    } else {
      setFypTopicError('');
    }
  
    if (!newFypTopic.trim()) {
      setNewFypTopicError('New FYP Topic is required');
      isValid = false;
    } else {
      setNewFypTopicError('');
    }
  
    if (!topicReason.trim()) {
      setReasonError('Reason is required');
      isValid = false;
    } else {
      setReasonError('');
    }
  
    // If form is valid, submit the request
    if (isValid) {
      console.log("FYP Topic", fypTopic);
      console.log("New Topic", newFypTopic);
      console.log("Reason", topicReason);
      if (TopicReqExist.topicReqStatus === "pending") {
        try {
          console.log("Update topic request calledddddddddddddddddddddddddddd");
          setloadingSpinner(true);
      
          // Fetch necessary data from localStorage
          const FYPDataString = localStorage.getItem('FYPData');
          const userData = localStorage.getItem('user');
      
          // Parse the JSON strings to get the user and group IDs
          const fypRegData = JSON.parse(FYPDataString);
          const groupId = fypRegData._id;
          const userId = JSON.parse(userData);
          const user = userId._id;
      
          // Get token from localStorage
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
      
          // Send PATCH request to update the topic change request
          const response = await axios.patch(
            `/api/fyp/UpdateTopicRequest/${TopicReqExist._id}`, // Assuming TopicReqExist contains the existing request data
            {
              user,
              groupId,
              fypTopic: fypTopic,
              newFypTopic: newFypTopic,
              reasonForChange: topicReason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Request sent");
      
          // Check if the request was successful
          if (response.status === 200) {
            console.log('Topic change request updated successfully.');
            // setTopicReqStatus(response.data[0].topicReqStatus);
            // Update TopicReqExist with the updated request data
            setTopicReqExist(response.data);
      
            // Close the modal
            setShowTopicModal(false);
            window.location.reload();
          } else {
            // Handle other status codes if needed
            console.error('Failed to update topic change request:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating topic change request:', error);
        } finally {
          setloadingSpinner(false);
        }
      }
      
  else{
      try {
        console.log("Inside posting topic change request");
        setloadingSpinner(true);
        // setFypTopic('');
        // setNewFypTopic('');
        // setNewFypTechnology('');
        const FYPDataString = localStorage.getItem('FYPData');
  
        // Parse the JSON string to get the FYPData object
        const fypRegData = JSON.parse(FYPDataString);
        const groupId = fypRegData._id;
  
        const userData = localStorage.getItem('user');
  
        // Parse the JSON string to get the FYPData object
        const userId = JSON.parse(userData);
        const user = userId._id;
  
        console.log("Checking user id", user);
        console.log("Checking group id", groupId);
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        const response = await axios.post('/api/fyp/ChangeTopicRequest', {
          user,
          groupId,
          fypTopic: fypTopic,
          newFypTopic: newFypTopic,
          reasonForChange: topicReason,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Checking response", response.status);
  
        if (response.status === 201) {
          console.log('Topic change request submitted:');
          setShowTopicModal(false);

  
          const newReqId = response.data._id;
          console.log("Checking new req id", newReqId);
  
          const newRequest = {
            _id: newReqId, // Use actual ID returned by the server
            user,
            groupId,
            fypTopic: fypTopic,
            newFypTopic: newFypTopic,
            reasonForChange: topicReason,
          };
          setTopicReqExist(newRequest);
          window.location.reload();
  
        }
  
        console.log("Checking topic state variable", TopicReqExist);
  
      } catch (error) {
        console.error('Error submitting topic change request:', error);
      } finally {
        setloadingSpinner(false);
      }
    }
    }
  };


  



  const handleTechnologySubmit = async (event) => {
    event.preventDefault();
    // Form validation
    let isValid = true;
      if (!fypTechnology.label) {
        setFypTechnologyError('FYP Technology is required');
        isValid = false;
      } else {
        setFypTechnologyError('');
      }

      if (!newFypTechnology.label) {
        setNewFypTechnologyError('New FYP Technology is required');
        isValid = false;
      } else {
        setNewFypTechnologyError('');
      }
   
    if (!techReason.trim()) {
      setReasonError('Reason is required');
      isValid = false;
    } else {
      setReasonError('');
    }

    // If form is valid, submit the request
    if (isValid) {
      console.log("FYP Tech", fypTechnology.label);
      console.log("NEW Tech", newFypTechnology.label);
      console.log("Reason", techReason);

      if(TechReqExist.techReqStatus === "pending"){
        try {
          console.log("Updateeeeeeeeeeeeeee Calledddddddddddddddddd");
          setloadingSpinner(true);
        
          // Fetch necessary data from localStorage
          const FYPDataString = localStorage.getItem('FYPData');
          const userData = localStorage.getItem('user');
        
          // Parse the JSON strings to get the user and group IDs
          const fypRegData = JSON.parse(FYPDataString);
          const groupId = fypRegData._id;
          const userId = JSON.parse(userData);
          const user = userId._id;
        
          // Get token from localStorage
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
        
          // Send PATCH request to update the technology change request
          const response = await axios.patch(
            `/api/fyp/UpdateTechRequest/${TechReqExist._id}`, // Assuming TechReqExist contains the existing request data
            {
              user,
              groupId,
              fypTechnology: fypTechnology.label,
              newFypTechnology: newFypTechnology.label,
              reasonForChange: techReason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Request senttttttttttttttttttttttttttttttttttttttttttttttttttttt");
        
          // Check if the request was successful
          if (response.status === 200) {
            console.log('Technology change request updated successfully.');
        
            // Update TechReqExist with the updated request data
            setTechReqExist(response.data);
        
            // Close the modal
            setShowTechnologyModal(false);
            window.location.reload();
          } else {
            // Handle other status codes if needed
            console.error('Failed to update technology change request:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating technology change request:', error);
        } finally {
          setloadingSpinner(false);
        }
        
      } 
      else{
        console.log("Posttttttttttttttt Calleddddddddddddddddddddddddddd");
      try {
        setloadingSpinner(true);
        const FYPDataString = localStorage.getItem('FYPData');
    
    // Parse the JSON string to get the FYPData object
    const fypRegData = JSON.parse(FYPDataString);
    const groupId = fypRegData._id;


        const userData = localStorage.getItem('user');
    
    // Parse the JSON string to get the FYPData object
    const userId = JSON.parse(userData);
    const user = userId._id;

    console.log("Checking user id", user);
    console.log("Checking group id", groupId);
    const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await axios.post('/api/fyp/ChangeTechRequest', {
        user,
        groupId,
        fypTechnology: fypTechnology.label,
        newFypTechnology: newFypTechnology.label,
        reasonForChange: techReason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log("Checking response", response.status);
      // setShowTechnologyModal(false); 
          if(response.status === 201){
          console.log('Technology change request submitted:');
          // setShowTechModal(false);
          setShowTechnologyModal(false); 
          
        const newReqId = response.data._id;
        console.log("Checking new req id", newReqId);
      
      const newRequest = {
        _id: newReqId, // Use actual ID returned by the server
        user,
        groupId,
        fypTechnology: fypTechnology.label,
        newFypTechnology: newFypTechnology.label,
        reasonForChange: techReason,
      };
      console.log("Checking new updated technology", newRequest);
      setTechReqExist(newRequest);
      console.log("Checking setTehReqexisttttttttt", TechReqExist);
      
          }

          console.log("Checking tech state variable", TechReqExist);
        
       
        // Handle successful response
        window.location.reload();
      } catch (error) {
        console.error('Error submitting technology change request:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setloadingSpinner(false);
      }
    }
      
    }
  };
  // console.log("Checking techReqExist ddataaaaaaaaaaaaaaaaaaaaaa", TechReqExist[0].techReqStatus);
  // console.log("Checking techReqExist statussssssssssssssssssssss", TechReqExist[0].techReqStatus);

  return (
    <>
     {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
    ):(
      <div>
      <div className='mx-14'>
        <div className='grid grid-cols-4 gap-x-4 gap-y-4 mt-5 max-h-[35.9375rem] overflow-y-auto pr-2 pb-5'>
          <div className='col'>
          <RequestCard reqType={'Change FYP Topic'} onRegisterNow={() => handleRegisterNow('Change FYP Topic')} TechReqExist={TechReqExist} />

          </div>
          <div className='col'>
            <RequestCard reqType={'Change FYP Technology'} onRegisterNow={() => handleRegisterNow('Change FYP Technology')} />
          </div>
        </div>
      </div>

      {showTopicModal && (
        <Modal onClose={handleCloseTopicModal}>
          <div className="relative p- max-w-lg mt-0 max-h-full">
          <div className=" items-center justify-between p-2 md:p-1 border-b    mb-2">
            
                <h3 className="text-3xl font-semibold text-gray-900 mb-3 text-center">

                <p className='font-normal'>{TopicReqExist && TopicReqExist.topicReqStatus === "pending" ? 'Edit Request' : 'Request'}</p>
                </h3>
                
                <div className='max-h-14 overflow-y-auto'>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                  {TopicReqExist && TopicReqExist.topicReqStatus === "pending" ? "Wait for supervisor's response" : "Fill required fields to send FYP Topic Change Request to your supervisor"}
                  </p>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    {/* Another line of text. */}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-primary hover:text-white rounded-lg w-8 h-8 absolute top-2 right-2 text-2xl"
                  onClick={handleCloseTopicModal}
                >
                  &times;
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            {/* Topic Request Form Fields */}
            <form onSubmit={handleTopicSubmit}>
              {/* FYP Topic field */}
              <label htmlFor="fypTopic" className="block mb-2 text-sm font-medium text-gray-900">
                FYP Topic
              </label>
              <input
                type="text"
                id="fypTopic"
                name="fypTopic"
                value={fypTopic}
                onChange={(e) => setFypTopic(e.target.value)}
                placeholder="Enter your current FYP topic"
                className={`bg-gray-50 border ${fypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
              />
              {fypTopicError && <p className="text-red-500 text-sm mt-1">{fypTopicError}</p>}

              {/* New FYP Topic field */}
              <label htmlFor="newFypTopic" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                New FYP Topic
              </label>
              <input
                type="text"
                id="newFypTopic"
                name="newFypTopic"
                value={newFypTopic}
                onChange={(e) => setNewFypTopic(e.target.value)}
                placeholder="Enter your new FYP topic"
                className={`bg-gray-50 border ${newFypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3       dark:text-white`}
              />
              {newFypTopicError && <p className="text-red-500 text-sm mt-1">{newFypTopicError}</p>}

              {/* Reason field for FYP Topic */}
              <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                Reason for Change (FYP Topic)
              </label>
              <textarea
                id="reason"
                name="reason"
                rows="3"
                value={topicReason}
                onChange={(e) => setTopicReason(e.target.value)}
                placeholder="Enter your Reason to change FYP topic"
                className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
              ></textarea>
              {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}

              {/* Submit Button */}
              <div className="flex justify-between mt-3 ">
                <Simple text="Cancel" onClick={handleCloseTopicModal} />
                <button type="submit" className="text-white bg-primary hover:bg-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">{TopicReqExist && TopicReqExist.topicReqStatus === "pending" ? "Update Request" : "Send Topic Request"}</button>
              </div>
            </form>
          </div>
        </Modal>
      )}

{showTechnologyModal && (
        <Modal onClose={handleCloseTechnologyModal}>
          <div className="relative p- max-w-lg mt-0 max-h-full">
          <div className=" items-center justify-between p-2 md:p-1 border-b    mb-2">
                <h3 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
                <p className='font-normal'>{TechReqExist && TechReqExist.techReqStatus === "pending" ? 'Edit Request' : 'Request'}</p>
                </h3>
                <div className='max-h-14 overflow-y-auto'>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    {TechReqExist && TechReqExist.techReqStatus === "pending" ? "Wait for supervisor's response" : "Fill required fields to send Technology Change Request to your supervisor"}
                  </p>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    {/* Another line of text. */}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-secondary hover:text-white rounded-lg w-8 h-8 absolute top-2 right-2 text-2xl"
                  onClick={handleCloseTechnologyModal}
                >
                  &times;
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            {/* Technology Request Form Fields */}
            <form onSubmit={handleTechnologySubmit}>
            <label htmlFor="fypTechnology" className="block text-sm font-medium text-gray-600">
        Select FYP Technology
      </label>
      <Select
        id="fypTechnology"
        name="fypTechnology"
        className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
        options={technologyOptions}
        isSearchable
        onChange={(selectedOption) => setFypTechnology(selectedOption)}
        value={fypTechnology}
        placeholder="Select or type current technology"
        maxMenuHeight={100}
      />
      {fypTechnologyError && <p className="text-red-500 text-sm mt-1">{fypTechnologyError}</p>}

      {/* New FYP Technology field */}
      <label htmlFor="newFypTechnology" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
        New FYP Technology
      </label>
      <Select
        id="newFypTechnology"
        name="newFypTechnology"
        className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
        options={technologyOptions}
        isSearchable
        onChange={(selectedOption) => setNewFypTechnology(selectedOption)}
        value={newFypTechnology}
        placeholder="Select or type new technology"
        maxMenuHeight={100}
      />
      {newFypTechnologyError && <p className="text-red-500 text-sm mt-1">{newFypTechnologyError}</p>}

      {/* Reason field for FYP Technology */}
      <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
        Reason for Change (FYP Technology)
      </label>
      <textarea
        id="reason"
        name="reason"
        rows="3"
        value={techReason}
        onChange={(e) => setTechReason(e.target.value)}
        placeholder="Enter your Reason to change FYP technology"
        className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
      ></textarea>
      {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}


              <div className="flex justify-between mt-3 ">
                <Simple text="Cancel" onClick={handleCloseTechnologyModal} />
                <button type="submit" className="text-white bg-primary  hover:bg-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">{TechReqExist && TechReqExist.techReqStatus === "pending" ? "Update Request" : "Send Tech Request"}</button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <div className="relative p- max-w-lg mt-0 max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              {/* Modal content */}
              <div className=" items-center justify-between p-2 md:p-1 border-b    mb-2">
                <h3 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
                <p className='font-normal'>{TechReqExist || TopicReqExist ? 'Edit Request' : 'Request'}</p>
                </h3>
                <div className='max-h-14 overflow-y-auto'>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    Add your additional text lines here.
                  </p>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    Another line of text.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-secondary hover:text-white rounded-lg w-8 h-8 absolute top-2 right-2 text-2xl"
                  onClick={handleCloseModal}
                >
                  &times;
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Form fields */}
              <div className='formFields'>
                {/* Common fields for all request types */}
                <form onSubmit={handleTechnologySubmit}>
  {requestType === 'Change FYP Technology' && (
    <>
      {/* FYP Technology field */}
      <label htmlFor="fypTechnology" className="block text-sm font-medium text-gray-600">
        Select FYP Technology
      </label>
      <Select
        id="fypTechnology"
        name="fypTechnology"
        className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
        options={technologyOptions}
        isSearchable
        onChange={(selectedOption) => setFypTechnology(selectedOption)}
        value={fypTechnology}
        placeholder="Select or type current technology"
        maxMenuHeight={100}
      />
      {fypTechnologyError && <p className="text-red-500 text-sm mt-1">{fypTechnologyError}</p>}

      {/* New FYP Technology field */}
      <label htmlFor="newFypTechnology" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
        New FYP Technology
      </label>
      <Select
        id="newFypTechnology"
        name="newFypTechnology"
        className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
        options={technologyOptions}
        isSearchable
        onChange={(selectedOption) => setNewFypTechnology(selectedOption)}
        value={newFypTechnology}
        placeholder="Select or type new technology"
        maxMenuHeight={100}
      />
      {newFypTechnologyError && <p className="text-red-500 text-sm mt-1">{newFypTechnologyError}</p>}

      {/* Reason field for FYP Technology */}
      <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
        Reason for Change (FYP Technology)
      </label>
      <textarea
        id="reason"
        name="reason"
        rows="3"
        value={techReason}
        onChange={(e) => setTechReason(e.target.value)}
        placeholder="Enter your Reason to change FYP technology"
        className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
      ></textarea>
      {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}

      <div className="flex justify-between mt-3 ">
        <Simple text="Cancel" onClick={handleCloseModal} />
        <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Send tech Request</button>
      </div>
    </>
  )}
</form>


                {requestType === 'Change FYP Topic' && (
                  <>
                    {/* FYP Topic field */}
                    <label htmlFor="fypTopic" className="block mb-2 text-sm font-medium text-gray-900">
                      FYP Topic
                    </label>
                    <input
                      type="text"
                      id="fypTopic"
                      name="fypTopic"
                      value={fypTopic}
                      onChange={(e) => setFypTopic(e.target.value)}
                      placeholder="Enter your current FYP topic"
                      className={`bg-gray-50 border ${fypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
                    />
                    {fypTopicError && <p className="text-red-500 text-sm mt-1">{fypTopicError}</p>}

                    {/* New FYP Topic field */}
                    <label htmlFor="newFypTopic" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      New FYP Topic
                    </label>
                    <input
                      type="text"
                      id="newFypTopic"
                      name="newFypTopic"
                      value={newFypTopic}
                      onChange={(e) => setNewFypTopic(e.target.value)}
                      placeholder="Enter your new FYP topic"
                      className={`bg-gray-50 border ${newFypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3       dark:text-white`}
                    />
                    {newFypTopicError && <p className="text-red-500 text-sm mt-1">{newFypTopicError}</p>}

                    {/* Reason field for FYP Topic */}
                    <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      Reason for Change (FYP Topic)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows="3"
                      value={topicReason}
                      onChange={(e) => setTopicReason(e.target.value)}
                      placeholder="Enter your Reason to change FYP topic"
                      className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5       dark:text-white`}
                    ></textarea>
                    {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}
                  </>
                )}
              </div>
              {/* <div className="flex justify-between mt-3 ">
                <Simple text="Cancel" onClick={handleCloseModal} />
                <Simple text="Send Request" onClick={handleSendRequest} />
              </div> */}
            </div>
          </div>
        </Modal>
      )}
    </div>
    )}
    </>
  );
};

export default Request;
