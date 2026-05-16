import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite } from 'flowbite';
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import { DescriptionOutlined } from '@mui/icons-material';
import GenAccor from '../../../Components/Accordians/GenAccor';

const HoDFeedback = ({ accordionId }) => {
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
    const [selectedFeedbackDetails, setSelectedFeedbackDetails] = useState({
        coordinator: '',
        subject: '',
        description: ''
    });

    useEffect(() => {
        initFlowbite();

        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'HoDFeedback';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);

    useEffect(() => {
        fetchCoordinator();
        fetchFeedbacks();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!coord) {
            errors.coordinator = 'Coordinator is required';
        }
        if (!description) {
            errors.desc = 'Feedback description is required';
        }
        if (!subject) {
            errors.subj = 'Subject is required';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateFeedback = () => {
        setCoord('');
        setDescription('');
        setSubject('');
        setShowCreateFeedback(true);
    };

    const fetchCoordinator = async () => {
        try {
            setLoadingSpinner(true);
            const data = localStorage.getItem('user');
            const user = JSON.parse(data);
            const departmentId = user.department;
            const apiUrl = `/api/auth/getCoordinators/${departmentId}`;
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
                const transformedData = responseData.coordinators.map(coord => ({
                    label: coord.name,
                    value: coord._id
                }));
                setCoordinator(transformedData);
                console.log("Checking Coordinator Data", responseData);
            } else {
                console.log('Failed to fetch Coordinator');
            }
        } catch (error) {
            console.error('Error fetching in Coordinator:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };
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

    const updateFeedback = (fId) => {
        console.log("Checking Feedback Id", fId);
    }

    const addFeedback = async () => {
        try {
            setLoadingSpinner(true);
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString(); // Format the date as an ISO string
    
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
            const user = JSON.parse(userData);
            const feedbackBy = user._id;
            const departmentId = user.department;
            const apiUrl = `/api/FeedbackToCoordinator/feedbacktoCoord`;
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    coordinator: coord.value,
                    feedbackBy,
                    subject,
                    description,
                    departmentId,
                    creationTime: formattedDate // Use the ISO formatted date
                }),
            });
    
            console.log("Checking Request Sent");
            if (response.ok) {
                // Handle successful response
                console.log('Feedback Created successfully');
                window.location.reload();
            } else {
                console.log('Failed to Create Feedback');
            }
        } catch (error) {
            console.error('Error in Creating Feedback:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };
    

    const handleCoordChange = selectedOption => {
        console.log("Checking Change Coordinator", selectedOption);
        setCoord(selectedOption);
        // Clear the error when the user selects an option
        setErrors(prevErrors => ({ ...prevErrors, coordinator: '' }));
    };

    const handleSubjectChange = event => {
        setSubject(event.target.value);
        // Clear the error when the user starts typing
        setErrors(prevErrors => ({ ...prevErrors, subj: '' }));
    };


  const handleDescriptionChange = event => {
    setDescription(event.target.value);
    // Clear the error when the user starts typing
    setErrors(prevErrors => ({ ...prevErrors, desc: '' }));
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
};

const handleViewFb = (fb) => {
  console.log("Feedback Id", fb);
  setCoord({
    label: fb.coordinator.name,
    value: fb.coordinator._id
  });
  setSelectedFeedback(fb);
  
  setModalVisible(true);
};
// console.log("Checking Consoleeeeeeeeeeeeeeeeeeeeeeeee", selectedFeedback.coordinator.name);

const handleDeleteFb = async (fb) => {
console.log("Checking Feedback to delete", fb)
}

  const handleSubmit = () => {
    console.log("Handle Submit called");
    if (validateForm()) {
      console.log("Form is valid");
      console.log("Feedback To", coord);
      console.log("Subject", subject);
      console.log("Description", description);

      if(selectedFeedback){
        const fId = selectedFeedback;
        updateFeedback(fId);
      }
      else
      {
       addFeedback();
      }
      // Add logic to handle form submission
    }
  };

  return (
    <>
      {loadingSpinner ? (
            <LoadingSpinner />
        ) : (
            <div className='mt-10 mx-16'>
                <div id="cardOneButton" className='w-[21%]'>
                    <CardOnebutton title={"Feedback"} butText={"Add"} onClick={handleCreateFeedback} />
                </div>

                {showCreateFeedback && (
                    <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowCreateFeedback(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div>
                                <div className='font-bold text-xl flex flex-row justify-center'>
                                    <p>Add Feedback</p>
                                </div>
                                <form>
                                    <div className="my-4">
                                        <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Feedback to
                                            <Select
                                                id='coordDropdown'
                                                name='coordDropdown'
                                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                options={coordinator}
                                                isSearchable
                                                onChange={handleCoordChange}
                                                value={coord}
                                                placeholder='Select or type Coordinator'
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
                                                value={subject}
                                                onChange={handleSubjectChange}
                                                className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                                placeholder='Enter Subject'
                                            />
                                            {errors.subj && <p className="text-red-500 text-sm">{errors.subj}</p>}
                                        </label>
                                    </div>
                                    <div className="my-4">
                                        <label htmlFor='description' className="block text-md font-semibold text-gray-700">Description
                                            <textarea
                                                id='description'
                                                name='description'
                                                value={description}
                                                onChange={handleDescriptionChange}
                                                className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                                placeholder='Enter Description'
                                            />
                                            {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
                                        </label>
                                    </div>
                                    <div className="col-span-1 flex justify-center my-2">
                                        <Simple text={'Add'} type="Submit" onClick={handleSubmit} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

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
                    <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Feedback to
                        <Select
                            id='coordDropdown'
                            name='coordDropdown'
                            className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                            options={coordinator}
                            isSearchable
                            onChange={handleCoordChange}
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
                            onChange={handleSubjectChange}
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
                            onChange={handleDescriptionChange}
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
                        <GenAccor text='Added Feedbacks' accordionId={accordionId} />
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
                                                <th className='px-20 py-3'>Feedback to</th>
                                                <th className='px-20 py-3'>Date</th>
                                                <th className='px-20 py-3'>Details</th>
                                                <th className='px-20 py-3'>Action</th>
                                            </tr>
                                        </thead>
                    <tbody>
                    {Array.isArray(Feedbacks) && Feedbacks.length > 0 ? (
    Feedbacks.map((fb, index) => (
      <tr key={fb._id} className='text-center font-normal'>
          <td className='px-6 py-4'>{index + 1}</td>
          <td className='px-6 py-4'>{fb.subject.length > 8 ? fb.subject.slice(0, 12) + '...' : fb.subject}</td>
          <td className='px-6 py-4'>{fb.coordinator.name}</td>
          <td className='px-6 py-4'>{formatDate(fb.creationTime)}</td>
          <td className='px-6 py-4'>
              <button className='underline mx-2' onClick={() => handleViewFb(fb)}>
                  View
              </button>
          </td>
          <td className='px-6 py-4'>
              <button className='underline mx-2' onClick={() => handleDeleteFb(fb._id)}>
                Delete
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
export default HoDFeedback;
