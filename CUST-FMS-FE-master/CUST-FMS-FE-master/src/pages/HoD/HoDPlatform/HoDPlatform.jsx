import React, { useEffect, useState } from 'react'


import { initFlowbite } from 'flowbite';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';

const HoDPlatform = ({accordionId}) => {
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
      const tabName = 'HoDPlatform';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect (() => {
    PlatData();
  }, [])
console.log("Platformssssssssssssssssss", Platform);


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
  


  return (
    <>
        {loadingSpinner ? ( // Show loading spinner while loading is true
            <LoadingSpinner />
        ) : (
            <div className="mx-16 mt-10">
             

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
                      </tr>
                    </thead>
                    <tbody>
                    


{Array.isArray(Platform) && Platform.length > 0 ? (
  Platform.map((Platform, index) => (
    <tr key={Platform._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{Platform.platformName}</td>

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

export default HoDPlatform
