import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../Components/Buttons/Simple';
import Modal from '../../../Components/Modal/Modal';

const HoDClos = ({ accordionId }) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [cloData, setCloData] = useState([]);
  const [selectedClo, setSelectedClo] = useState(null);
  const [showCloForExamDet, setShowCloForExamDet] = useState(false);
  const [showCloDet, setShowCloDet] = useState(false);
  const [cloDetails, setCloDetails] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initFlowbite();
    fetchExamCLOs();
  }, []);

  const fetchExamCLOs = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
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
      console.log(data, 'fetched Exam CLOs');
      setCloData(data.CLOsForExam);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleViewDetails = (clo) => {
    setSelectedClo(clo);
    setShowCloForExamDet(true);
  };

  const handleBackFromClo = () => {
    setShowCloForExamDet(false);
  };

  const handleViewCloDet = (clo) => {
    setCloDetails(clo);
    setShowCloDet(true);
    setShowCloForExamDet(false);
  };

  const handleBackFromCloDet = () => {
    setShowCloDet(false);
    setShowCloForExamDet(true);
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    console.log("Questionnnnnnnnnnnnn", question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className="mx-16 mt-10">
          {!showCloForExamDet && !showCloDet && (
            <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text='CLO For Exams' accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                  <div className='table-container overflow-x-auto relative'>
                    <div className='bg-white text-sm'>
                      <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                          <tr className='border-b text-center'>
                            <th className='px-20 py-3'>Sr. No</th>
                            <th className='px-20 py-3'>Program</th>
                            <th className='px-20 py-3'>Short Code</th>
                            <th className='px-20 py-3'>Questions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cloData.map((clo, index) => (
                            <tr key={clo._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{clo.program.programTitle}</td>
                              <td className='px-6 py-4'>{clo.shortCode}</td>
                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleViewDetails(clo)}>
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div>
                     
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showCloForExamDet && !showCloDet && (
            <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text='CLOs' accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                  <div className='table-container overflow-x-auto relative'>
                    <div className='bg-white text-sm'>
                      <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                          <tr className='border-b text-center'>
                            <th className='px-20 py-3'>Sr. No</th>
                            <th className='px-20 py-3'>Short Code</th>
                            <th className='px-20 py-3'>Program</th>
                            <th className='px-20 py-3'>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedClo && selectedClo.CLOs.map((clo, index) => (
                            <tr key={clo._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{clo.CLOCode}</td>
                              <td className='px-6 py-4'>{clo.Program.programTitle}</td>
                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleViewCloDet(clo)}>
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className='flex flex-row justify-end mt-2'>
                        <Simple text={'Back'} type="Submit" onClick={handleBackFromClo} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showCloDet && (
            <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text='CLOs Details' accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                  <div className='table-container overflow-x-auto relative'>
                    <div className='bg-white text-sm'>
                      <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                          <tr className='border-b text-center'>
                            <th className='px-20 py-3'>Sr. No</th>
                            <th className='px-20 py-3'>Short Code</th>
                            <th className='px-20 py-3'>Question</th>
                            <th className='px-20 py-3'>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cloDetails && cloDetails.Questions.map((question, index) => (
                            <tr key={question._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{question.shortCode}</td>
                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleViewQuestion(question)}>
                                  View
                                </button>
                              </td>
                              <td className='px-6 py-4'>{question.marks}</td>
                             
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className='flex flex-row justify-end mt-2'>
                        <Simple text={'Back'} type="Submit" onClick={handleBackFromCloDet} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {selectedQuestion && (
        <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative " /*ref={cardRef}*/>
            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setSelectedQuestion(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {/* <RxCross2 /> */}
            </button>
            <div>
            <div className='font-bold text-xl flex flex-row justify-center'>
    <p>{'Description'}</p>
  </div>
                <form>
                   
                <div className="my-4">
                                        <label htmlFor='description' className="block text-md font-semibold text-gray-700">Description
                                            <textarea
                                                id='description'
                                                name='description'
                                                value={selectedQuestion.question}
                                                // onChange={handleDescriptionChange}
                                                readOnly
                                                className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                                placeholder='Enter Description'
                                                
                                            />
                                            {/* {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>} */}
                                        </label>
                                    </div>
                   
                    
                </form>
            </div>
        </div>
    </div>
      )}
    </>
  );
};

export default HoDClos;
