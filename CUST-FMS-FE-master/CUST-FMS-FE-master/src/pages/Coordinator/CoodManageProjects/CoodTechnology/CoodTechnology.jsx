import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import CardOnebutton from '../../../../Components/Cards/CardOnebutton';
import Simple from '../../../../Components/Buttons/Simple';

import GenAccor from '../../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const CoodTechnology = ({ accordionId }) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showTechnologyForm, setShowTechnologyForm] = useState(false);
  const [Tech, setTech] = useState('');
  const [SelectedTech, setSelectedTech] = useState('');
  const [Technologies, setTechnologies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [errors, setErrors] = useState({});


  useEffect(() => {
    initFlowbite();
    // if(!localStorage.getItem('key')){
    //   Navigate('/login');
    // }

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCreateTechnology';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    techData();
  }, [])
  console.log("Technologiesssssssssssssssssss", Technologies);
  const clearForm = () => {
    setTech('');
  };


  const handleAddTechnology = () => {
    setShowTechnologyForm(true);
  }

  const handleAddTech = (e) => {
    setTech(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, tech: '' }));
  }

  const updateTechnology = async (techId, updTech) => {
    const id = techId;
    const techName = updTech;
    console.log("TechIddddddddddddd in update Technolgy", techId);
    console.log("Updated Technology", updTech);

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const userId = user._id;
      const response = await fetch(`/api/managefyp/updTechnology/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ techName, userId }),
      });

      console.log("Request Sentttttttttttttttt");

      if (!response.ok) {
        throw new Error('Failed to update Technology');
      }
      else {

        const data = await response.json();
        console.log('Updated Technology:', data);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating Technology:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  }

  const deleteTech = async (tDel) => {
    console.log("Delete Technology ", tDel);
    const id = tDel;
    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/managefyp/delTechnology/${id}`; // Update API endpoint for deleting faculty
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

      });

      if (response.ok) {
        // Handle successful deletion
        console.log('Technology deleted successfully');
        window.location.reload();

        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete Technology');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting Technology:', error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);

    }
  }

  const techData = async () => {
    try {
      setLoadingSpinner(true);

      const apiUrl = '/api/managefyp/fetchtechnology'; // Update API endpoint for fetching faculties
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
        console.log('Fetched faculties:', responseData.faculties);
        // Assuming the response contains an array of faculties
        setTechnologies(responseData); // Update the faculties state with fetched data
        console.log("Checking Technologies Data", responseData);
      } else {
        console.log('Failed to fetch faculties');
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const handleCreateTechnology = async () => {
    clearForm();

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const userId = user._id;
      const techName = Tech;
      console.log("techNameeeeeeeeeeeeeeeeeeeee", techName);
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const apiUrl = `/api/managefyp/addtechnology`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          techName, userId
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Technology Created successfully');
        window.location.reload();
      } else {
        console.log('Failed to Create Technology ');
      }
    } catch (error) {
      console.error('Error in Creating Technology:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleEditTech = (technology) => {
    console.log("Technology inside edit", technology);
    setSelectedTech(technology._id);
    setTech(technology.techName);
    setShowTechnologyForm(true);
    setModalMode('edit');
  }
  const validateForm = () => {
    const errors = {};
    if (!Tech.trim()) {
      errors.tech = 'Technology Name is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (SelectedTech) {
        const techId = SelectedTech;
        updateTechnology(techId, Tech);
      } else {
        handleCreateTechnology();
      }
    }
  };


  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className="mx-16 mt-10">

          <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
            <div id="cardOneButton">
              <CardOnebutton title={"Add Technology"} butText={"Add"} onClick={handleAddTechnology} />
            </div>
          </div>



          {showTechnologyForm && (
            <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
              <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative " /*ref={cardRef}*/>
                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowTechnologyForm(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {/* <RxCross2 /> */}
                </button>
                <div>
                  <div className='font-bold text-xl flex flex-row justify-center'>
                    <p>{modalMode === 'edit' ? 'Edit Technology' : 'Add Technology'}</p>
                  </div>
                  <form>


                    <div className="my-4">
                      <label htmlFor="AddTech" className="block text-md font-semibold text-gray-700">
                        Technology Name
                        <input
                          id="AddTech"
                          name="Add Technology"
                          type="text"
                          value={Tech}
                          onChange={handleAddTech}
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.tech ? 'border-red-500' : ''}`}
                        />
                        {errors.tech && <p className="text-red-500 text-sm">{errors.tech}</p>}
                      </label>
                    </div>

                    <div className="col-span-1 flex justify-center my-2">
                      <Simple text={modalMode === 'edit' ? 'Edit' : 'Add'} type="Submit" onClick={handleSubmit} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text='Created Technology' accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`${showModal ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                {/* Faculty Table */}
                <div className='table-container overflow-x-auto relative'>
                  <div className='bg-white text-sm'>
                    {/* <p className='text-base font-semibold ml-7 mb-4'>Term: {TermForAccor}</p> */}
                    <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                      <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                        <tr className='border-b text-center'>
                          <th className='px-20 py-3'>Sr. No</th>
                          <th className='px-20 py-3'>Technology Name</th>
                          <th className='px-20 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>



                        {Array.isArray(Technologies) && Technologies.length > 0 ? (
                          Technologies.map((technology, index) => (
                            <tr key={technology._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{technology.techName}</td>

                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleEditTech(technology)}>
                                  Edit
                                </button>
                                <button className='underline ml-2' onClick={() => deleteTech(technology._id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='9' className='text-center py-4'>No Technologies found</td>
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
}

export default CoodTechnology
