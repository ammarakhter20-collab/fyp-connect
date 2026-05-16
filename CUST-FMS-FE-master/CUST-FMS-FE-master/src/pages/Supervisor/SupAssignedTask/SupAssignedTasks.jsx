import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import SupActiveGroups from './SupActiveGroups';
import SupAddTask from './SupAddTask';
import SupUploadedTasks from './SupUploadedTasks';
import SupViewAssignedTask from './SupViewAssignedTask';
import SupAssignMarks from './SupAssignMarks';
import SupMarksStdSelection from './SupMarksStdSelection';
import SupViewStdMarks from './SupViewStdMarks';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';



const SupAssignedTasks = () => {
  const [showActiveGroups, setShowActiveGroups] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUploadedTask, setShowUploadedTask] = useState(false);
  const [showViewAssignedTasks, setShowViewAssignedTasks] = useState(false);
  const [showAssignMarks, setShowAssignMarks] = useState(false);
  const [showStdSelection, setShowStdSelection] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [viewMarks, setViewMarks] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);//stored Id
  const [addedTasks, setAddedTasks] = useState([]);//Array of added tasks for all groups
  const [addedMarks, setAddedMarks] = useState([]);//Array of added tasks for all groups
  const [partStatus, setPartStatus] = useState(null);//
  const [group, setGroup] = useState(null);//selectedGroup from Approved Projects
  const [filtered, setFiltered] = useState(null);//filtered tasks for  selected group
  const [student, setStudent] = useState(null);
  const [appprovedProjects, setApprovedProjects] = useState(null);//list of approved projects (groups of students)
  const [selectedTask, setSelectedTask] = useState();//Selected Task for view 
  const ViewMarksClick = (id) => {
    const Group = appprovedProjects.find(group => (group._id === id))
    if (Group) {
      const selectedMembers = Group.members.map(member => ({
        id: member.id,
        Name: member.Name,
        RegistrationNo: member.RegistrationNo
      }));
      setGroup(selectedMembers);
    }
    setShowStdSelection(true);
  }
  const ViewTaskClick = (id) => {
    console.log(id, "this is id of the grp")
    const group = appprovedProjects.find(group => (group._id === id))
console.log(addedTasks, "sfgwe4gweg")
const filteredTasks = addedTasks.tasks.filter(task =>( task.groupId === id));

console.log(filteredTasks, 'Tasks ha yeh');

setFiltered(filteredTasks)

    if (group) {
      setGroup(group);
    }
    setShowUploadedTask(true);
    setShowActiveGroups(false);
  }
  const AddTaskClick = (id) => {
    const Group = appprovedProjects.find(group => (group._id === id))
    const selectedGroupId = Group._id
    const partStatus = Group.partStatus;
    setPartStatus(partStatus);
    console.log("partstatus", partStatus)
    setSelectedGroup(selectedGroupId);
    setShowAddTask(true);
  }
  const handleAddedTasks = (data) => {
    const updatedTasks = { ...data };
    console.log(data, "yo check this out")
    handleAddTask(data)
    setAddedTasks(updatedTasks);
    setShowActiveGroups(true);
    handleAddTaskClose();
  }
  const handleAddTaskClose = () => {
    setShowAddTask(false);
    setShowActiveGroups(true);
  }
  const handleAddMarksClose = () => {
    setShowAssignMarks(false);
  }
  const handleStdSelectionClose = () => {
    setShowStdSelection(false);
  }
  const handleViewDetailsClickUploadeTasks = (id) => {
    const filteredTask = addedTasks.tasks.find(task => (task._id === id))
    setSelectedTask(filteredTask);
    setShowViewAssignedTasks(true);
  }
  const handleGoBack = () => {
    setShowActiveGroups(true)
    setShowAddTask(false)
    setShowUploadedTask(false)
    setShowViewAssignedTasks(false)
    setShowAssignMarks(false)
    setShowStdSelection(false)
    setViewMarks(false)
  }
  const handleAddTask = async (task) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const formData = new FormData();
      formData.append('title', task.title);
      formData.append('assignedDate', task.assignedDate);
      formData.append('dueTime', task.dueTime);
      formData.append('dueDate', task.dueDate);
      formData.append('taskno', task.taskno);
      formData.append('taskStatus', task.taskStatus);
      formData.append('points', task.points);
      formData.append('instructions', task.instructions);
      formData.append('group', task.group);
      // Add other task properties as needed
      
      // Append attachPdf files to the formData
      // task.attachPdf.forEach((file, index) => {
      //   formData.append(`attachPdf`, file);
      // });

      formData.append('attachPdf', task.attachPdf[0])
      
      // Append partStatus to formData
      formData.append('partStatus', partStatus);
      
      // Send formData in the fetch request
      
      console.log(formData, "data of the form ")

//SENT FILE ALONG WITH THE FORM DATA SIMPLE AS IN BODY WITHOUT SPECIFYING ANY CONTENT TYPE DON'T KNOW HOW'D IT WORK, BUT ANYHOW



      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;

      const apiUrl = `/api/task/upload-task/${userid}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',     formData,
         //'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      body: formData,
        //file: task.attachPdf,
      });
      if (response.ok) {
        // Handle successful response
        window.location.reload();
        console.log('Task uploaded successfully');
      } else {
        console.log('Failed to upload task');
      }
    }
    catch (error) {
      console.error('Error Uploading Task: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }


  
  const handleAddMarks = async (taskId, marks) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;

      const apiUrl = `/api/auth/upload-marks`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId, userid, marks, selectedGroup, partStatus, feedback
        }),
      });
      if (response.ok) {
        // Handle successful response
        window.location.reload();
        console.log(' Marks Added successfully');
      } else {
        console.log('Failed to Add Marks ');
      }
    }
    catch (error) {
      console.error('Error Marking :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }
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
        partStatus: data.partStatus,
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
  const fetchAddedTasks = async () => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;
      const filter = "approved";

      const response = await fetch(`/api/task/get-tasks/${userid}`, {
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
      console.log(data, 'fetched tasks');
      setAddedTasks(data);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };




  const fetchAddedMarks = async (stdid) => {
    console.log("Checking student id", stdid);
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;
      const response = await fetch(`/api/auth/get-marks/${stdid}?`, {
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
      console.log(data, "Fetched Marks dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      setAddedMarks(data);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
  const addMarksClick = (id, feedback) => {
    const Group = appprovedProjects.find(group => (group._id === id))
    const selectedGroupId = Group._id
    setSelectedGroup(selectedGroupId);
    setFeedback(feedback);
    const partStatus = Group.partStatus;
    setPartStatus(partStatus);
    console.log("partstatus", partStatus)
    setShowAssignMarks(true);
  }
  const handleMarksAddClick = (marks) => {
    const taskId = selectedTask._id;
    handleAddMarks(taskId, marks);
    setShowAssignMarks(false);
  }
  const editTaskClick = () => {
    setShowViewAssignedTasks(false);
    setShowActiveGroups(false)
    setShowUploadedTask(false);
    setShowAddTask(true);
  }
  const handleViewStdMarksClick = async (id) => {
    const Student = group.find(student => (student.id === id))
    setStudent(Student);
    setViewMarks(true);
    setShowActiveGroups(false);
    setShowStdSelection(false);
    await fetchAddedMarks(id);
  }
  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupAssignedTasks';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);
  useEffect(() => {
    fetchApprovedGroups();
    fetchAddedTasks();
  }, [])
  return (
    <>

      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full h-full'>
          <div className=" mx-10 pt-12 flex flex-col gap-3 ">
            {showActiveGroups && (<div>
              <SupActiveGroups groupData={appprovedProjects} accordionId={1} AddTaskClick={AddTaskClick} ViewTaskClick={ViewTaskClick} ViewMarksClick={ViewMarksClick} />
            </div>)}
            {showAddTask && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
              <SupAddTask selectedGroup={selectedGroup} onclose={handleAddTaskClose} handleAddTasks={handleAddedTasks} />
            </div>)}
            {showUploadedTask && filtered && (
              <div>
                <div className='relative top-0 left-0 w-full h-full  justify-center items-center '>
                  <SupUploadedTasks groupData={filtered} group={group} accordionId={2} viewDetailsClick={handleViewDetailsClickUploadeTasks} />
                </div>
                <div className='flex flex-row justify-end  mt-5'>
                  <ButbgPrimary text="Back" onClick={handleGoBack} />
                </div>
              </div>)}
            {showViewAssignedTasks && (<div className="relative top-0 left-0 w-full h-full  justify-center items-center ">
              <SupViewAssignedTask data={selectedTask} addMarksClick={addMarksClick} editTaskClick={editTaskClick} />
            </div>)}
            {showAssignMarks && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
              <SupAssignMarks onclose={handleAddMarksClose} selectedGroup={group} onAddClick={handleMarksAddClick} />
            </div>)}
            {showStdSelection && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
              <SupMarksStdSelection onclose={handleStdSelectionClose} selectedGroup={group} onViewTBClick={handleViewStdMarksClick} />
            </div>)}
            {viewMarks && student && addedMarks&& (
              <div>
                <div className='relative top-0 left-0 w-full h-full  justify-center items-center'>
                  <SupViewStdMarks selectedStudent={student} accordionId={3} tasks={addedMarks} />
                </div>
                <div className='flex flex-row justify-end  mt-5'>
                  <ButbgPrimary text="Back" onClick={handleGoBack} />
                </div>
              </div>)}
          </div>
        </div>)}
    </>
  )
}

export default SupAssignedTasks
