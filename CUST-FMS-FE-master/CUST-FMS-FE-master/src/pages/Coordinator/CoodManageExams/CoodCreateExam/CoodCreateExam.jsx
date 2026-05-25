import React, { useState, useEffect } from 'react'
import CardOneButton from '../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite, } from 'flowbite';
import CoodExamCreation from './CoodExamCreation';
import CoodAddedExamTable from './CoodAddedExamTable'
import CoodAssignClo from './CoodAssignClo';
import CoodAssignQuestions from './CoodAssignQuestions';
import CoodQuestionDescription from './CoodQuestionDescription'
import CoodCreateExamSchedule from './CoodCreateExamSchedule';
import ButbgPrimary from '../../../../Components/Buttons/ButbgPrimary';
import CoodManagePassFailCriteria from './CoodManagePassFailCriteria';
import CoodPassFailCriteriaTable from './CoodPassFailCriteriaTable';


const optionsData = {
  departments: [
    { value: 'SE', label: 'BSSE' },
    { value: 'CS', label: 'BSCS' },
  ],
  clos: [
    { value: 'CLO1', label: 'CLO 1' },
    { value: 'CLO2', label: 'CLO 2' },
  ],
  questions: [
    { value: 'Q1', label: 'Q 1', question: "ANYQUES", marks: 10, shortCode: "Q1" },
    { value: 'Q2', label: 'Q 2', question: "ANYQUES", marks: 10, shortCode: "Q2" },
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
  examType: [
    { value: 'Final-I', label: 'Final-I' },
    { value: 'Orientation', label: 'Orientation' },
    { value: 'Mid-I', label: 'Mid-I' }
  ],
  faculty: [
    { name: 'MMALAM', program: 'BSSE', _id: '5453454w523', designation: 'lecturer', examrole: 'Panel Head', department: 'SE' },
    { name: 'AKS', program: 'BSSE', _id: 'dferg', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
    { name: 'FKS', program: 'BSCS', _id: 'fdhgrt', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
    { name: 'ARS', program: 'BSSE', _id: 'werugtr', designation: 'lecturer', examrole: 'Examiner', department: 'SE' },
  ]
};






const CoodCreateExam = () => {


  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showAssignCLO, setShowAssignCLO] = useState(false);
  const [showAssignQuestions, setShowAssignQuestions] = useState(false);
  const [showScheduleCreation, setShowScheduleCreation] = useState(false);
  const [showDescriptionCard, setShowDescriptionCard] = useState(false);
  const [termData, setTermData] = useState([]);
  const [examTypeData, setExamTypeData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [examCloData, setexamCloData] = useState([]);
  const [selectedExamForCLOAssignment, setSelectedExamforCLOAssignment] = useState(null);
  const [selectedExamForScheduleCreation, setSelectedExamforScheduleCreation] = useState(null);
  const [examScheduleData, setExamScheduledata] = useState([]);
  const [termOfExam, setTermOfExam] = useState('');
  const [examNameForScheduleFiltering, setExamNameForScheduleFiltering] = useState('');
  const [showPassFailCriteria, setShowPassFailCriteria] = useState(false);
  const [passFailCriteriaData, setPassFailCriteriaData] = useState([]);
  const [selectedCriteriaForEdit, setSelectedCriteriaForEdit] = useState(null);
  const [departmentPrograms, setDepartmentPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);


  const handleGoBack = () => {
    setShowCreateExam(false);
    setShowAssignCLO(false);
    setShowAssignQuestions(false);
    setShowScheduleCreation(false);
    setShowDescriptionCard(false);
    setShowPassFailCriteria(false);
  }


  console.log("Scheduleeeeeeeeeeee Data in parenttttttttttt", examScheduleData);

  const handleCreatExam = () => {

    setShowCreateExam(true);

  }
  const handleCloAssignment = (id) => {
    console.log("Checking Selecteddddddddd Exam to assign CLO", id);
    setSelectedExamforCLOAssignment(id)
    console.log("State Checking ", selectedExamForCLOAssignment);
    setShowAssignCLO(true)


  }
  const handleScheduleCreation = (term) => {
    console.log("Termmmmmmmmmm Cick on Schedule", term);
    setSelectedExamforScheduleCreation(term?._id)
    setTermOfExam(term?.Term?.sessionTerm || 'N/A')
    setExamNameForScheduleFiltering(term?.ExamType?.examName || 'N/A');
    setShowScheduleCreation(true)


  }
  const handleScheduleCreationCLose = () => {
    setShowScheduleCreation(false)


  }

  const handleCloseCLOAssignment = () => {

    setShowAssignCLO(false)

  }
  const handleCloseQuestionAssignment = () => {

    setShowAssignQuestions(false)

  }

  const handleCloseExamCreation = () => {

    setShowCreateExam(false)

  }
  const handleSaveCLOAssignment = (assignedClo) => {
    console.log(assignedClo, "Assigned CLO")
    console.log("SelectedExamIddddddddddddddddddddd", selectedExamForCLOAssignment);
    AssignCLOtoExam(selectedExamForCLOAssignment, assignedClo)
    // setShowAssignQuestions(true)


  }

  const fetchExamSchedule = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ScheduleExamRoutes/getting-scheduled-exams`, {
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
      console.log(data, 'fetched Exams Schedule')

      const deptData = data.exams.map((examData, index) => {
        const newDate = convertToNormalDateFormat(examData.ExamDate);
        return {
          index: index + 1,

          ExamId: examData?.CreatedExam?._id,

        };
      });
      console.log("Depttttttttttttt Data", deptData);

      setExamScheduledata(deptData);
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
      const activeTerms = data.fypTerms.filter(term => term.status === 'activated');
      const dataofterm = activeTerms.map((term, index) => ({
        ...term,
        label: term.sessionTerm,
        value: term?._id,
      }))
      setTermData(dataofterm);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
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
        value: data?._id,
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


  const fetchExamData = async () => {

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ExamCreationRoutes/getting-exams`, {
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

      // const exmData = data.exams.map((data, index) => {
      //   const newAnnouncedDate = convertToNormalDateFormat(data.AnnouncedDate);
      //   const newDeadline = convertToNormalDateFormat(data.ReportDeadline);
      //   return {
      //     index: index + 1,
      //     ExamType: data.ExamType.examName,
      //     Term: data.Term.sessionTerm,
      //     AnnouncedDate: newAnnouncedDate,
      //     ReportDeadline: newDeadline,
      //     ExamWeightage: data.ExamWeightage,
      //     _id: data._id
      //   };
      // });
      const activeExams = data.exams.filter(exam => exam.Term && exam.Term.status === 'activated');
      setExamData(activeExams);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  }




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
      console.log(data, 'fetchedddddddddddddddd Exam CLOsssssssssssss');
      const cloData = data.CLOsForExam.map((data, index) => ({
        index: index + 1,
        label: data.shortCode,
        value: data?._id,
        // exam: data.selectExam.examName,
        Program: data.program.programTitle,
        ...data,

      }));

      console.log("Checking Fetch Exam CLO'sssssssssssssssssss", cloData);
      setexamCloData(cloData);
    } catch (error) {
      console.error('Error in fetching Exam CLOs :', error.message);
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
        throw new Error('Failed to fetch Department Data');
      }
      const data = await response.json();
      const mapped = data.departments.map(dept => ({
        label: dept.departmentName,
        value: dept._id
      }));
      setDepartments(mapped);
    } catch (error) {
      console.error('Error fetching departments:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const fetchDepartmentPrograms = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const coordDeptId = user?.department?._id || user?.department;

      const response = await fetch(`/api/auth/fetchProgramData`, {
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

      const allProgs = data.programs.map(p => ({
        label: p.programTitle,
        value: p._id,
        department: p.department?._id || p.department
      }));
      setAllPrograms(allProgs);

      const filtered = data.programs
        .filter(p => {
          const deptId = p.department?._id || p.department;
          return String(deptId) === String(coordDeptId);
        })
        .map(p => ({
          label: p.programTitle,
          value: p._id
        }));

      setDepartmentPrograms(filtered);
    } catch (error) {
      console.error('Error fetching department programs:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    fetchTermData()
    fetchExamTypes()
    fetchExamData()
    fetchExamCLOs()
    fetchExamSchedule()
    fetchPassFailCriteria()
    fetchDepartmentPrograms()
    fetchDepartments()
    //handleDeleteExam()
  }, [])


  const handleStatusUpdate = async (examId, newStatus) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(`/api/ExamCreationRoutes/updateStatus/${examId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log('Status updated successfully:', data);
      await fetchExamData(); // Refresh table
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Error updating status: ' + error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const handleDeleteExam = async (id) => {
    try {
      console.log("Delete Exam idddddddddddddddddddddddddddd", id);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const examId = id;
      const response = await fetch(`/api/ExamCreationRoutes/deletePartExam/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ examId: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }
      const data = await response.json();
      console.log(data, 'Exam deleted successfully');
      window.location.reload(true);
    } catch (error) {
      console.error('Error deleting exam:', error.message);
    }
  };

  // Pass/Fail Criteria Management Functions
  const fetchPassFailCriteria = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/PassFailCriteria/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pass/fail criteria');
      }
      const data = await response.json();
      console.log('Fetched Pass/Fail Criteria:', data);
      setPassFailCriteriaData(data.criteria);
    } catch (error) {
      console.error('Error fetching pass/fail criteria:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleManagePassFailCriteria = () => {
    setSelectedCriteriaForEdit(null);
    setShowPassFailCriteria(true);
  };

  const handleEditCriteria = (criteria) => {
    setSelectedCriteriaForEdit(criteria);
    setShowPassFailCriteria(true);
  };

  const handleSavePassFailCriteria = async (criteriaData) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      let apiUrl, method;
      if (criteriaData._id) {
        // Update existing criteria
        apiUrl = `/api/PassFailCriteria/update/${criteriaData._id}`;
        method = 'PATCH';
      } else {
        // Create new criteria
        apiUrl = `/api/PassFailCriteria/create`;
        method = 'POST';
      }

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          term: criteriaData.term,
          passingCriteria: criteriaData.passingCriteria
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save pass/fail criteria');
      }

      const data = await response.json();
      console.log('Pass/Fail criteria saved successfully:', data);

      // Refresh the criteria list
      await fetchPassFailCriteria();
      setShowPassFailCriteria(false);
      setSelectedCriteriaForEdit(null);
    } catch (error) {
      console.error('Error saving pass/fail criteria:', error.message);
      alert(error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleClosePassFailCriteria = () => {
    setShowPassFailCriteria(false);
    setSelectedCriteriaForEdit(null);
  };














  const handleCloseDescription = () => {

    setShowDescriptionCard(false)

  }
  const handleSaveDescription = (desc) => {
    console.log(desc, "Description")



  }









  const handleSaveQuestionAssignment = (assignedClo) => {
    console.log(assignedClo, "Assigned CLO")
    setShowDescriptionCard(true);


  }

  const handleSaveExamCreation = (data) => {
    console.log("Parent received exam data:", data);
    const newData = [...examData, data]
    fetchExamData();
    //setExamData(newData)
    const Term = data.Term
    const ExamType = data.ExamType
    const ExamWeightage = data.ExamWeightage
    const AnnouncedDate = data.AnnouncedDate
    const ReportDeadline = data.ReportDeadline
    const portalCategory = data.portalCategory
    const partStatus = data.partStatus
    const program = data.program
    const department = data.department
    console.log(data, "examData")
    createExam(Term, ExamType, ExamWeightage, AnnouncedDate, ReportDeadline, portalCategory, partStatus, program, department)
  }





  const AssignCLOtoExam = async (examId, cloForExamId) => {
    console.log("Inside CLO TO Exam APi Calling");
    console.log("ExamId", examId);
    console.log("cloForExamId", cloForExamId);

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ExamCreationRoutes/assign-clo-for-exam`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId, cloForExamId
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Exam Created successfully');
        window.location.reload(true);
      } else {
        console.log('Failed to Create Exam ');
      }
    }
    catch (error) {
      console.error('Error Creating Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }

  const createExam = async (Term, ExamType, ExamWeightage, AnnouncedDate, ReportDeadline, portalCategory, partStatus, program, department) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing

      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ExamCreationRoutes/create-exam`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Term, ExamType, ExamWeightage, AnnouncedDate, ReportDeadline, portalCategory, partStatus, program, department
        }),
      });
      if (response.ok) {
        // Handle successful response
        window.location.reload();
        console.log(' Exam Created successfully');
      } else {
        const errorData = await response.json();
        console.log('Failed to Create Exam:', errorData);
        alert(`Failed to Create Exam: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    }
    catch (error) {
      console.error('Error Creating Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }





  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCreateExam';
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

            {!showScheduleCreation && (
              <div className='grid grid-cols-2 gap-4 w-[45%]'>
                <div id="cardOneButton">
                  <CardOneButton title={"Create Exam"} butText={"Create"} onClick={handleCreatExam} />
                </div>
                <div id="cardPassFailCriteria">
                  <CardOneButton title={"Manage Pass/Fail Criteria"} butText={"Manage"} onClick={handleManagePassFailCriteria} />
                </div>
              </div>
            )}



            {examData && !showScheduleCreation && (<div className='mt-5'>

              <CoodAddedExamTable data={examData}
                handleScheduleCreation={handleScheduleCreation}
                handleCloAssignment={handleCloAssignment}
                handleDeleteExam={handleDeleteExam}
                handleStatusUpdate={handleStatusUpdate}
                scheduleData={examScheduleData}
                accordionId={1} />

            </div>)}

            {/* Pass/Fail Criteria Table */}
            {passFailCriteriaData && !showScheduleCreation && (
              <div className='mt-5'>
                <CoodPassFailCriteriaTable
                  data={passFailCriteriaData}
                  onEdit={handleEditCriteria}
                />
              </div>
            )}


            {showScheduleCreation && (<div>
              <CoodCreateExamSchedule idofExam={selectedExamForScheduleCreation} termOfExam={termOfExam} ExamName={examNameForScheduleFiltering} />
            </div>)}





            {showCreateExam && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>


              <CoodExamCreation
                onclose={handleCloseExamCreation}
                saveExamClick={handleSaveExamCreation}
                //dataToEdit={examCloDataToEdit}
                termData={termData}
                examTypes={examTypeData}
                departmentData={departments}
                programOptions={allPrograms}
              />


            </div>)}
            {showAssignCLO && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>


              <CoodAssignClo
                onclose={handleCloseCLOAssignment}
                saveCLOAssignment={handleSaveCLOAssignment}
                // dataToEdit={examCloDataToEdit}
                optionsData={examCloData}
              />


            </div>)}

            {showAssignQuestions && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>


              <CoodAssignQuestions
                onclose={handleCloseQuestionAssignment}
                saveCLOAssignment={handleSaveQuestionAssignment}
                //dataToEdit={examCloDataToEdit}
                optionsData={optionsData}
              />


            </div>)}
            {showDescriptionCard && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>


              <CoodQuestionDescription
                onclose={handleCloseDescription}
                saveCLOAssignment={handleSaveDescription}
              //dataToEdit={examCloDataToEdit}
              //optionsData={optionsData}
              />


            </div>)}
            {showPassFailCriteria && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <CoodManagePassFailCriteria
                  onClose={handleClosePassFailCriteria}
                  onSave={handleSavePassFailCriteria}
                  termData={termData}
                  existingData={selectedCriteriaForEdit}
                />
              </div>
            )}
            {showScheduleCreation && (
              <div className='flex flex-row justify-end  mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBack} />
              </div>
            )}
          </div>
        </div>
      )}
    </>)
}
export default CoodCreateExam
