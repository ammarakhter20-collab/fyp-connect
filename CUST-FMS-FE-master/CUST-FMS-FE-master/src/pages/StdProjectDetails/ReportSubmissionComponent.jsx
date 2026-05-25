import React, { useEffect, useState } from 'react';
import GenAccor from '../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';

const ReportSubmissionComponent = ({ accordionId, onGoBack, createdExam, ReportInst, rejectionFeedback, currentIndex = 1, totalExams = 1 }) => {
  const [ExamType, setExamType] = useState('');
 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fypData, setFypData] = useState(null);

  useEffect(() => {
    // Fetch FypData from local storage
    const fetchedFypData = JSON.parse(localStorage.getItem('FYPData'));
    setFypData(fetchedFypData);
  }, []);

useEffect(() => {
  console.log("Checking Exam Type", createdExam?.ExamType);
  if (createdExam?.ExamType?._id) {
    setExamType(createdExam.ExamType._id);
  }
}, [createdExam]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  
  // useEffect(() => {
  //   fetchCreatedExamReport();
  // }, []);

  

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Handle form submission logic here
//     console.log('Submitted:', { fypTitle, examName, dueDate, selectedFile });
//     console.log("checking submitted file", selectedFile);
//     const user = JSON.parse(localStorage.getItem('user'))
//     const userId = user._id;
//     const fyp = JSON.parse(localStorage.getItem('FYPData'))
//     const fypId = fyp._id;
//     console.log("Checking FYP Group ID", fypId);
//     console.log("Checking user Id", userId);
//     const formData = new FormData();
//     formData.append('submitReportPdf', selectedFile);
//     console.log("Checking submitPdf inside handle submit", selectedFile);
//     formData.append('SubmittedBy', userId);
//     formData.append('FYPGroup', fypData._id);
//     formData.append('Exam', ExamType);
//     formData.append('FYPGroup', fypId);

//     try {
//       setIsLoading(true);
//       const token = JSON.parse(localStorage.getItem('key'));

//       // Send POST request to updateTaskAssignment endpoint with the uploaded file
//       const response = await axios.post('/api/StudentReport/UploadStudReport', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}` // Assuming 'token' is defined
//         }
//       });

//       // console.log("Checking responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", response);

//       // console.log('File upload response:', response);

//       // Handle success response
//       // For example, you can display a success message to the user
//       if(response.status === 201){
//          console.log("Yes Report Submitted Successfully");
//         ReportInst();
          
//       }
//     } catch (error) {
//       // Handle error
//       console.error('Error uploading file:', error);
//       // Display an error message to the user
//       alert('Error uploading Report.');
//     } finally {
//       setIsLoading(false);
    
//   };
// }
//   console.log("Checking Created Exam", createdExam);

const checkReportExist = async (groupId, examId) => {
  try {
    const token = JSON.parse(localStorage.getItem('key'));
    const response = await axios.get(`/api/StudentReport/reports/check/${groupId}/${examId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.exists;
  } catch (error) {
    console.error('Error checking report existence:', error);
    return false;
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  console.log('Submitted:', { selectedFile });
  console.log("Checking submitted file", selectedFile);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user._id;
  const fyp = JSON.parse(localStorage.getItem('FYPData'));
  const fypId = fyp._id;
  console.log("Checking FYP Group ID", fypId);
  console.log("Checking user Id", userId);
  const formData = new FormData();
  formData.append('submitReportPdf', selectedFile);
  console.log("Checking submitPdf inside handle submit", selectedFile);
  formData.append('SubmittedBy', userId);
  formData.append('FYPGroup', fypData._id);
  formData.append('Exam', ExamType);

  try {
    setIsLoading(true);
    const token = JSON.parse(localStorage.getItem('key'));

    const reportExists = await checkReportExist(fypId, ExamType);
    if (reportExists) {
      console.log('Report already exists, overwriting...');
      // If the report exists, update it
      const response = await axios.put('/api/StudentReport/UpdateStudReport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log("Yes Report Updated Successfully");
        ReportInst();
      }
    } else {
      // If the report does not exist, create a new one
      const response = await axios.post('/api/StudentReport/UploadStudReport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        console.log("Yes Report Submitted Successfully");
        ReportInst();
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading Report.');
  } finally {
    setIsLoading(false);
    // Don't reload — let the parent component handle queue advancement via ReportInst()
  }
};

console.log("Checking Created Exam", createdExam);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='mx-16 mt-10'>
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className={`mt-14 `}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text={totalExams > 1 ? `Report Submission (${currentIndex} of ${totalExams})` : "Report Submission"} accordionId={accordionId} />
            </h2>

            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
               
                <div className="table-container overflow-x-auto relative">
                  <div className='bg-white text-sm'>
                    <form onSubmit={handleSubmit}>
                      {/* Rejection feedback banner */}
                      {rejectionFeedback && (
                        <div className="mx-5 mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                          <p className="font-semibold text-red-700 text-sm">⚠ Report Denied by Supervisor</p>
                          <p className="text-red-600 text-sm mt-1">{rejectionFeedback}</p>
                          <p className="text-gray-500 text-xs mt-1">Please fix the issues above and resubmit your report.</p>
                        </div>
                      )}
                      <div className='mx-5 pt-5'>
                        <div className='flex flex-row gap-3'>
                          <p className='text-base font-semibold mt'>FYP Title: </p>
                          <p className='text-base'> {fypData && fypData.topicData.topic} </p>
                        </div>
                        <div className='flex flex-row gap-3 mt-2'>
                          <p className='text-base font-semibold '>Exam Name:  </p>
                          <p className='text-base'>{createdExam?.ExamType?.examName || 'Loading...'}</p>
                        </div>
                        <div className='flex flex-row gap-3 mt-2'>
                          <p className='text-base font-semibold'>Due Date:  </p>
                          <p className='text-base '>{createdExam?.ReportDeadline ? formatDate(createdExam.ReportDeadline) : 'Not set'}</p>
                        </div>
                      </div>

                      <div className='mx-5 pt-2'>
                        <label className="block mb-2 text-base text-gray-700 font-semibold">
                          Choose File:
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="w-96 p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className='flex flex-row justify-end mt-5 pb-5 mx-5'>
                        <button type="submit" className="bg-primary hover:bg-secondary text-white py-3 px-10 rounded">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportSubmissionComponent;
