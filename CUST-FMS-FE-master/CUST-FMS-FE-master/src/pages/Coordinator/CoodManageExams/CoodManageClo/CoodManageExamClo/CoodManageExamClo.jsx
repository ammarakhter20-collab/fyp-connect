import React, { useState, useEffect } from 'react'
import CardOneButton from '../../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite, } from 'flowbite';
import ButbgPrimary from '../../../../../Components/Buttons/ButbgPrimary';
import CoodCreateCloforExamCard from './CoodCreateCloforExamCard';
import CoodExamCloDetails from './CoodExamCloDetails';
import AssignCLOs from './AssignCLOs';
import CoodAddedCLOstoExamTable from './CoodAddedCLOstoExamTable';
import CoodViewCLO from './CoodViewCLO';


const CoodManageClo = () => {


  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCreateExamCloCard, setshowCreateExamCloCard] = useState(false);
  const [showAssignCLOs, setShowAssignCLOs] = useState(false);
  const [showAssignQuestions, setShowAssignQuestions] = useState(false);
  const [showAddClo, setShowAddClo] = useState(false);
  const [showClodetails, setShowCloDetails] = useState(false);
  const [examCloData, setexamCloData] = useState([]);
  const [examTypeData, setExamTypeData] = useState([]);
  const [CloData, setCloData] = useState([]);
  const [programsData, setProgramsData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [closofSelectedCLO, setclosofSelectedCLO] = useState([]);
  const [examCloDataToEdit, setexamCloDataToEdit] = useState(null);
  const [selectedExamCLOtoAddCLO, setSelectedExamCLOtoAddCLO] = useState(null);
  const [selectedCLOCODE, setselectedCLOCODE] = useState(null);
  const [selectedCLO, setSelectedCLO] = useState(null);
  const [CLOForExamID , setCLOForExamID] = useState('');





  const handleCreateClo = () => {

    setshowCreateExamCloCard(true)

  }
  const handleCreateCloCardClose = () => {

    setshowCreateExamCloCard(false)

  }
  const handleSaveClo = async (clo1) => {
    console.log(clo1, "clo1")
    const newexamCloData = [...examCloData, clo1]
    // await setexamCloData(newexamCloData);
    //shortCode, program, selectExam

    const selectExam = clo1.exam
    // examTypeData.find(data => data._id === clo1.exam)?.examName
    const program = clo1.program
   // programsData.find(data => data._id === clo1.program)?.programTitle
    const shortCode = clo1.shortCode
    CreateExamCLO(shortCode, program, selectExam)
    fetchExamCLOs();


  }
  const handleEditClick = (id) => {
    const datatoedit = examCloData.find(exam => (exam._id === id))
    setexamCloDataToEdit(datatoedit)
    setshowCreateExamCloCard(true);

    console.log("iiiiiiiiid")


  }
  const handleDeleteClick = (id) => {
    const newList = examCloData.filter(exams => (exams.id !== id))
    setexamCloData(newList);

    console.log("idddddddddddddddddddddd")

  }












  const handelViewDetailsofExamClo = (id) => {
    console.log("ExamCLOData", examCloData)
    console.log("CLO For ExamID", id);
    setCLOForExamID(id);
    const exam = examCloData.find(exm => exm._id === id)
    const clocode = exam.shortCode
    setselectedCLOCODE(clocode)
    const CLOs = exam.CLOs.map((clos, index) => ({
      ...clos,
      index: index+1,

    }));
    setclosofSelectedCLO(CLOs);
    // const examQuestions = exam.map
    console.log("ExamCLOData", exam)

  }




















  const handleAddClotoExamClo = (id) => {
    setSelectedExamCLOtoAddCLO(id)
    setShowAssignCLOs(true)}


  const handleSaveAddedClos = async (data) => {
    const Program = programsData.find(data => data._id === data.program)?.programTitle
    await CreateCLOs(data.clo, data.title, Program,)
    fetchCLOs()



    const newData = [...CloData, data]
    // setCloData(newData);

    console.log(data, "added CLOs")
  }



  const handleCloseAddedClo = () => {
    setShowAddClo(false)
  }



  const handleViewDetailsClick = () => {

  }
  const handleAssignCLOClose = () => {
    setShowAssignCLOs(false);

  }
  const handleAssignCLOs = async(cloIds) => {
    console.log(cloIds, 'assignedCLOS')
    await AssignCLOtoEXAMCLO(selectedExamCLOtoAddCLO, cloIds)
    fetchExamCLOs()

  }
  const handleAssignQuestionClick = (id) => {
    setShowAssignQuestions(true)

  }


  
  const AssignCLOtoEXAMCLO = async ( cloForExamId, cloIds) => {

    try {
        setLoadingSpinner(true); // Show loading spinner while processing
        const userData = localStorage.getItem('user');
        // const parsedUserData = JSON.parse(userData);
        // const userid = parsedUserData._id;

        const apiUrl = `/api/ManageCLOForExam/add-clos-In-Exam`;
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);

        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              cloForExamId, cloIds
            }),
        });
        if (response.ok) {
            // Handle successful response
            console.log(' ExamCLo Created successfully');
        } else {
            console.log('Failed to Create ExamCLo ');
        }
    }
    catch (error) {
        console.error('Error creating ExamCLo :', error);
        // Handle network errors or other exceptions
    } finally {
        setLoadingSpinner(false); // Hide loading spinner after processing
    }
}

const handleQuestionDescClose = () => {
  setShowCloDetails(false)
}










  const fetchExamTypes = async () => {
    try {
      setLoadingSpinner(true);
       const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ExamType/GetCreatedExamType`, {
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
      console.log(data, 'fetched Exam Types')
      const exmTypesData = data.examTypes.map((data, index) => ({
        value: data._id,
        index: index + 1,
        label: data.examName,
        ...data,

      }));
      setExamTypeData(exmTypesData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };






  const fetchCLOs = async () => {
    try {
      setLoadingSpinner(true);
       const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ManageCLOs/getAllClos`, {
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
      console.log(data, 'fetched CLOs')
      const cloData = data.CLOs.map((data, index) => ({
        index: index + 1,
        ...data,

      }));
      setCloData(cloData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };






  
  const fetchExamCLOs = async () => {
    try {
      setLoadingSpinner(true);
       const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ManageCLOForExam/gettingAllClOForExam`, {
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
      console.log(data, 'fetched Exam CLOs')
      const cloData = data.CLOsForExam.map((data, index) => ({
        index: index + 1,
        // exam: data.selectExam.examName,
        Program: data?.program?.programTitle,
        ...data,

      }));

      console.log("Checking CLO Dataaaaaaaaaaaaaa", cloData);
      setexamCloData(cloData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };







  const CreateExamCLO = async (shortCode, program, selectExam) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ManageCLOForExam/createCLOForExam`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shortCode, program, selectExam
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' ExamCLo Created successfully');
      } else {
        console.log('Failed to Create ExamCLo ');
      }
    }
    catch (error) {
      console.error('Error creating ExamCLo :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }





  const CreateCLOs = async (CLOCode, Title, Program) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ManageCLOs/CreateCLO`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          CLOCode, Title, Program
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' ExamCLo Created successfully');
      } else {
        console.log('Failed to Create ExamCLo ');
      }
    }
    catch (error) {
      console.error('Error creating ExamCLo :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }







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

  const fetchDepartments = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/auth/fetchDepartmentData`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Departments');
      }
      const data = await response.json();
      console.log(data, 'fetched Departments');
      const deptData = data.departments.map((dept, index) => ({
        value: dept._id,
        label: dept.departmentName,
        ...dept,
      }));
      setDepartmentsData(deptData);
    } catch (error) {
      console.error('Error fetching Departments:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleDeleteClickinCLOTable = async (id) => {
        console.log("Deleting CLO For Exam", id)
        try {
          setLoadingSpinner(true);
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
          const apiUrl = `/api/ManageCLOForExam/removeAssignedCLO`;
      
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
               cloForExamIdToRemove: CLOForExamID,
               cloIdToRemove: id,

              }),
          });
      
          if (response.ok) {
              console.log('CLO Removed from examCLO successfully');
              window.location.reload();
          } else {
              console.log('Failed to remove CLO in Exam');
          }
      } catch (error) {
          console.error('Error removing CLO:', error);
      } finally {
          setLoadingSpinner(false);
      }
      
  }

  const handleDelCLO = async (id) => {
    console.log("Checking CLO FOR Exam Deletionnnnnnnnnnnnnnnnnnnnn iddddddddddd", id);
    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ManageCLOForExam/deleteCLOForExam/${id}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
   
      });
      if (response.ok) {
        // Handle successful response
        console.log(' ExamCLo Deleted successfully');
        window.location.reload(true);
      } else {
        console.log('Failed to Delete ExamCLo ');
      }
    }
    catch (error) {
      console.error('Error deleting ExamCLo :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  


    
  }
  const handleDetailsClickinCLOTable = async (id) => {
      const selectedClo = closofSelectedCLO.find(clo => (clo._id === id))
     await setSelectedCLO(selectedClo);
      setShowCloDetails(true)



  }


  useEffect(() => {
    fetchExamTypes();
    fetchDepartments();
    fetchPrograms();
    fetchCLOs();
    fetchExamCLOs();
  }, [])



  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodManageExamClo';
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
            {(<div className='grid grid-cols-1, grid-flow-col w-[21%]'>
              <div id="cardOneButton ">
                <CardOneButton title={"Create CLOs"} butText={"Create"} onClick={handleCreateClo} />
              </div>
            </div>)}



            {showCreateExamCloCard && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>


              <CoodCreateCloforExamCard
                onclose={handleCreateCloCardClose}
                saveExamClick={handleSaveClo}
                dataToEdit={examCloDataToEdit}
                examTypes={examTypeData}
                programs={programsData}
                departments={departmentsData}
              />


            </div>)}

            {examCloData && (<div className=''>


              <CoodExamCloDetails
                data={examCloData}
                handleAddClotoExamClo={handleAddClotoExamClo}
                handelViewDetailsofExamClo={handelViewDetailsofExamClo}
                handleDelCLO = {handleDelCLO}
                accordionId={1}




              />



            </div>)}




            {showAssignCLOs && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                            <AssignCLOs
                                onClose={handleAssignCLOClose}
                                //dataToEdit={examCloDataToEdit}
                                //optionsData={optionsData}

                                CLOs = {CloData} handleAssignCLOs = {handleAssignCLOs}  
                            />
                        </div>)}




                        {closofSelectedCLO.length > 0 && (<div>
                            <CoodAddedCLOstoExamTable
                                data={closofSelectedCLO} selectedCLO={selectedCLOCODE} handleDetailsClick={handleDetailsClickinCLOTable} handleDeleteClick={handleDeleteClickinCLOTable}
                            />

                        </div>)}

                        {showClodetails && selectedCLO && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                            <CoodViewCLO 
                            question = {selectedCLO}
                            onclose ={handleQuestionDescClose}
                            />

                        </div>)}














          </div></div>
      )
      }
    </>
  )
}

export default CoodManageClo
