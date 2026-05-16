

import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import { MdCloudDownload } from 'react-icons/md';
// import { StdATaskData } from './StdATaskData';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { MdMoreVert, MdFileUpload, MdInsertDriveFile } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const AssignedTasks = ({ accordionId }) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [AssTask, setAssTask] = useState('');
  const [UploadedFileName, setUploadedFileName] = useState('');
  const [TaskMarks, setTaskMarks] = useState('');
  const [TaskFeedback, setTaskFeedback] = useState('');
  const [TaskPoints, setTaskPoints] = useState('');
  const [TObtainedTaskMarks, setObtainedTaskMarks] = useState('');
  const [TaskSubStatus, setTaskSubStatus] = useState(false);
  let [taskCounter, setTaskCounter] = useState(1);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // Add this line to declare 'showOptions'
  const [isViewFeedbackClicked, setViewFeedbackClicked] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailsVisible, setTaskDetailsVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isTaskSubmitted, setIsTaskSubmitted] = useState(false);



  const navigate = useNavigate();

  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AssignedTasks';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, [selectedFilter, navigate]);

  useEffect(() => {
    const taskIdFromStorage = localStorage.getItem('selectedTaskId');
    console.log("Checking taskIdFromStorage", taskIdFromStorage);
    if (taskIdFromStorage) {
      setTaskDetailsVisible(true);
      // setSelectedTaskId(taskIdFromStorage);
    }
  }, []);
  console.log("Checking task details bool", isTaskDetailsVisible);

  const fetchAssignedTasks = async () => {
    try {
      setLoadingSpinner(true);
      const FYPDataString = localStorage.getItem('FYPData');

      // Parse the JSON string to get the FYPData object
      const FYPData = JSON.parse(FYPDataString);
      const groupId = FYPData._id;
      console.log("Checking group id in assigned task get req");
      const token = JSON.parse(localStorage.getItem('key')); // Assuming 'key' is the key for the token in local storage

      // Set the token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Make a GET request to fetch assigned tasks
      const response = await axios.get(`/api/task/getAssignTask/${groupId}`, config); // Assuming your API endpoint is '/assignedTasks/:id'
      console.log("Response", response);
      console.log("Response data", response.data);

      // Check if the response data is an array
      if (Array.isArray(response.data)) {
        setAssTask(response.data);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    } catch (error) {
      // Handle any errors
      console.error('Error fetching assigned tasks:', error);
      throw error; // You can choose to handle errors differently if needed
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const filterTasks = (filter) => {
    if (!Array.isArray(AssTask)) {
      console.error("AssTask is not an array:", AssTask);
      return [];
    }

    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    return AssTask.filter((item) => {
      const dueDateParts = item.dueDate.split('-');
      const dueDate = new Date(
        parseInt(dueDateParts[2], 10),
        parseInt(dueDateParts[1], 10) - 1,
        parseInt(dueDateParts[0], 10)
      );

      if (filter === 'Overdue') {
        return (
          dueDate < today &&
          !isSameDay(dueDate, today)
        );
      } else if (filter === 'All') {
        return true;
      } else if (filter === 'today') {
        return isSameDay(dueDate, today);
      } else if (filter === 'thisWeek') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

        return (
          dueDate >= startOfWeek &&
          dueDate <= endOfWeek &&
          !isSameDay(dueDate, today)
        );
      }
      
      return false; // Default return for filter

      function isSameDay(date1, date2) {
        return (
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        );
      }
    });
  };


  const fetchMarksData = async (taskId) => {
    console.log("Checking task id", taskId);
    try {
      setLoadingSpinner(true);
      const key = JSON.parse(localStorage.getItem("key"));

      // console.log("Checking fetching part Status", partStatus);
      const groupId = JSON.parse(localStorage.getItem("FYPData"));
      const grpId = groupId._id;
      console.log("Checking grpId fetching", grpId);
      console.log("Checking task_id", taskId);


      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Construct the URL with partStatus, supervisorId, and coordinatorId
      const url = `/api/taskMarks/fetchTaskMarks/${grpId}/${taskId}`;

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data || !response.data) {
          console.error('Error fetching announcement data:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Checking Fetched Marks Data", response.data);



      // Process the fetched announcement data
      // Assuming you have a function to handle this, e.g., setAnnouncementData
      setTaskMarks(response.data);

      // Optionally, you can save the announcement data to localStorage
      // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
    } catch (error) {
      console.error('Error fetching Task marks data:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };


  useEffect(() => {

    const manageTaskStates = async () => {
      // window.location.reload();


      try {
        setLoadingSpinner(true);

        if (selectedTask && selectedTask.status === "submitted") {

          const taskUploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
          const uploadedFileName = taskUploadedFiles && taskUploadedFiles[selectedTask._id] ? taskUploadedFiles[selectedTask._id] : null;
          setUploadedFileName(uploadedFileName);
          console.log("Checking Uploaded FIle", uploadedFileName);
          setIsFileUploaded(true);
          setUploadedFile(uploadedFileName);
          setTaskPoints(selectedTask.points);
          console.log("Checking Selected Task", selectedTask)
          await fetchMarksData(selectedTask._id);
          console.log("Checking Marks of particular Task in handle View", TaskMarks);

          if (TaskMarks && TaskMarks.length >= 1) {

            console.log("Inside task marks");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user._id;
            setTaskSubStatus(true);
            // setIsFileUploaded(true);
            // setTaskDetailsVisible(true);
            setIsTaskSubmitted(true);
            setTaskFeedback(TaskMarks[0].feedback);
            setViewFeedbackClicked(true);
            isTaskSubmitted(true);

            const TaskMarksS = TaskMarks[0].marks;

            TaskMarksS.forEach((mark) => {
              if (mark.student === userId) {
                setObtainedTaskMarks(mark.obtainedMarks);
                console.log("marks", mark.obtainedMarks);
              }
            });
            console.log("At the endddddddddd");
          } else {
            // setIsTaskSubmitted(false);
            setIsFileUploaded(true);
            setTaskDetailsVisible(true);
            // setSelectedTask(task);
            // setUploadedFile(uploadedFileName);
            // setUploadedFileName(uploadedFileName);
          }
        } else {
          setUploadedFile('');
          setViewFeedbackClicked(false);
          setTaskSubStatus(false);
          setUploadedFileName('');
          setIsFileUploaded(false);
          setIsTaskSubmitted(false);
          setTaskDetailsVisible(true);
          setSelectedTask(selectedTask);
        }
        // window.location.href = `${window.location.origin}${window.location.pathname}?taskId=${task._id}`;

      } catch (error) {
        console.error('Error handling view button click:', error);
      } finally {
        setLoadingSpinner(false);
      }
    };


    manageTaskStates();

  }, [selectedTask, TaskMarks, fetchMarksData, isTaskSubmitted]);

  console.log("Checking updation of states", isViewFeedbackClicked);
  console.log("Checking updation of states otherrrr", TaskFeedback);
  console.log("TObtained", TObtainedTaskMarks);
  const handleViewButtonClick = async (task) => {
    // window.location.reload();


    // try {
    // setLoadingSpinner(true);
    // setViewFeedbackClicked(false);
    // setTaskPoints(task.points);
    setSelectedTask(task);
    setTaskDetailsVisible(true);
    //   localStorage.setItem('selectedTaskId', task._id); // Store selected task ID in local storage

    //   console.log("Checking status of clicked view task", task.status);

    //   if (task.status === "submitted") {

    //     const taskUploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
    //     const uploadedFileName = taskUploadedFiles && taskUploadedFiles[task._id] ? taskUploadedFiles[task._id] : null;
    //     setUploadedFileName(uploadedFileName);
    //     console.log("Checking Uploaded FIle", uploadedFileName);
    //     setIsFileUploaded(true);
    //     setUploadedFile(uploadedFileName);

    //     await fetchMarksData(task._id);
    //     console.log("Checking Marks of particular Task in handle View", TaskMarks);

    //     if (TaskMarks && TaskMarks.length >= 1) {
    //       const user = JSON.parse(localStorage.getItem("user"));
    //       const userId = user._id;
    //       setTaskSubStatus(true);
    //       // setIsFileUploaded(true);
    //       // setTaskDetailsVisible(true);
    //       setIsTaskSubmitted(true);
    //       setTaskFeedback(TaskMarks[0].feedback);
    //       setViewFeedbackClicked(true);

    //       const TaskMarksS = TaskMarks[0].marks;

    //       TaskMarksS.forEach((mark) => {
    //         if (mark.student === userId) {
    //           setObtainedTaskMarks(mark.obtainedMarks);
    //         }
    //       });
    //     } else {
    //       // setIsTaskSubmitted(false);

    //       setIsFileUploaded(true);
    //       setTaskDetailsVisible(true);
    //       // setSelectedTask(task);
    //       // setUploadedFile(uploadedFileName);
    //       // setUploadedFileName(uploadedFileName);
    //     }
    //   } else {
    //     setUploadedFile('');
    //     setViewFeedbackClicked(false);
    //     setTaskSubStatus(false);
    //     setUploadedFileName('');
    //     setIsFileUploaded(false);
    //     setIsTaskSubmitted(false);
    //     setTaskDetailsVisible(true);
    //     setSelectedTask(task);
    //   }
    //   // window.location.href = `${window.location.origin}${window.location.pathname}?taskId=${task._id}`;

    // } catch (error) {
    //   console.error('Error handling view button click:', error);
    // } finally {
    //   setLoadingSpinner(false);
    // }
  };


  // console.log("Checking uploadedFIle state outside", uploadedFile);



  const handleGoBack = () => {
    setTaskDetailsVisible(false);
    setSelectedFilter('');

    // Add additional logic to handle going back, such as changing the route or state
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const taskDueDate = new Date(selectedTask.dueDate);
    const currentDate = new Date();

    // Check if the task due date has passed
    if (taskDueDate < currentDate) {
      alert("The due date for this task has already passed. You cannot upload a file.");
      return;
    }
    console.log("CHecking file in file uploaddddddddd", file);
    setUploadedFile(file);
    console.log("File set");

    // const newUploadedFiles = new Map(uploadedFiles); // Create a new Map from the existing one
    // newUploadedFiles.set(selectedTask._id, file); // Update the new Map with the new uploaded file
    // setUploadedFiles(newUploadedFiles); // Update the state with the new Map

    // const newUploadedFiles = new Map(JSON.parse(localStorage.getItem('uploadedFiles')) || []); // Retrieve uploaded files from localStorage
    // newUploadedFiles.set(selectedTask._id, { file, name: file.name }); // Store file object with name
    // localStorage.setItem('uploadedFiles', JSON.stringify(Array.from(newUploadedFiles))); // Store updated uploaded files in localStorage
    const taskID = selectedTask._id;
    const fileName = file.name;
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    uploadedFiles[taskID] = fileName;
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

    // Set uploaded file name and other states
    setUploadedFileName(fileName);
    console.log("Checking Uploaded filename", UploadedFileName);
    // setUploadedFileName(fileName);
    setIsFileUploaded(true);
    // setUploadedFileName({ file, name: file.name });
    console.log('Selected file:', file);
  };

  const handleFileDelete = () => {
    // setUploadedFiles(prevUploadedFiles => new Map(prevUploadedFiles.delete(selectedTask._id)));
    // setUploadedFile(null);
    //   const newUploadedFiles = new Map(uploadedFiles);
    // newUploadedFiles.delete(selectedTask._id);

    // Update the state with the new Map
    // setUploadedFiles(newUploadedFiles);
    const taskID = selectedTask._id;

    // Retrieve uploaded files from localStorage
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};

    // Check if the task ID exists in uploadedFiles
    if (uploadedFiles.hasOwnProperty(taskID)) {
      // Delete the task ID from uploadedFiles
      delete uploadedFiles[taskID];

      // Store updated uploaded files in localStorage
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }

    // Reset uploadedFile state and setIsFileUploaded
    setUploadedFile(null);
    setIsFileUploaded(false);

    // Reset uploadedFile state and setIsFileUploaded
    setUploadedFile(null);
    setIsFileUploaded(false);
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDateString = date.toISOString().split('T')[0];
    return formattedDateString;
  };



  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user._id;
    console.log("Checking user Id", userId);
    const formData = new FormData();
    formData.append('submitPdf', uploadedFile);
    console.log("Checking submitPdf inside handle submit", uploadedFile);
    formData.append('status', 'submitted');
    formData.append('SubmittedBy', userId);

    try {
      setLoadingSpinner(true);
      const token = JSON.parse(localStorage.getItem('key'));

      // Send POST request to updateTaskAssignment endpoint with the uploaded file
      const response = await axios.patch(`/api/task/SubmitTaskByStudent/${selectedTask._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Assuming 'token' is defined
        }
      });

      console.log("Checking responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", response);

      console.log('File upload response:', response);

      // Handle success response
      // For example, you can display a success message to the user
      if (response.status === 200) {
        // alert('File uploaded successfully');
        fetchAssignedTasks();
        // setUploadedFile(null);
        // setTaskDetailsVisible(true);
        setTaskSubStatus(true);

      }
    } catch (error) {
      // Handle error
      console.error('Error uploading file:', error);
      // Display an error message to the user
      alert('Error uploading file. Please try again.');
    } finally {
      setLoadingSpinner(false);
    }
  };

  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div>
          {isTaskDetailsVisible && selectedTask && isTaskDetailsVisible ? (
            <div className="mx-16 bg-slate mt-8">
              <div className="bg-white rounded-lg max-w-4xl max-h-[650px] pb-3">
                <div className='flex flex-row justify-between ml-6 mb-3 pt-3'>
                  <div>
                    <p className='text-lg text-secondary font-bold'>Task # {selectedTask.taskNo}</p>
                    <p className='text-primary font-bold'>Due {formattedDate(selectedTask.dueDate)}</p>
                  </div>
                  <div className='mr-8'>
                    <p>Status: {TaskSubStatus && TaskSubStatus ? "submitted" : "pending"}</p>
                  </div>
                </div>
                <div className="border-t border-gray-300 w-full"></div>
                <div className='ml-6 mt-2'>
                  <p className='text-primary font-bold'>Instructions</p>
                  <p className='max-h-48 overflow-y-auto'>{selectedTask.instruction}</p>
                </div>
                {uploadedFile && uploadedFile ? (
                  <div className='ml-6 mt-5 flex flex-col'>
                    <div className="relative bg-slate-200 flex justify-between rounded-md w-[600px] pt-2 pb-2">
                      {uploadedFile && UploadedFileName && (
                        <div className='flex items-center'>
                          <MdInsertDriveFile className='w-6 h-6 ml-3 text-primary' />
                          <p className='text-sm ml-2'>{UploadedFileName && UploadedFileName}</p>
                        </div>
                      )}
                      <div className="cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
                        <MdMoreVert className="w-6 h-6 text-gray-600 mr-3" />
                      </div>
                      {showOptions && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md">
                          <div className="px-2 py-1">
                            <p
                              className="cursor-pointer text-gray-700 hover:bg-gray-100 py-1 px-3"
                              onClick={() => handleFileDelete(selectedTask && selectedTask._id)}
                            >
                              Delete
                            </p>
                            {/* Add other options as needed */}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      {isTaskSubmitted && isTaskSubmitted ? (
                        // View Feedback section
                        <div className='bg-white rounded-lg max-w-4xl max-h-[450px] pb-3'>
                          <div className="font-semibold mt-4"></div>
                          {/* Show or hide feedback based on the state */}
                          {isViewFeedbackClicked ? (
                            <div className='mr-6'>
                              <div className="border-t border-gray-300 w-full"></div>
                              <div className='obtainedMarks w-80 bg-slate-300 h-20 '>
                                <div className='textFeedback m-3'>
                                  <p className='font-semibold '>
                                    Obtained Marks</p>
                                  <p className=''>{TObtainedTaskMarks && TObtainedTaskMarks}/{TaskPoints && TaskPoints}</p>
                                </div>

                              </div>
                              <p className='font-semibold text-lg'>Supervisor Feedback</p>
                              <div className='max-h-36 bg-slate-300 overflow-y-auto'>
                                <p>{TaskFeedback && TaskFeedback}</p>
                              </div>
                              {/* Add any other feedback-related content */}
                            </div>
                          ) : (
                            // View Feedback button
                            <button
                              className="px-4 py-2 bg-primary text-white rounded-md mt-2 mr-3"
                              onClick={() => setViewFeedbackClicked(true)}
                            >
                              View Feedback
                            </button>
                          )}
                        </div>
                      ) : (
                        // Submit section
                        <div>
                          {isFileUploaded && (
                            <div className='flex justify-end'>


                              {/* Add the Submit button */}
                              <button
                                className="px-4 py-2 bg-primary text-white rounded-md mt-2"
                                onClick={handleSubmit}
                              >
                                {TaskSubStatus && TaskSubStatus ? "Update" : "Submit"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='ml-6 mt-5 hover:cursor-pointer'>
                    <label htmlFor="fileInput" className='flex flex-col hover:cursor-pointer'>
                      <MdFileUpload className='w-8 h-8 ml-4 text-primary' />
                      <p className='text-sm ml-2'>Upload</p>
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, selectedTask._id)}
                    />
                  </div>
                )}
                <div className='flex justify-start ml-6'>
                  <button
                    className="underline text-black hover:text-gray-500 mt-3 text-sm"
                    onClick={handleGoBack}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='mx-16 '>
              <p className='font-semibold mt-8'>See your tasks here..</p>
              <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                onClick={() => {
                  setTaskCounter(1); // Reset the counter when changing the filter
                  // Toggle dropdown state
                }}
                className="text-white bg-primary hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-4 py-2.5 mt-6 w-36 text-center inline-flex items-center"
              >
                {!selectedFilter ? 'All' : selectedFilter === 'thisWeek' ? 'This week' : selectedFilter === 'Overdue' ? 'Overdue' : selectedFilter === 'All' ? 'All' : selectedFilter === 'today' ? 'today' : 'Filter'}


                <svg
                  className="w-2.5 h-2.5 ms-8"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52">
                <ul className="text-sm text-gray-700  " aria-labelledby="dropdownDefaultButton">
                  {/* Add 'All' option */}
                  <li className='border-b'>
                    <button onClick={() => {
                      setSelectedFilter('All');
                      setTaskCounter(1); // Reset the counter when changing the filter
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100    ">
                      All
                    </button>
                  </li>
                  <li className='border-b'>
                    <button onClick={() => {
                      setSelectedFilter('Overdue');
                      setTaskCounter(1); // Reset the counter when changing the filter
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100    ">
                      Overdue
                    </button>
                  </li>
                  <li className='border-b'>
                    <button onClick={() => {
                      setSelectedFilter('today');
                      setTaskCounter(1); // Reset the counter when changing the filter
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100    ">
                      Due today
                    </button>
                  </li>
                  <li className='border-b'>
                    <button onClick={() => {
                      setSelectedFilter('thisWeek');
                      setTaskCounter(1); // Reset the counter when changing the filter
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100    ">
                      Due this week
                    </button>
                  </li>
                </ul>
              </div>
              <div className='mt-10'>
                <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
                  <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <GenAccor text="Tasks" accordionId={accordionId} />
                  </h2>
                  <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                      {/* Timetable Table */}
                      <div className="table-container overflow-x-auto relative">
                        <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                          <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                            <tr className='border-b text-center'>
                              <th className="px-6 py-3  w-52">Task no.</th>
                              <th className="px-6 py-3  w-[500px] text-left">Assigned task</th>
                              <th className="px-6 py-3  w-52">Due Date</th>
                              <th className="px-6 py-3  w-52">Status</th>
                              <th className="px-6 py-3  w-52">Details</th>
                            </tr>
                          </thead>
                          <tbody>


                            {filterTasks && (!selectedFilter || selectedFilter === 'All') ?
                              filterTasks('All').map((item) => (
                                <tr key={item.taskNo} className="text-center">
                                  {/* Display the task number based on the counter for the specific filter */}
                                  <td className="px-6 py-4 font-semibold">{taskCounter++}</td>
                                  <td className="px-6 py-4 font-semibold">
                                    <a onClick={() => {
                                      console.log('PDF URL:', `/${item.attachPdf}`);
                                    }}
                                      href={`/${item.attachPdf}`}
                                      download={`file_${item.taskNo}.pdf`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-left"
                                    >
                                      <div className='flex'>
                                        <MdCloudDownload style={{ fontSize: "1.5rem" }} className='mr-2' />
                                        <span>{item.taskTitle}</span>
                                      </div>
                                    </a>
                                  </td>
                                  <td className="px-6 py-4 font-semibold">{formattedDate(item.dueDate)}</td>
                                  <td className="px-6 py-4 font-semibold">{item.status}</td>
                                  <td className="px-6 py-4 font-semibold">
                                    <button
                                      className="underline text-black hover:text-gray-500"
                                      onClick={() => handleViewButtonClick(item)}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                              :
                              filterTasks ? (
                                filterTasks(selectedFilter).map((item) => (
                                  <tr key={item.taskNo} className="text-center">
                                    {/* Display the task number based on the counter for the specific filter */}
                                    <td className="px-6 py-4 font-semibold">{taskCounter++}</td>
                                    <td className="px-6 py-4 font-semibold">
                                      <a onClick={() => {
                                        console.log('PDF URL:', `/${item.attachPdf}`);
                                      }}
                                        href={`/${item.attachPdf}`}
                                        download={`file_${item.taskNo}.pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-left"
                                      >
                                        <div className='flex'>
                                          <MdCloudDownload style={{ fontSize: "1.5rem" }} className='mr-2' />
                                          <span>{item.taskTitle}</span>
                                        </div>
                                      </a>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{formattedDate(item.dueDate)}</td>
                                    <td className="px-6 py-4 font-semibold">{item.status}</td>
                                    <td className="px-6 py-4 font-semibold">
                                      <button
                                        className="underline text-black hover:text-gray-500"
                                        onClick={() => handleViewButtonClick(item)}
                                      >
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center py-4">Data not found</td>
                                </tr>
                              )
                            }


                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AssignedTasks;


