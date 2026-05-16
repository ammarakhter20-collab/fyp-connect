import React, { useState, useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';



const CoodEvaluationStatuses = ({ accordionId }) => {
  const [showCheckStatus, setShowCheckStatus] = useState(false);
  const [showEvaluationStatusofAll, setShowEvaluationStatusofAll] = useState(true);

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [examForEval, setExamForEval] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({});
  const [term, setTerm] = useState('');
  const [statusOfEval, setStatusOfEval] = useState('');

  const [examOptions, setExamOptions] = useState([]);
  const [termOptions, setTermOptions] = useState([]);
  const [evaluationStatus, setEvaluationStatus] = useState(null);
  const [evaluationStatusofAll, setEvaluationStatusofAll] = useState(null);
  const [createdExams, setCreatedExams] = useState(null);

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];


  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodEvaluationStatuses';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!examForEval) {
      errors.examEr = 'Exam is required';
    }
    if (!term) {
      errors.tEr = 'Term is required';
    }
    if (!statusOfEval) {
      errors.sEval = 'Status is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAnnouncement = () => {
    setShowCheckStatus(true);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Handle Submit called");
    if (validateForm()) {
      console.log("Form is valid");
      //   
      console.log("Exam", examForEval);
      console.log("term", term);
      console.log("Status", statusOfEval);

      getEvaluationStatusByPanel(term.value, examForEval.label, statusOfEval.value)

      setShowCheckStatus(false);
      setShowEvaluationStatusofAll(false);

      // Add logic to handle form submission
    }
  };


      const fetchExamNames = async () => {
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
          console.log(data.examTypes, 'fetched Exam Data')
          const options = data.examTypes.map(exam => ({
            label: exam.examName,
            value: exam._id  // You can use any unique identifier if needed
          }));
    
          setExamOptions(options);
        
          
        } catch (error) {
          console.error('Error fetching Data:', error.message);
        } finally {
          setLoadingSpinner(false); 
        }
      };


  const getEvaluationStatusByPanel = async (termId, examName, evalStatus) => {
    console.log("Exam", examName);
    console.log("term", termId);
    console.log("Status", evalStatus);
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/manageexampanels/evaluationStatus/${termId}/${examName}?status=${evalStatus}`, {
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
      console.log(data, 'fetched evaluationStat Data')


      setEvaluationStatus(data);


    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };



  const deleteExamEvaluation = async (groupId, examName, termId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      console.log(groupId,
        examName,
        termId, "req not sending"
      )


      const response = await fetch(`/api/EvaluateExamRoutes/deleteEvaluation/${termId}/${examName}?groupId=${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete Examiner');
      }

      console.log('Examiner deleted successfully');
      // Optionally, perform any additional actions after deletion, such as updating state or fetching updated data

    } catch (error) {
      console.error('Error deleting Examiner:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const approveExamEvaluation = async (groupId, examName, termId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(`/api/EvaluateExamRoutes/approveEvaluation/${termId}/${encodeURIComponent(examName)}?&groupId=${groupId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Handle successful response
        console.log(' Exam Approved successfully');
        window.location.reload();
      } else {
        console.log('Failed to Approve ');
      }
    }
    catch (error) {
      console.error('Error Approving Exam: ', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  };




  const FetchCreatedExams = async () => {
    try {
      setLoadingSpinner(true);

      const apiUrl = '/api/ExamCreationRoutes/getAllCreatedExam';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData)

        const examData = responseData.exams
          .filter(exam => exam && exam.ExamType && exam.Term)
          .map(exam => ({
            examId: exam._id,
            examName: exam.ExamType.examName,
            termId: exam.Term._id,
          }))

        setCreatedExams(responseData);

        if (examData.length > 0) {
          FetchExaminerEvaluationForAllExams(examData)
        }

        console.log("Checking101", examData);
      } else {
        console.log('Failed to fetch Term Data');
      }
    } catch (error) {
      console.error('Error fetching Term Data:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };









  const FetchExaminerEvaluationForAllExams = async (examDataa) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      console.log("examDataaaa", examDataa);

      const queryString = examDataa.map(item => encodeURIComponent(JSON.stringify(item))).join('|');
      const url = `/api/manageexampanels/getEvaluationStatofAllexm?exams=${queryString}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Checking102", responseData);
        setEvaluationStatusofAll(responseData)
      } else {
        console.log('Failed to fetch Term Data');
      }
    } catch (error) {
      console.error('Error fetching Term Data:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };









  const TermDataGet = async () => {
    try {
      setLoadingSpinner(true);

      const apiUrl = '/api/auth/getTermdata';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const options = responseData.fypTerms.map(term => ({
          label: term.sessionTerm,
          value: term._id
        }));

        setTermOptions(options);

        console.log("Checking Term Data", responseData.fypTerms);
      } else {
        console.log('Failed to fetch Term Data');
      }
    } catch (error) {
      console.error('Error fetching Term Data:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    fetchExamNames();
    TermDataGet();
    FetchCreatedExams();
  }, [])


  const handleExamOptChange = (selectedOption) => {
    setExamForEval(selectedOption);
    setErrors(prevErrors => ({ ...prevErrors, examEr: '' }));
  }
  const handleTermOptChange = (selectedOption) => {
    setTerm(selectedOption);
    setErrors(prevErrors => ({ ...prevErrors, tEr: '' }));
  }
  const handleStatusOptChange = (selectedOption) => {
    setStatusOfEval(selectedOption);
    setErrors(prevErrors => ({ ...prevErrors, sEval: '' }));
  }
  const handleRevertion = (groupId, examName, termId) => {
    if (groupId && examName && termId) {
      deleteExamEvaluation(groupId, examName, termId);
    } else {
      deleteExamEvaluation(groupId, examForEval.label, term.value);
    }
  };



  const handleApproval = (groupId, examName, termId) => {
    if (groupId && examName && termId) {

      approveExamEvaluation(groupId, examName, termId)

    } else {
      approveExamEvaluation(groupId, examForEval.label, term.value)
    }
  }

  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className='mt-10 mx-16'>
            <div id="cardOneButton" className='w-[21%]'>
              <CardOnebutton title={"Evaluation Status"} butText={"View"} onClick={handleCreateAnnouncement} />
            </div>

            {showCheckStatus && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowCheckStatus(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div>
                    <div className='font-bold text-xl flex flex-row justify-center'>
                      <p>{'Evaluation Status'}</p>
                    </div>
                    <form>
                      <div className="my-4">
                        <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Exam Name
                          <Select
                            id='examDropdown'
                            name='examDropdown'
                            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                            options={examOptions}
                            isSearchable
                            onChange={handleExamOptChange}
                            value={examForEval}
                            placeholder='Select Exam'
                          />
                          {errors.examEr && <p className="text-red-500 text-sm">{errors.examEr}</p>}
                        </label>
                      </div>
                      <div className="my-4">
                        <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Term
                          <Select
                            id='termDropdown'
                            name='termDropdown'
                            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                            options={termOptions}
                            isSearchable
                            onChange={handleTermOptChange}
                            value={term}
                            placeholder='Select Term'
                          />
                          {errors.tEr && <p className="text-red-500 text-sm">{errors.tEr}</p>}
                        </label>
                      </div>
                      <div className="my-4">
                        <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Status
                          <Select
                            id='statusDropdown'
                            name='statusDropdown'
                            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                            options={statusOptions}
                            isSearchable
                            onChange={handleStatusOptChange}
                            value={statusOfEval}
                            placeholder='Select Status'
                          />
                          {errors.sEval && <p className="text-red-500 text-sm">{errors.sEval}</p>}
                        </label>
                      </div>
                      <div className="col-span-1 flex justify-center my-2">
                        <Simple text='Done' type="Submit" onClick={handleSubmit} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text='Details' accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                  <div className='table-container overflow-x-auto relative h-96 overflow-y-auto'>
                    <div className='bg-white text-sm'>
                      <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                          <tr className='border-b text-center'>
                            <th className='px-20 py-3'>Sr. No</th>
                            <th className='px-20 py-3'>FYP Title</th>
                            <th className='px-20 py-3'>Panel Member</th>
                            <th className='px-20 py-3'>Exam Type</th>
                            <th className='px-20 py-3'>Exam Date</th>
                            <th className='px-20 py-3'>Term</th>
                            <th className='px-20 py-3'>Evaluation Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showEvaluationStatusofAll ? (
                            evaluationStatusofAll && evaluationStatusofAll.map((exam, examIndex) => (
                              exam.groups.map((group, groupIndex) => (
                                <tr className='border-b text-center' key={group.groupId}>
                                  <td className='px-20 py-3'>{groupIndex + 1}</td>
                                  <td className='px-20 py-3'>{group.groupName || 'N/A'}</td>
                                  <td className='px-20 py-3'>
                                    {group.evaluators.map((evaluator, evaluatorIndex) => (
                                      <div key={`${evaluator.evaluatorId}`}>
                                        {`${evaluator.evaluatorName} (${evaluator.evaluationStatus === 'completed' ? 'Marked' : 'Pending'})`}
                                      </div>
                                    ))}
                                  </td>
                                  <td className='px-20 py-3'>{exam.examName}</td>
                                  <td className='px-20 py-3'>{group.examDate || 'N/A'}</td>
                                  <td className='px-20 py-3'>{exam.termName}</td>
                                  <td className='px-20 py-3'>
                                    {group.evaluators.length > 0 && group.evaluators.every(evaluator => evaluator.evaluationStatus === 'completed') 
                                      ? <span className="text-green-600 font-semibold">Completed</span> 
                                      : <span className="text-red-600 font-semibold">Incomplete</span>}
                                  </td>
                                </tr>
                              ))
                            ))
                          ) : (
                            evaluationStatus && evaluationStatus.map((group, groupIndex) => (
                              <>
                                <tr className='border-b text-center' key={group.groupId}>
                                  <td className='px-20 py-3'>{groupIndex + 1}</td>
                                  <td className='px-20 py-3'>{group.groupName || 'N/A'}</td>
                                  <td className='px-20 py-3'>{group.evaluators.map((evaluator, evaluatorIndex) => (
                                    <div key={`${evaluator.evaluatorId}`}>
                                      {`${evaluator.evaluatorName} (${evaluator.evaluationStatus === 'completed' ? 'Marked' : 'Pending'})`}
                                    </div>
                                  ))}</td>
                                  <td className='px-20 py-3'>{group.examName}</td>
                                  <td className='px-20 py-3'>{group.examDate || 'N/A'}</td>
                                  <td className='px-20 py-3'>{group.termName}</td>
                                  <td className='px-20 py-3'>
                                    {group.evaluators.length > 0 && group.evaluators.every(evaluator => evaluator.evaluationStatus === 'completed') 
                                      ? <span className="text-green-600 font-semibold">Completed</span> 
                                      : <span className="text-red-600 font-semibold">Incomplete</span>}
                                  </td>
                                </tr>
                              </>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
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


export default CoodEvaluationStatuses
