import React, { useEffect, useState } from 'react'


import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const HoDCategories = ({accordionId}) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [Cat, setCat] = useState('');
  const [SelectedCat, setSelectedCat] = useState('');
  const [Category, setCategory] = useState([]);
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
      const tabName = 'HoDExaminerPanel';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect (() => {
    CatData();
  }, [])
console.log("Categoryssssssssssssssssss", Category);

 

  const CatData = async () => {
    try {
      setLoadingSpinner(true);
  
      const apiUrl = '/api/category/GetCategories'; // Update API endpoint for fetching faculties
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
        setCategory(responseData); // Update the faculties state with fetched data
        console.log("Checking Category Data", responseData);
      } else {
        console.log('Failed to fetch Category');
      }
    } catch (error) {
      console.error('Error fetching Category:', error);
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
              <GenAccor text='Categories' accordionId={accordionId} />
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
                        <th className='px-20 py-3'>Category Name</th>
                    
                      </tr>
                    </thead>
                    <tbody>
                    


{Array.isArray(Category) && Category.length > 0 ? (
  Category.map((Category, index) => (
    <tr key={Category._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{Category.category}</td>
 

    </tr>
  ))
) : (
  <tr>
    <td colSpan='9' className='text-center py-4'>No Category found</td>
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

export default HoDCategories
