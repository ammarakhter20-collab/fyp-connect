import React, { useState, useEffect } from 'react'
import CardOneButton from '../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import CoodCreateExamCard from './CoodCreateExamTypeCard'
import CoodExamTypeDetailsTable from './CoodExamTypeDetailsTable';
import { initFlowbite, } from 'flowbite';
import ButbgPrimary from '../../../../Components/Buttons/ButbgPrimary';


const CoodCreateExamType = () => {




  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCreateExamCard, setShowCreateExamCard] = useState(false);
  const [examData, setExamData] = useState([]);
  const [examDataToEdit, setExamDataToEdit] = useState(null);




  const handleCreateExamType = () => {

    setShowCreateExamCard(true)

  }
  const handleCreateExamCardClose = () => {

    setShowCreateExamCard(false)

  }
  const handleSaveExam = async (examData1) => {

    const newExamData = [...examData, examData1]
    console.log(examData1, "examData")
    await setExamData(newExamData);

const examName = examData1.examName;
const shortCode = examData1.shortCode;
const examTypeFor = examData1.examTypeFor;
createExamType(examName, shortCode, examTypeFor)


  }
  const handleEditClick = (id) => {
    // const datatoedit = examData.find(exam => (exam._id === id))
    // setExamDataToEdit(datatoedit)
    // setShowCreateExamCard(true);

    // console.log( "iiiiiiiiid")
    
    
  }
  const handleDeleteClick = (id) => {
    const newList = examData.filter(exams => (exams._id !== id))
    deleteExamType(id);
    setExamData(newList);
    
    console.log( "idddddddddddddddddddddd")

  }





  const createExamType = async (examName, shortCode, examTypeFor) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;

      const apiUrl = `/api/ExamType/CreateExamType`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examName, shortCode, examTypeFor
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Exam Type Created successfully');
      } else {
        console.log('Failed to Create Exam Type ');
      }
    }
    catch (error) {
      console.error('Error Marking :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
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
      console.log(data, 'fetched Exam Data')
      const exmData = data.examTypes.map((data,index) => ({
        _id: data._id,
        index: index+1,
        ...data,
       
      }));
      setExamData(exmData);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };
  const deleteExamType = async (id) => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ExamType/deleteExamType/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete Exam Type');
      }
      const data = await response.json();
      console.log(data, 'Deleted Exam Data');
      // After deleting the exam type, you might want to fetch and update the exam types list.
      fetchExamTypes();
    } catch (error) {
      console.error('Error deleting Exam Type:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  useEffect(() => {
    fetchExamTypes();
  }, [])








  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCreateExamType';
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
              <div id="cardOneButton z-50">
                <CardOneButton title={"Create Exam Type"} butText={"Create"} onClick={handleCreateExamType} />
              </div>
            </div>)}



            {showCreateExamCard && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>


              <CoodCreateExamCard
                onclose={handleCreateExamCardClose}
                saveExamClick={handleSaveExam}
                dataToEdit={examDataToEdit}


              />






            </div>)}


            {examData && (<div className='mt-5'>


              <CoodExamTypeDetailsTable
                data={examData}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
                accordionId={1}

              />
            </div>)}












          </div></div>
      )
      }
    </>
  )
}

export default CoodCreateExamType
