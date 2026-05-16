import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import CardOnebutton from '../../../../Components/Cards/CardOnebutton';
import Simple from '../../../../Components/Buttons/Simple';

import GenAccor from '../../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const CoodPlatForm = ({ accordionId }) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showPlatformForm, setShowPlatformForm] = useState(false);
  const [Plat, setPlat] = useState('');
  const [SelectedPlat, setSelectedPlat] = useState('');
  const [Platform, setPlatform] = useState([]);
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
      const tabName = 'CoodCreatePlatform';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    PlatData();
  }, [])
  console.log("Platformssssssssssssssssss", Platform);
  const clearForm = () => {
    setPlat('');
  };


  const handleAddPlatform = () => {
    setShowPlatformForm(true);
  }

  const handleAddPlat = (e) => {
    setPlat(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, plat: '' }));

  }

  const updatePlatform = async (PlatId, updPlat) => {
    const platformId = PlatId;
    const platformName = updPlat;
    console.log("PlatIddddddddddddd in update Platnolgy", PlatId);
    console.log("Updated Platform", updPlat);

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const userId = user._id;
      const response = await fetch(`/api/managefyp/EditPlatform/${platformId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ platformName, userId }),
      });

      console.log("Request Sentttttttttttttttt");

      if (!response.ok) {
        throw new Error('Failed to update Platform');
      }
      else {

        const data = await response.json();
        console.log('Updated Platform:', data);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating Platform:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  }

  const deletePlat = async (tDel) => {
    console.log("Delete Platform ", tDel);
    const platformId = tDel;
    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/managefyp/DelPlatForm/${platformId}`; // Update API endpoint for deleting faculty
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
        console.log('Platform deleted successfully');
        window.location.reload();

        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete Platform');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting Platform:', error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);

    }
  }

  const PlatData = async () => {
    try {
      setLoadingSpinner(true);

      const apiUrl = '/api/managefyp/fetchplatform'; // Update API endpoint for fetching faculties
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
        setPlatform(responseData); // Update the faculties state with fetched data
        console.log("Checking Platform Data", responseData);
      } else {
        console.log('Failed to fetch Platform');
      }
    } catch (error) {
      console.error('Error fetching Platform:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const handleCreatePlatform = async () => {
    clearForm();

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const userId = user._id;
      const PlatName = Plat;
      console.log("PlatNameeeeeeeeeeeeeeeeeeeee", PlatName);
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const apiUrl = `/api/managefyp/addPlatform`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platformName: PlatName,
          user: userId,
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log(' Platform Created successfully');
        window.location.reload();
      } else {
        console.log('Failed to Create Platform ');
      }
    } catch (error) {
      console.error('Error in Creating Platform:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleEditPlat = (Platform) => {
    console.log("Platform inside edit", Platform);
    setSelectedPlat(Platform._id);
    setPlat(Platform.platformName);
    setShowPlatformForm(true);
    setModalMode('edit');
  }


  const validateForm = () => {
    const errors = {};
    if (!Plat.trim()) {
      errors.plat = 'Platform Name is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (SelectedPlat) {
        const PlatId = SelectedPlat;
        updatePlatform(PlatId, Plat);
      } else {
        handleCreatePlatform();
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
              <CardOnebutton title={"Add Platform"} butText={"Add"} onClick={handleAddPlatform} />
            </div>
          </div>



          {showPlatformForm && (
            <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
              <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative " /*ref={cardRef}*/>
                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowPlatformForm(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {/* <RxCross2 /> */}
                </button>
                <div>
                  <div className='font-bold text-xl flex flex-row justify-center'>
                    <p>{modalMode === 'edit' ? 'Edit Platform' : 'Add Platform'}</p>
                  </div>
                  <form>

                    <div className="my-4">
                      <label htmlFor="AddPlat" className="block text-md font-semibold text-gray-700">
                        Platform Name
                        <input
                          id="AddPlat"
                          name="Add Platform"
                          type="text"
                          value={Plat}
                          onChange={handleAddPlat}
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.plat ? 'border-red-500' : ''}`}
                        />
                        {errors.plat && <p className="text-red-500 text-sm">{errors.plat}</p>}
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
              <GenAccor text='Created Platform' accordionId={accordionId} />
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
                          <th className='px-20 py-3'>Platform Name</th>
                          <th className='px-20 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>



                        {Array.isArray(Platform) && Platform.length > 0 ? (
                          Platform.map((Platform, index) => (
                            <tr key={Platform._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{Platform.platformName}</td>

                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleEditPlat(Platform)}>
                                  Edit
                                </button>
                                <button className='underline ml-2' onClick={() => deletePlat(Platform._id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='9' className='text-center py-4'>No Platform found</td>
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

export default CoodPlatForm
