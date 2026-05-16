import React, { useEffect, useState } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import SuccessMessage from '../../../Components/ConfirmationMessages/SuccessMessage';

const AdmFYPSessionTerm = ({ accordionId }) => {
  // Get today's date in YYYY-MM-DD format for the min attribute
  const todayDate = new Date().toISOString().split('T')[0];

  const getMaxEndDate = (startStr) => {
    if (!startStr) return '';
    const date = new Date(startStr);
    date.setMonth(date.getMonth() + 6);
    return date.toISOString().split('T')[0];
  };

  const [sessionTerm, setSessionTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [terms, setTerms] = useState([]);
  const [activeTerm, setActiveTerm] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [TermRestriction, setTermRestriction] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const [ShowConMsg, setShowConMsg] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [TermCreationRestriction, setTermCreationRestriction] = useState('');
  const [formErrors, setFormErrors] = useState({
    sessionTerm: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    initFlowbite();
    // if(!localStorage.getItem('key')){
    //   Navigate('/login');
    // }
    
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AdmFYPSessionTerm';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);


  useEffect(() => {
    const fetchTermData = async () => {
      setLoadingSpinner(true);
      console.log("Fetch Term called");
      try {
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        const response = await fetch('/api/auth/getTermdata', {
          method: 'GET',
          headers: {
            
            // 'Content-Type': 'application/json',
            // You can add the authorization token here if required
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setTerms(data.fypTerms); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error.message);
        // Handle error, show error message, etc.
      }
      finally {
        setLoadingSpinner(false); // Set loading back to false after data is fetched
      }
    };


    fetchTermData();
    // setLoadingSpinner(true);
    // setTimeout(() => {
    //   setLoadingSpinner(false);
    // }, 1000); 
   // Call the fetchData function when the component mounts
  }, []);

  const countActivatedTerms = () => {
    const activatedTermsCount = terms.filter(term => term.status === 'activated').length;
    return activatedTermsCount;
  };

  // Function to check and set term restriction
  const checkAndSetTermRestriction = () => {
    const activatedCount = countActivatedTerms();
    if (activatedCount > 1) {
      setTermRestriction(true);
    } else {
      setTermRestriction(false);
    }
  };

  const handleSessionTermChange = (e) => {
    // Remove any non-digit characters (only allow numbers 0-9)
    const numericValue = e.target.value.replace(/\D/g, '');
    setSessionTerm(numericValue);
    setFormErrors({ ...formErrors, sessionTerm: '' }); // Clear sessionTerm error
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    
    // Check if current endDate is valid based on new startDate
    if (endDate) {
      const newMaxDate = getMaxEndDate(e.target.value);
      if (e.target.value > endDate || endDate > newMaxDate) {
        setEndDate('');
      }
    }
    
    setFormErrors({ ...formErrors, startDate: '' }); // Clear startDate error
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setFormErrors({ ...formErrors, endDate: '' }); // Clear endDate error
  };

  // const handleCreateTerm = () => {
  //   if (validateForm()) {
  //     // Handle creation logic here
  //     const newTerm = { sessionTerm, startDate, endDate, active: true };
  //     setTerms([...terms, newTerm]);
  //     setActiveTerm(newTerm);
  //     setShowModal(false);
  //   }
  // };
console.log("Checkingg now = ", TermCreationRestriction)
  const validateForm = () => {
    let isValid = true;
    const errors = {
      sessionTerm: '',
      startDate: '',
      endDate: '',
    };

    if (!sessionTerm) {
      errors.sessionTerm = 'Session Term is required.';
      isValid = false;
    }
    if (!startDate) {
      errors.startDate = 'Starting date is required.';
      isValid = false;
    }
    if (!endDate) {
      errors.endDate = 'End date is required.';
      isValid = false;
    }
    const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (endDateObj <= startDateObj) {
    alert('End date must be after the start date');
    return; // Exit the function early if validation fails
  }


    setFormErrors(errors);
    return isValid;
  };

  const handleEditTerm = (term) => {
    console.log("in edit term ", term)
    setSelectedTerm(term);
    setSessionTerm(term.sessionTerm);
    const sDateForm = term.startDate.substring(0, 10);
    const eDateForm = term.endDate.substring(0, 10);
    setStartDate(sDateForm);
    setEndDate(eDateForm);
    setShowModal(true);
  };

  const handleUpdateTerm = async ( updatedSessionTerm, updatedStartDate, updatedEndDate, selectedTermID) => {
    console.log("Inside Update function");
    try {
      setLoadingSpinner(true);
      const apiUrl = '/api/auth/updateTermData'; // Assuming your API endpoint for updating a term is like this
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedTermId: selectedTermID,
          sessionTerm: updatedSessionTerm,
          startDate: updatedStartDate,
          endDate: updatedEndDate,
        }),
      });
  console.log("Update FYP term request send")
      if (response.ok) {
        // Handle successful update
        console.log('Term updated successfully');
        setSessionTerm('');
        setStartDate('');
        setEndDate('');
        setSelectedTerm(null);  
        setShowModal(false);
        // window.location.reload(true);

        const updateFYPterm = terms.map((item) => {
          if (item._id === selectedTermID) {
            return {
              ...item,
              sessionTerm: updatedSessionTerm,
          startDate: updatedStartDate,
          endDate: updatedEndDate,
            };
          }
          return item;
        });
        setTerms(updateFYPterm);
        setConfirmationMessage('Term Updated Successfully');
          setShowConfirmation(true);
  
      // Hide the confirmation message after 3 seconds
      setTimeout(() => {
        setShowConMsg(false);
      }, 3000);

      } else {
        // Handle update failure
        console.log('Failed to update term');
        // You may want to show an error message or perform other actions upon update failure
      }

    } catch (error) {
      console.error('Error updating term:', error);
      // Handle network errors or other errors
    }
    finally {
      setLoadingSpinner(false);
    }
  };

  const handleDeactivateTerm = async (term) => {
    console.log("In Handle deactivate front end", term._id);
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch('/api/auth/deactivate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedTermId: term._id  // Assuming term object has an _id property
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Term deactivated successfully:', data.updatedTerm);
        // window.location.reload(true);
        const updatedFYPterm = terms.map((item) => {
          if (item._id === term._id) {
            return {
              ...item,
              status: 'Deactivated',
            };
          }
          return item;
        });
        setTerms(updatedFYPterm);
        setConfirmationMessage('Term Deactivated Successfully');
          setShowConfirmation(true);
        // Handle success, update UI or show success message
      } else {
        console.error('Error deactivating term:', data.message);
        // Handle error, show error message to user
      }
      
      setConfirmationMessage('Term Deactivated successfully');
      setShowConMsg(true);
  
      // Hide the confirmation message after 3 seconds
      setTimeout(() => {
        setShowConMsg(false);
      }, 3000);
    } catch (error) {
      console.error('Error deactivating term:', error.message);
      // Handle network or other errors
    }
    finally {
      setLoadingSpinner(false);
    }
  };

 

  const CreateClick = () => {
    checkAndSetTermRestriction();
    if(!TermRestriction){
      setShowModal(true);
    }
    else{
      window.alert('Two terms is already activated.'); // Alert when term is already activated

    }
  }

  const handleCreateTerm = async() => {
    if(!TermRestriction){
    if (validateForm()) {
      try {
        setLoadingSpinner(true);
        const apiUrl = '/api/auth/createFYPterm';
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({
            sessionTerm,
            startDate,
            endDate,
          }),
        });
        console.log("Checking token now", token);
console.log("Request Send from front end");
        if (response.ok) {
          // Handle successful response
          setSessionTerm('');
          setStartDate('');
          setEndDate('');
          setShowModal(false);
          const responseData = await response.json();
          const newFYPTermId = responseData.fypTerm._id;
        
        const newTerm = {
          _id: newFYPTermId, // Use actual ID returned by the server
          sessionTerm,
          startDate,
          endDate,
          status: 'activated', // Assuming termId is available
        };
        setTerms([...terms, newTerm]);    
        setConfirmationMessage('Term Created Successfully');
        setShowConfirmation(true);
          } 
        else {
          const errorData = await response.json();
          window.alert(errorData.error || "Failed to create term.");
          console.log("Failed to get response", errorData);
        }
      } catch (error) {
        // Handle network errors
        console.error('Network error:', error);
        // setSubmissionStatus('Failed to submit form. Please try again.');
      }
      finally {
        setLoadingSpinner(false); // Set loading back to false after API call is finished
      }
    }

     else {
      console.log('FYP term form has validation errors. Please fix them.');
    }
  }
  else{
    window.alert('Your term is already activated.'); // Alert when term is already activated
  
  }
  }

  const convertToNormalDateFormat = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  

  const handleSubmit = (e) => {
    console.log("Handle Submit Called")
    e.preventDefault();
    if (loading) {
      return; // Prevent multiple clicks while loading
    }
    if(endDate < startDate){
      window.alert("End Date must be greater than Start Date");
    }

    else{
 

    console.log("End Date", endDate);
    if (selectedTerm) {
      const selectedTermId = selectedTerm._id;
    
      handleUpdateTerm(sessionTerm, startDate, endDate, selectedTermId); // Pass form data to update function
    } else {
      handleCreateTerm(); // Call create function
    }
  }

  };

console.log("Terms data fetched = ", terms)
  return (
    <>
    {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
    ):(
      
      <div className='mx-16'>
        {showConfirmation && (
        <SuccessMessage
          message={confirmationMessage}
          onClose={handleCloseConfirmation}
        />
        
      )}
        <div className="bg-primary max-h-40 h-40 max-w-xs rounded-lg mb-6 mt-12">
          <div className=''>
            <p className="font-semibold text-white text-xl ml-6 pt-4">{selectedTerm ? 'View Term' : 'Create Term'}</p>
          </div>
          <div className="mt-12 ml-6">
            <Simple text="Create" onClick={CreateClick} />
          </div>
        </div>
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className={`mt-1 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
          <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
            <GenAccor text="Created Terms" accordionId={accordionId} />
          </h2>

          <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`${showModal ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              {/* Timetable Table */}
              <div className="table-container overflow-x-auto relative">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-28">Sr. No</th>
                      <th className="px-6 py-3">Session Term</th>
                      <th className="px-6 py-3">Term Status</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Array.isArray(terms) && terms.length > 0 ? (
  terms.map((item, index) => {
    const srno = index + 1;
    return (
      <tr key={index} className="text-center font-normal">
        <td className="px-6 py-4">{srno}</td>
        <td className="px-6 py-4">{item.sessionTerm}</td>
        <td className="px-6 py-4">{item.status}</td>
        <td className="px-6 py-4">
          <button className="underline mx-2" onClick={() => handleEditTerm(item)}>Edit</button>
          <button className="underline" onClick={() => handleDeactivateTerm(item)}>Deactivate</button>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan='6' className='text-center py-4'>No Term Found</td>
  </tr>
)}


                    {/* {terms.map((item, index) => {
                      const srno = index + 1;
                      return (
                        <tr key={index} className="text-center font-normal">
                          <td className="px-6 py-4">{srno}</td>
                          <td className="px-6 py-4">{item.sessionTerm}</td>
                          <td className="px-6 py-4">{item.status}</td>
                          <td className="px-6 py-4">
                            <button className="underline mx-2" onClick={() => handleEditTerm(item)}>Edit</button>
                            <button className="underline" onClick={() => handleDeactivateTerm(item)}>Deactivate</button>
                          </td>
                        </tr>
                      );
                    })} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg w-[31.25rem] h-[390px] relative">
            <form onSubmit={handleSubmit}>
              <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className='font-bold text-xl flex flex-row justify-center'>
                <p>{selectedTerm ? 'View Term' : 'Create Term'}</p>
              </div>
              <div className='mt-8'>
                <label htmlFor="sessionTerm" className="block mb-1 text-sm font-medium text-black">
                  Session Term
                </label>
                <input
                  type="number"
                  min="0"
                  id="sessionTerm"
                  placeholder="Enter session term"
                  value={sessionTerm}
                  onChange={handleSessionTermChange}
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  // required
                />
                {formErrors.sessionTerm && <p className='text-red-500 text-sm mt-1'>{formErrors.sessionTerm}</p>}
              </div>
              <div className="flex justify-between mt-8">
                <div className='w-1/2 mr-2'>
                  <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-black">
                    Starting date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={todayDate}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    // required
                  />
                  {formErrors.startDate && <p className='text-red-500 text-sm mt-1'>{formErrors.startDate}</p>}
                </div>
                <div className='w-1/2 ml-2'>
                  <label htmlFor="endDate" className="block mb-1 text-sm font-medium text-black">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate}
                    max={getMaxEndDate(startDate)}
                    disabled={!startDate}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${!startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    // required
                  />
                  {formErrors.endDate && <p className='text-red-500 text-sm mt-1'>{formErrors.endDate}</p>}
                </div>
              </div>
              <div className="flex justify-center mt-9">
              {selectedTerm ? (
                    <button type="submit" className="bg-primary hover:bg-slate-700 text-white font-bold py-2 px-12 mt-2 rounded">
                      Update
                    </button>
                  ) : (
                    <button type="submit" className="bg-primary hover:bg-secondary text-white font-bold py-2 px-12 mt-2 rounded">
                      Create
                    </button>
                  )}             
          </div>
            </form>
            </div>
          </div>
        )}
      </div>
    )}
    </>
  );
};

export default AdmFYPSessionTerm;
