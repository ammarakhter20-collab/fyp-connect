import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite } from 'flowbite';
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import { DescriptionOutlined } from '@mui/icons-material';
import GenAccor from '../../../Components/Accordians/GenAccor';

const CoodFeedback = ({ accordionId }) => {
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [showCreateFeedback, setShowCreateFeedback] = useState(false);
    const [errors, setErrors] = useState({});
    const [coordinator, setCoordinator] = useState([]);
    const [coord, setCoord] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState('');
    const [subject, setSubject] = useState('');
    const [Feedbacks, setFeedbacks] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        initFlowbite();

        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodFeedback';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

 
    const fetchFeedbacks = async () => {
        try {
            setLoadingSpinner(true);
            const data = localStorage.getItem('user');
            const user = JSON.parse(data);
            const departmentId = user.department;
            const apiUrl = `/api/FeedbackToCoordinator/getfeedbackstoCoord/${departmentId}`;
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

                setFeedbacks(responseData.feedbacks);
                console.log("Checking Feedbacksssssss Data", responseData.feedbacks);
            } else {
                console.log('Failed to fetch Feedback');
            }
        } catch (error) {
            console.error('Error fetching in Feedback:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
};

const handleViewFb = (fb) => {
  console.log("Feedback Id", fb);
  setCoord({
    label: fb.feedbackBy.name,
    value: fb.feedbackBy._id
  });
  setSelectedFeedback(fb);
  
  setModalVisible(true);
};
// console.log("Checking Consoleeeeeeeeeeeeeeeeeeeeeeeee", selectedFeedback.coordinator.name);



  return (
    <>
      {loadingSpinner ? (
            <LoadingSpinner />
        ) : (
            <div className='mt-10 mx-16'>
             

                {modalVisible && (
                     <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                     <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                         <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setModalVisible(false)}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                         </button>
                         <div>
                             <div className='font-bold text-xl flex flex-row justify-center'>
                                 <p>View Feedback</p>
                             </div>
                             <form>
                <div className="my-4">
                    <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Feedback By
                        <Select
                            id='coordDropdown'
                            name='coordDropdown'
                            className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                            options={coordinator}
                            isSearchable
                            // onChange={handleCoordChange}
                            value={coord}
                            placeholder='Select or type Coordinator'
                            isDisabled // make the select disabled
                        />
                        {errors.coordinator && <p className="text-red-500 text-sm">{errors.coordinator}</p>}
                    </label>
                </div>
                <div className="my-4">
                    <label htmlFor='subject' className="block text-md font-semibold text-gray-700">Subject
                        <input
                            id='subject'
                            name='subject'
                            type='text'
                            value={selectedFeedback.subject}
                            // onChange={handleSubjectChange}
                            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                            placeholder='Enter Subject'
                            readOnly // make the input readonly
                        />
                        {errors.subj && <p className="text-red-500 text-sm">{errors.subj}</p>}
                    </label>
                </div>
                <div className="my-4">
                    <label htmlFor='description' className="block text-md font-semibold text-gray-700">Description
                        <textarea
                            id='description'
                            name='description'
                            value={selectedFeedback.description}
                            // onChange={handleDescriptionChange}
                            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                            placeholder='Enter Description'
                            readOnly // make the textarea readonly
                        />
                        {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
                    </label>
                </div>
                
            </form>
                         </div>
                     </div>
                 </div>
                )}

                <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
                    <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                        <GenAccor text='Feedbacks' accordionId={accordionId} />
                    </h2>
                    <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                        <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                            <div className='table-container overflow-x-auto relative'>
                                <div className='bg-white text-sm'>
                                    <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                                            <tr className='border-b text-center'>
                                                <th className='px-20 py-3'>Sr. No</th>
                                                <th className='px-20 py-3'>Subject</th>
                                                <th className='px-20 py-3'>Feedback By</th>
                                                <th className='px-20 py-3'>Date</th>
                                                <th className='px-20 py-3'>Details</th>
                                            </tr>
                                        </thead>
                    <tbody>
                    {Array.isArray(Feedbacks) && Feedbacks.length > 0 ? (
    Feedbacks.map((fb, index) => (
      <tr key={fb._id} className='text-center font-normal'>
          <td className='px-6 py-4'>{index + 1}</td>
          <td className='px-6 py-4'>{fb.subject.length > 8 ? fb.subject.slice(0, 12) + '...' : fb.subject}</td>
          <td className='px-6 py-4'>{fb.feedbackBy.name}</td>
          <td className='px-6 py-4'>{formatDate(fb.creationTime)}</td>
          <td className='px-6 py-4'>
              <button className='underline mx-2' onClick={() => handleViewFb(fb)}>
                  View
              </button>
          </td>
      </tr>
  ))
) : (
  <tr>
      <td colSpan='9' className='text-center py-4'>No Feedback found</td>
  </tr>
)}
                                      </tbody>
                                  </table>
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
export default CoodFeedback;
