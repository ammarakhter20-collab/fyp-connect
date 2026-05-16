import React, { useState, useEffect } from 'react';
import CoodPanelCreationCard from "./CoodPanelCreationCard";
import { initFlowbite, } from 'flowbite';
import CardOneButton from "../../../Components/Cards/CardOnebutton";
import CoodPanelDetails from './CoodPanelDetails';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import CoodAddFaculty from './CoodAddFaculty';
import CoodAddFacultyCard from './CoodAddFacultyCard';
import CoodAssignRoleCard from './CoodAssignRoleCard';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import AddFacultyInPanel from './AddFacultyInPanel';
import axios from 'axios';
const CoodExaminerPanel = () => {

  const optionsData = {
    departments: [
      { value: 'SE', label: 'BSSE' },
      { value: 'CS', label: 'BSCS' },
    ],
    programs: [
      { value: 'BSSE', label: 'BSSE', dept: 'SE', },
      { value: 'BSAI', label: 'BSAI', dept: 'SE', },
      { value: 'BSCS', label: 'BSCS', dept: 'CS', }
    ],
    terms: [
      { value: '201', label: '201' },
      { value: '203', label: '203' },
      { value: '241', label: '241' }
    ],
    faculty: [
      { name: 'MMALAM', program: 'BSSE', _id: '5453454w523', designation: 'lecturer', examrole: 'Panel Head', department: 'SE' },
      { name: 'AKS', program: 'BSSE', _id: 'dferg', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
      { name: 'FKS', program: 'BSCS', _id: 'fdhgrt', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
      { name: 'ARS', program: 'BSSE', _id: 'werugtr', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
    ]
  };


  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showAddFacultyCard, setShowAddFacultyCard] = useState(false);
  const [panelData, setPaneldata] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedPaneltoAssignRole, setSelectedPaneltoAssignRole] = useState(null);
  const [selectedPanelToAddFaculty, setSelectedPanelToAddFaculty] = useState(null);
  const [facultytoEdit, setFacultytoEdit] = useState(null);
  const [selectedPanelMembers, setSelectedPanelMembers] = useState(null);
  const [programsData, setProgramsData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [termData, setTermData] = useState([]);
  const [faculty, setFacultyData] = useState([]);
  const [showAddFacultyInsidePanel, setShowAddFacultyInsidePanel] = useState(false);
  const [editPanelData, setEditPanelData] = useState(null);
  const [EditMode, setEditMode] = useState(false);



  const handleGoBack = () => {
    setShowAddFaculty(false)
    setShowAddFacultyCard(false)
    setShowAssignRole(false)
    setShowCreatePanel(false)

  }


  const handleCreateExaminersPanel = () => {

    setShowCreatePanel(true);
  };


  const handleExaminerPanelClose = () => {

    setShowCreatePanel(false);
    setEditPanelData(null);
  };
  const handleSaveExaminerPanel = (data) => {

    // const Data = [...panelData, data]
    // setPaneldata(Data)
    console.log(data, "Form Dataaaaa")

    const department = data.department
    // const program = data.program
    const term = data.term
    const panelCode = data.panelCode
    const panelId = data.panelId
    const PanelMembers = data.panelMembers.map(mem => ({
      member: mem.value?._id || mem.value
    }))
    console.log("Temmmmmmmmmmm issues", term);
    const termIdPass = term;

    if (EditMode) {
      console.log("Inside Edit Mode checking term", termIdPass);
      console.log("Edit Mode Called for Updation");

      updatePanel(department, termIdPass, panelCode, PanelMembers, panelId);
    } else {
      createPanel(department, term, panelCode, PanelMembers)
    }
    fetchPanels()
  };
  const handleAddFacultyClick = (id) => {
    //console.log(panelCode, "code recieved");
    const filteredPanel = panelData.find(panel => panel._id === id)
    console.log(filteredPanel, "FilteredPanel")
    // setSelectedPanel(filteredPanel)
    const panelCode = filteredPanel.panelCode
    const panelID = filteredPanel._id
    if (filteredPanel) {
      const PanelData = {
        panelCode: panelCode,
        PanelMembers: filteredPanel.PanelMembers.map((member, index) => ({
          index: index + 1,
          name: member?.member,
          designation: member?.designation,
          examrole: member?.role,
          department: member?.department,
          _id: member?._id,
        })),
        _id: panelID
      };
      setSelectedPanel(PanelData);
    }
    setShowAddFaculty(true);
  }

  const handleAssignRoleClick = (panelId) => {
    const filteredPanel = panelData.find(panel => panel._id === panelId)
    setSelectedPaneltoAssignRole(panelId)
    const selectedMembers = filteredPanel.PanelMembers.map((member) => ({
      ...member
    }))
    setSelectedPanelMembers(selectedMembers)
    console.log(selectedPanelMembers);
    setShowAssignRole(true);
  }




  const handleViewPanelDetailsClick = (panelId) => {
    //console.log(panelCode, "code recieved");
    const filteredPanel = panelData.find(panel => panel._id === panelId)
    console.log(filteredPanel, "FilteredPanel")
    // setSelectedPanel(filteredPanel)
    const panelCode = filteredPanel.panelCode
    const panelID = filteredPanel._id
    if (filteredPanel) {
      const PanelData = {
        panelCode: panelCode,
        PanelMembers: filteredPanel.PanelMembers.map((member, index) => ({
          index: index + 1,
          name: member.member,
          designation: member.designation,
          examrole: member.role,
          department: member.department,
          _id: member._id,
        })),
        _id: panelID
      };
      setSelectedPanel(PanelData);
    }
    setShowAddFaculty(true);

  }





  const handleDeletePanelDetailsClick = async (panelId) => {
    console.log("Delete Panel Calleddddddddddddddddd");
    console.log("Panel", panelId);

    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/manageexampanels/deleteExamPanel/${panelId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        console.log("Panel deleted successfully");
        window.location.reload();
        // Handle any other actions after successful deletion
      } else {
        console.error("Failed to delete panel");
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error deleting panel:", error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);
    }
  };


  //have to do this
  //have to do this
  //have to do this
  //have to do this
  //have to do this

  const handleEditPanelDetailsClick = (panel) => {
    console.log("EDit panel Details func called its panelId is ", panel);
    console.log("Panel Data", panelData);

    const pData = panelData.find(pan => {
      console.log("pan._id:", pan._id);
      console.log("panel:", panel);
      return pan._id === panel;
    });

    console.log("Edit Panel Data", pData);

    if (pData) {
      setEditPanelData(pData); // Set panel data for editing
      setEditMode(true);
      setShowCreatePanel(true); // Show the panel creation card for editing
    }

    console.log("Get Panel From Id", pData);


  }






  const handleDeleteFacultyClickinAddFaculty = async (id) => {
    console.log("selectedPanelllllllllllllllID", selectedPanel._id);
    console.log("Member IDdddddddd", id);
    const panelId = selectedPanel._id;
    const facultyMemberId = id;
    // const newPanel = selectedPanel.panelMembers.filter(member => member._id !== id)
    // console.log(newPanel, "newPanel");
    // setSelectedPanel(newPanel)

    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/manageexampanels/panel/${panelId}/facultyMember/${facultyMemberId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        console.log("Panel Member Removed successfully");
        window.location.reload();
        // Handle any other actions after successful deletion
      } else {
        console.error("Failed to remove panel member");
        // Handle deletion failure
      }
    } catch (error) {
      console.error("Error removing panel member:", error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);
    }


  }



  //working on this
  //working on this
  //working on this
  //working on this

  const handleEditFacultyClickinAddFaculty = (id) => {
    const editfaculty = selectedPanel.find(member => member._id === id)

    setFacultytoEdit(editfaculty)

  }




  const handleSaveFacultyClick = (addedFaculty) => {
    console.log("Added Fac", addedFaculty)
    const member = addedFaculty.member
    AddFacultyTOPanel(selectedPanelToAddFaculty, member)
    fetchPanels();
    // const data = [selectedPanel, addedFaculty]
    // setSelectedPanel(data)

  }



  const handleAddFacultyClose = () => {


    setShowAddFacultyCard(false);

  }





  const handleAssignRoleClose = () => {


    setShowAssignRole(false);

  }


  const handleAddFacultyInsidePanel = (id) => {
    setSelectedPanel(id);
    setShowAddFacultyInsidePanel(true);
  }



  const handleAddFacultyClickinAddFaculty = (id) => {
    console.log(id, "IDDDDdddddddddddddddddddddddddd");
    setSelectedPanelToAddFaculty(id);
    setShowAddFacultyCard(true)
  }


  const handleassignRoleClick = (data) => {
    console.log(data, "assigned Role")
    const supervisorId = data._id
    const role = data.role
    RoleAssignment(supervisorId, role, selectedPaneltoAssignRole)

  }

  const handleFacAddClose = () => {
    setShowAddFacultyInsidePanel(false);
  }





  //APIS
  //APIS
  //APIS




  const fetchPrograms = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/auth/fetchProgramData`, {
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
      console.log(data, 'fetched Programs')
      const progrmData = data.programs.map((data, index) => ({
        value: data._id,
        index: index + 1,
        label: data.programTitle,
        ...data,

      }));
      setProgramsData(progrmData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/auth/fetchFacultyData`, {
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
      // Allow coordinators to be shown in the list
      const filteredData = data.faculties.filter(faculty => faculty.role !== 'hod');

      const progrmData = filteredData.map((faculty, index) => ({
        value: faculty._id,
        index: index + 1,
        label: faculty.name,
        department: faculty.department?.departmentName || "N/A",
        program: faculty.program,
        role: faculty.role?.toLowerCase(),
      }));

      console.log("Filtered ProgramDataaaaaaaaaaaaaa", progrmData);
      setFacultyData(progrmData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/auth/fetchDepartmentData`, {
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
      console.log(data, 'fetched Dept')
      const deptData = data.departments.map((data, index) => ({
        value: data._id,
        index: index + 1,
        label: data.departmentName,
        ...data,

      }));
      setDepartmentData(deptData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


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
      console.log(data, 'fetched Panelsssssssssss');
      const deptData = data?.panels.map((data, index) => ({

        index: index + 1,
        PanelMembers: data.PanelMembers.map(member => ({
          member: member?.member?.name,
          role: member?.role,
          department: member?.member?.department?.departmentName,
          designation: member?.member?.designation,
          _id: member?.member?._id
        })),
        term: data?.term?.sessionTerm,
        termId: data?.term?._id,
        department: data?.department,
        panelCode: data?.panelCode,
        _id: data._id,

        // ...data,

      }));
      setPaneldata(deptData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };



  const createPanel = async (department, term, panelCode, PanelMembers) => {
    console.log("Inside Create Panel");
    console.log("Department", department);
    // console.log("Program", program);
    console.log("Term in creation panel", term);
    console.log("panel code", panelCode);
    console.log("PanelMembers", PanelMembers);


    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      console.log("Checking department", department);
      // console.log("Checking program", program);
      console.log("Checking term", term);
      console.log("CHecking panelCode", panelCode);
      console.log("Checking PanelMembers", PanelMembers);

      const apiUrl = `/api/manageexampanels/create-penal`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          department, term, panelCode, PanelMembers
        }),
      });

      console.log("Request sentttttttttttttttttt for Panellllllllllllll");
      if (response.ok) {
        // Handle successful response
        console.log(' Panel Created successfully');
        window.location.reload();
      } else {
        console.log('Failed to Create {Panel} ');
      }
    }
    catch (error) {
      console.error('Error Creating Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }

  const updatePanel = async (department, termIdPass, panelCode, PanelMembers, panelId) => {
    console.log("Update Panel Calleddddddddddddddddddddddddddddddddddddddddd");
    console.log("Department", department);
    console.log("term", termIdPass);
    console.log("Panel Code", panelCode);
    console.log("PanelMembers", PanelMembers);
    console.log("PanelId", panelId);

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      console.log("Checking updated department", department);
      // console.log("Checking updated program", program);
      console.log("Checking updated term", termIdPass);
      console.log("CHecking updated panelCode", panelCode);
      console.log("Checking updated PanelMembers", PanelMembers);
      console.log("Checking Updated Panel Id", panelId);

      const apiUrl = `/api/manageexampanels/updatePanelData/${panelId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          department,
          term: termIdPass,
          panelCode,
          //  PanelMembers
          PanelMembers

        }),
      });

      console.log("Request sentttttttttttttttttt for updation Panellllllllllllll");
      if (response.ok) {

        console.log(' Panel Updated successfully');
        window.location.reload(true);
      } else {
        console.log('Failed to Update {Panel} ');
      }
    }
    catch (error) {
      console.error('Error Updating Panel: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }



  const AddFacultyTOPanel = async (panelId, member) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/manageexampanels/add-faculty-member`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panelId, member
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Panel Created successfully');
      } else {
        console.log('Failed to Create {Panel} ');
      }
    }
    catch (error) {
      console.error('Error Creating Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }


  const RoleAssignment = async (supervisorId, role, panelId) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/manageexampanels/assign-role`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supervisorId, role, panelId
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Panel Created successfully');

        window.location.reload();
      } else {
        console.log('Failed to Create {Panel} ');
      }
    }
    catch (error) {
      console.error('Error Creating Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }


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
      console.log("Data of termmmmmmmmmmmmm", dataofterm);
      setTermData(dataofterm);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };










  //APIS
  //APIS


  useEffect(() => {
    fetchPrograms();
    fetchDepartments();
    fetchFaculty();
    fetchTermData();
    fetchPanels();
  }, [])









  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodExaminerPanel';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);



  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full h-full'>
          <div className="mx-10 pt-12 flex flex-col gap-3">
            {!showAddFaculty && (<div className='grid grid-cols-1, grid-flow-col w-[21%]'>
              <div id="cardOneButton ">
                <CardOneButton title={"Create Examiner's Panel"} butText={"Create"} onClick={handleCreateExaminersPanel} />
              </div>
            </div>)}
            {showCreatePanel && (<div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>

              <CoodPanelCreationCard onclose={handleExaminerPanelClose} saveExaminerPanel={handleSaveExaminerPanel} Department={departmentData} Program={programsData} Term={termData} Faculty={faculty} panelDetails={editPanelData} editMode={EditMode} />

            </div>
            )}
            {/* {showEditPanel && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>

              <CoodPanelCreationCard onclose={handleExaminerPanelClose} saveExaminerPanel={handleSaveExaminerPanel} Department={departmentData} Program={programsData} Term={termData} Faculty={faculty} />

            </div>
            )} */}
            {!showAddFaculty && (<div classNa

              me='mt-5'>

              <CoodPanelDetails panelData={panelData}
                accordionId={1}
                addFacultyClick={handleAddFacultyInsidePanel}
                editPanelDetailsClick={handleEditPanelDetailsClick}
                deletePanelDetailsClick={handleDeletePanelDetailsClick}
                viewPanelDetailsClick={handleViewPanelDetailsClick}
                assignRoleClick={handleAssignRoleClick}
                terms={termData}

              />

            </div>)}

            {showAddFaculty && selectedPanel && (<div>

              <CoodAddFaculty panelData={selectedPanel}
                accordionId={2}
                deleteFacultyClick={handleDeleteFacultyClickinAddFaculty}
                editFacultyClick={handleEditFacultyClickinAddFaculty}
                handleAddFacultyClickinAddFaculty={handleAddFacultyClickinAddFaculty} />
            </div>)}

            {showAddFacultyInsidePanel && selectedPanel &&
              (<div>

                <AddFacultyInPanel panelData={panelData}
                  programsData={programsData}
                  facultyData={faculty}
                  onClose={handleFacAddClose}

                />
              </div>)}


            {showAddFacultyCard && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
              <CoodAddFacultyCard
                departmentOptions={departmentData}
                onclose={handleAddFacultyClose}
                saveFaculty={handleSaveFacultyClick}
                facultyData={faculty}
              //facultytoEdit = {facultytoEdit}

              />
            </div>)}
            {showAssignRole && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
              <CoodAssignRoleCard
                panelData={selectedPanelMembers}
                onclose={handleAssignRoleClose}
                saveRoleAssignment={handleassignRoleClick}

              />
            </div>)}
            {showAddFaculty && (<div className='flex flex-row justify-end  mt-5'>
              <ButbgPrimary text="Back" onClick={handleGoBack} />
            </div>)}
          </div>
        </div>
      )}
    </>
  );
};

export default CoodExaminerPanel;
