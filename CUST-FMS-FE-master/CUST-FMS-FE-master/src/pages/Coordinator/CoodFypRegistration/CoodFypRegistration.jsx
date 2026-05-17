import React, { useState, useEffect, useRef } from 'react'
import CardOneButton from '../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';

import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { AiOutlineConsoleSql } from 'react-icons/ai';



const CoodFypRegistration = ({ accordionId }) => {

  const [showFYPRegistrationCreationCard, setshowFYPRegistrationCreationCard] = useState(false);
  const [term, setTerm] = useState('');
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [FypRegistrationData, setFypRegistrationData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [registrationId, setRegistrationId] = useState('');





  const [termData, setTermData] = useState([]);
  const [attachPdf, setAttachPdf] = useState([]);
  const [dueTimeO, setDueTime] = useState('');
  const [dueDateO, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const cardRef = useRef(null);

  // Get current date and time for validation bounds
  const todayDate = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  console.log("View Mode", viewMode);
  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      Navigate('/login');
    }

    // Delay setting the indicator to ensure the DOM is fully rendered
    setTimeout(() => {
      const indicator = document.getElementById('scroll-indicator');
      if (indicator) {
        const tabName = "CoodFypRegistration";
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
          const topOffset = selectedTab.offsetTop;
          indicator.style.top = `${topOffset}px`;
        }
      }
    }, 100); // Adjust delay time if necessary

  }, []);

  const validateForm = () => {
    const errors = {};
    if (!term) errors.term = 'Term is required';
    if (!announcement) errors.announcement = 'Announcement Title is required';
    if (!dueDateO) errors.dueDate = 'Due Date is required';
    if (!dueTimeO) errors.dueTime = 'Due Time is required';

    if (dueDateO && dueTimeO) {
      if (dueDateO === todayDate && dueTimeO < currentTime) {
        errors.dueTime = 'Due Time cannot be in the past.';
      }
    }
    return errors;
  };

  const handleTermChange = (selectedOption) => {
    setTerm(selectedOption);
    setFormErrors((prev) => ({ ...prev, term: '' }));
  };
  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
    setFormErrors((prev) => ({ ...prev, announcement: '' }));
  };
  // const handleFileChange = (event) => {
  //   const newFile = event.target.files[0];
  //   setAttachPdf([...attachPdf, newFile]);
  // };

  // const handleDeleteFile = (index) => {
  //   const newFiles = [...attachPdf];
  //   newFiles.splice(index, 1);
  //   setAttachPdf(newFiles);
  // };
  const handleDueTimeChange = (e) => {
    setDueTime(e.target.value);
    setFormErrors((prev) => ({ ...prev, dueTime: '' }));
  };
  const handleDueDateChange = (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    
    // If they switch the date to today and the previously picked time is now in the past, clear it.
    if (newDate === todayDate && dueTimeO && dueTimeO < currentTime) {
      setDueTime('');
    }
    setFormErrors((prev) => ({ ...prev, dueDate: '' }));
  };
  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  // const handleViewFypReg = (item) => {
  //   const dueDateParts = item.dueDate.split('/');
  //   const formattedDueDate = `${dueDateParts[1]}/${dueDateParts[0]}/${dueDateParts[2]}`;
  //   console.log("Formatted Date", formattedDueDate);
  //   console.log('Time', convertToNormalTimeFormat(item.dueTime));
  //   setTerm({ label: item.term, value: item.term });
  //   setAnnouncement(item.announcementTitle);
  //   setDueDate(formattedDueDate);
  //   setDueTime(convertToNormalTimeFormat(item.dueTime));
  //   setInstructions(item.instructions);
  //   setViewMode(true);
  //   setshowFYPRegistrationCreationCard(true);
  // };

  const handleDeleteFypReg = async (itemId) => {
    console.log("Deletion of FYP Reg Called", itemId);
    const registrationId = itemId;
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      // const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/CreateFypReg/deleteFYPRegistration/${registrationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) {
        throw new Error('Failed to Delete FYP Registration');
      }
      // const data = await response.json();
      //Fetched  Data
      console.log('FYP Registration Deleted Successfully')
      window.location.reload(true);

    } catch (error) {
      console.error('Error Deleting FYP Registration Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  }

  const handleEditFypReg = (item) => {
    console.log("Edit Fyp Reg Called", item);
    setRegistrationId(item._id);
    const dueDateParts = item.dueDate.split('/');
    const formattedDueDate = `${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`; // Change to yyyy-mm-dd format for input type="date"
    const dueTime = item.dueTime.split(':');
    const formattedDueTime = `${dueTime[0].padStart(2, '0')}:${dueTime[1].padStart(2, '0')}`;
    console.log('Time', formattedDueTime);
    // Extracting time part only (HH:MM)
    console.log("Formatted Date", formattedDueDate);

    setTerm({ label: item.term?.sessionTerm || 'N/A', value: item.term?._id || '' });
    setAnnouncement(item.announcementTitle);
    setDueDate(formattedDueDate);
    setDueTime(formattedDueTime);
    setInstructions(item.instructions);
    setEditMode(true);
    setshowFYPRegistrationCreationCard(true);
  };

  const convertToNormalDateFormat = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    console.log(term, dueDateO, dueTimeO, announcement, instructions, attachPdf)
    const term1 = term.value

    if (editMode) {
      UpdateFYPRegistration(term1, announcement, dueDateO, dueTimeO, instructions)
    }

    CreateFYPRegistration(term1, announcement, dueDateO, dueTimeO, instructions)
    //handleSaveSchedule(data);
    setTerm('');
    setDueTime('');
    setDueDate('');
    setAnnouncement('');
    setInstructions('');
    setshowFYPRegistrationCreationCard(false);
    //onclose();
  };

  const handleFYPRegistrationCreation = () => {
    setViewMode(false);
    setshowFYPRegistrationCreationCard(true);
  };

  const handleClickOutside = (event) => {
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      setshowFYPRegistrationCreationCard(false);
      //onclose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // API API API API API API API API API API API API API API API API API API API API API 
  // API API API API API API API API API API API API API API API API API API API API API 






  const CreateFYPRegistration = async (term, announcementTitle, dueDate, dueTime, instructions) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      // const examinerId = parsedUserData._id;

      const apiUrl = `/api/CreateFypReg/CreateFYPRegistration`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          term, announcementTitle, dueDate, dueTime, instructions
        }),
      });
      if (response.ok) {
        // Handle successful response

        console.log(' FYP Registration open for Term successfully');
        window.location.reload(true);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to Create FYP Registration');
        console.log('Failed to Creation of FYP Registration ');
      }
    }
    catch (error) {
      console.error('Error Marking :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }
  const UpdateFYPRegistration = async (term, announcementTitle, dueDate, dueTime, instructions) => {

    console.log("Term", term.value);
    console.log("Announcement", announcementTitle);
    console.log('dueDate', dueDate);
    console.log('dueTime', dueTime);
    console.log('instruction', instructions);

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);


      const apiUrl = `/api/CreateFypReg/updateFYPRegDeadline/${registrationId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          term, announcementTitle, dueDate, dueTime, instructions
        }),
      });
      if (response.ok) {
        // Handle successful response

        console.log(' FYP Registration Updated for Term successfully');
        window.location.reload(true);
      } else {
        console.log('Failed to Updation of FYP Registration ');
      }
    }
    catch (error) {
      console.error('Error in Updating FYP Registration :', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }







  // Helper function to convert date to normal format















  // API API API API API API API API API API API API API API API API API API API API API 
  // API API API API API API API API API API API API API API API API API API API API API 

  useEffect(() => {


    const fetchTermData = async () => {
      try {
        setLoadingSpinner(true);
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        // const userData = localStorage.getItem('user');
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
        setTermData(dataofterm);
      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };
    fetchTermData();
  }, [])
  useEffect(() => {

    const fetchFYPRegistrationDeadline = async () => {
      try {
        setLoadingSpinner(true);
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);

        console.log("Checking Termmmmmmmm before sending request", term);
        const response = await fetch('/api/CreateFypReg/GetAllFYPRegistrationOfTerm', {
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
        // Fetched Data
        console.log(data, 'fetched DeadlineDataaaaaaaaaaaaaaaaaaaaaaa', data.registration);
        const registrations = data.registration;
        const formattedRegistrations = registrations.map((reg, index) => {
          const dueDate = convertToNormalDateFormat(reg.dueDateTime);
          console.log("Checking DueDate", dueDate);
          const dueTime = new Date(reg.dueDateTime).toISOString().substr(11, 5);
          console.log("DueTime", dueTime);;

          return {
            index: index + 1, // Adjusted to reflect the position in the array
            term: reg.term,
            announcementTitle: reg.announcementTitle,
            dueDate: dueDate,
            dueTime: dueTime,
            instructions: reg.instructions,
            _id: reg._id,
          };
        });

        console.log("before return", formattedRegistrations);

        setFypRegistrationData(formattedRegistrations);

      } catch (error) {
        console.error('Error fetching Data:', error.message);
      } finally {
        setLoadingSpinner(false);
      }
    };

    fetchFYPRegistrationDeadline();
  }, [])











  const convertToNormalTimeFormat = (isoTime) => {
    const date = new Date(`1970-01-01T${isoTime}Z`);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };


  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full h-full'>
          <div className="mx-10 pt-12 flex flex-col gap-3">
            {(!showFYPRegistrationCreationCard && (
              <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                <div id="cardOneButton">
                  <CardOneButton title={"Create FYP Registration"} butText={"Create"} onClick={handleFYPRegistrationCreation} />
                </div>
              </div>
            ))}

            {showFYPRegistrationCreationCard && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[33.3%] relative" /*ref={cardRef}*/>

                  <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setshowFYPRegistrationCreationCard(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {/* <RxCross2 /> */}
                  </button>
                  <div className='justify-center'>


                    <h2 className="text-center font-bold text-2xl mb-4 text-indigo-950">{editMode ? 'Edit FYP Registration' : 'Create FYP Registration'}</h2>

                  </div>

                  <form required >
                    <div className="my-4">
                      <label htmlFor='term' className="block text-md font-semibold text-gray-700">Term
                        <Select
                          id='term'
                          name='term'
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                          options={editMode ? termData : termData.filter(t => t.status === 'activated')}
                          isSearchable
                          onChange={handleTermChange}
                          value={term}
                          placeholder='Select or type'

                        />
                        {formErrors.term && (
                          <p className="text-red-500 text-sm">{formErrors.term}</p>
                        )}
                      </label>
                    </div>
                    <div className="my-4">
                      <label htmlFor='announcement' className="block text-md font-semibold text-gray-700">Announcement Title</label>
                      <input
                        id='announcement'
                        type="text"
                        value={announcement}
                        onChange={handleAnnouncementChange}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        placeholder='Announcement'

                      />
                      {formErrors.announcement && (
                        <p className="text-red-500 text-sm">{formErrors.announcement}</p>
                      )}
                    </div>

                    <div className="my-4">
                      <div className='grid grid-cols-2  gap-x-10'>
                        <div className="col-span-1">
                          <label htmlFor='date' className="block text-md font-semibold text-gray-700">Due Date</label>
                          <input
                            id='date'
                            type="date"
                            value={dueDateO}
                            onChange={handleDueDateChange}
                            min={todayDate}
                            className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}

                          />
                          {formErrors.dueDate && (
                            <p className="text-red-500 text-sm">{formErrors.dueDate}</p>
                          )}
                        </div>
                        <div className="col-span-1">
                          <label htmlFor='time' className="block text-md font-semibold text-gray-700">Due Time</label>
                          <input
                            type="time"
                            id='time'
                            value={dueTimeO}
                            onChange={handleDueTimeChange}
                            min={dueDateO === todayDate ? currentTime : undefined}
                            className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}

                          />
                          {formErrors.dueTime && (
                            <p className="text-red-500 text-sm">{formErrors.dueTime}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <label htmlFor='instructions' className="block text-md font-semibold text-gray-700">Instructions</label>
                      <textarea
                        type="text"
                        id='instructions'
                        value={instructions}
                        onChange={handleInstructionsChange}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 h-28`}

                      />
                    </div>
                    <div className="grid grid-cols-12 text-green-700 my-4 gap-x-4">


                    </div>
                  </form>


                  <div className='flex flex-row justify-center '>
                    <Simple text={editMode ? "Update" : "Done"} type="Submit" onClick={handleSubmit} />
                  </div>
                </div>
              </div>
            )}


            {/* 


            {FypRegistrationData && (<div className="mt-5">

              <AccordionGenericTable
                groupData={FypRegistrationData}

                accordionId={1}
                tabheading={"FYP Registration"}

                headers={['Sr no.', 'Term', 'Announcement Title', 'Due Date', 'Due Time', 'Instruction']}

                buttons={[
                  // {
                  //   bheading: 'Edit Details',
                  //   text: 'Edit',
                  //   click: handleEditClick

                  // }
                ]}

                fields={['index', 'term', "announcementTitle", 'dueDate', 'dueTime', 'instructions']}

              />

            </div>)} */}

            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text="FYP Registration" accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                  <div className="table-container overflow-x-auto relative h-96 overflow-y-auto">

                    <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                      <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                        <tr className='border-b text-center'>
                          <th className="px-6 py-3 w-32">Serial no.</th>
                          <th className="px-6 py-3 w-32 text-center">Term</th>
                          <th className="px-6 py-3 w-48">Announcement Title</th>
                          <th className="px-6 py-3 w-52">Due Date</th>
                          <th className="px-6 py-3 w-48">Due Time</th>
                          <th className="px-6 py-3 w-48">Instruction</th>
                          <th className="px-6 py-3 w-48">Action</th>

                        </tr>
                      </thead>
                      <tbody>
                        {FypRegistrationData && FypRegistrationData.length > 0 ? (
                          FypRegistrationData.map((item, index) => (
                            <tr key={index} className="text-center">
                              <td className="px-6 py-4 font-semibold">{index + 1}</td>
                              <td className="px-6 py-4 font-semibold text-center">{item.term?.sessionTerm || 'N/A'}</td>

                              <td className='px-6 py-4 overflow-hidden overflow-ellipsis max-w-xs'>
                                {item.announcementTitle.length > 24 ? `${item.announcementTitle.substring(0, 24)}...` : item.announcementTitle}
                              </td>
                              <td className="px-6 py-4 font-semibold">{item.dueDate}</td>
                              <td className="px-6 py-4 font-semibold">{item.dueTime}</td>
                              <td className='px-6 py-4 overflow-hidden overflow-ellipsis max-w-xs'>
                                {item.instructions.length > 24 ? `${item.instructions.substring(0, 24)}...` : item.instructions}
                              </td>


                              <td className='px-6 py-4'>

                                <button className='underline mx-2' onClick={() => handleDeleteFypReg(item._id)}>
                                  Delete
                                </button>
                                <button className='underline mx-2' onClick={() => handleEditFypReg(item)}>
                                  Edit
                                </button>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">Data Not Found</td>
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
      )}</>
  );
};

export default CoodFypRegistration;


{/* <button type='button'
                        onClick={() => document.getElementById('fileInput').click()}
                        className='flex flex-col items-center bg-slate-50 p-2 border border-gray-50 rounded-lg col-span-3'>
                        <MdFileUpload className='text-3xl mb-1' />
                        <span className='font-semibold text-xs'>Upload File</span>
                        <input
                          id="fileInput"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </button> */}
