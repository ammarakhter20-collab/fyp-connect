import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import CardOnebutton from '../../../../Components/Cards/CardOnebutton';
import Simple from '../../../../Components/Buttons/Simple';

import GenAccor from '../../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const CoodCategory = ({accordionId}) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [Cat, setCat] = useState('');
  const [SelectedCat, setSelectedCat] = useState('');
  const [Category, setCategory] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [errors, setErrors] = useState({});


  

  useEffect(() => {
    initFlowbite();
    // if(!localStorage.getItem('key')){
    //   Navigate('/login');
    // }
    
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCreateCategories';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect (() => {
    CatData();
  }, [])
console.log("Categoryssssssssssssssssss", Category);
  const clearForm = () => {
    setCat('');
  };


  const handleAddCategory = () => {
    setShowCategoryForm(true);
  }

  const validateForm = () => {
    const errors = {};
    if (!Cat.trim()) {
      errors.cat = 'Category Name is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCat = (e) => {
setCat(e.target.value);
setErrors((prevErrors) => ({ ...prevErrors, cat: '' }));
  }

  const updateCategory = async (CatId, updCat) => {
    const id = CatId;
    const category = updCat;
    console.log("CatIddddddddddddd in update Catnolgy", CatId);
    console.log("Updated Category", updCat);

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      // const userId = user._id;
      const response = await fetch(`/api/category/UpdCategory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ category }),
      });

      console.log("Request Sentttttttttttttttt");

      if (!response.ok) {
        throw new Error('Failed to update Category');
      }
      else{

      const data = await response.json();
      console.log('Updated Category:',data);
      window.location.reload();
    }
    } catch (error) {
      console.error('Error updating Category:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  }

  const deleteCat = async (tDel) => {
    console.log("Delete Category ", tDel);
    const id = tDel;
        try {
          setLoadingSpinner(true);
          const apiUrl = `/api/category/DelCategories/${id}`; // Update API endpoint for deleting faculty
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
            console.log('Category deleted successfully');
            window.location.reload();
      
            // Perform any other actions you need after successful deletion
          } else {
            // Handle delete failure
            console.log('Failed to delete Category');
            // You may want to show an error message or perform other actions upon deletion failure
          }
        } catch (error) {
          console.error('Error deleting Category:', error);
          // Handle network errors or other errors
        } finally {
          setLoadingSpinner(false);
        
        }
  }

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
  

  const handleCreateCategory = async () => {
    clearForm();

    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      // const userId = user._id;
      const CatName = Cat;
      console.log("CatNameeeeeeeeeeeeeeeeeeeee", CatName);
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const apiUrl = `/api/category/AddCategory`;

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: CatName,
          }),
      });
      if (response.ok) {
          // Handle successful response
          console.log(' Category Created successfully');
          window.location.reload();
      } else {
          console.log('Failed to Create Category ');
      }
  } catch (error) {
      console.error('Error in Creating Category:', error.message);
  } finally {
      setLoadingSpinner(false);
  }
  }; 

  const handleEditCat = (Category) => {
    console.log("Category inside edit", Category);
setSelectedCat(Category._id);
setCat(Category.category);
setShowCategoryForm(true);
        setModalMode('edit');
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (SelectedCat) {
        const CatId = SelectedCat;
        updateCategory(CatId, Cat);
      } else {
        handleCreateCategory();
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
                            <CardOnebutton title={"Add Category"} butText={"Add"} onClick={handleAddCategory} />
                        </div>
                    </div>
                  
          

                {showCategoryForm && (  
                    <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative " /*ref={cardRef}*/>
                            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowCategoryForm(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {/* <RxCross2 /> */}
                            </button>
                            <div>
                            <div className='font-bold text-xl flex flex-row justify-center'>
                    <p>{modalMode === 'edit' ? 'Edit Category' : 'Add Category'}</p>
                  </div>
                                <form>
                                   
                                <div className="my-4">
                      <label htmlFor="AddCat" className="block text-md font-semibold text-gray-700">
                        Category Name
                        <input
                          id="AddCat"
                          name="Add Category"
                          type="text"
                          value={Cat}
                          onChange={handleAddCat}
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.cat ? 'border-red-500' : ''}`}
                        />
                        {errors.cat && <p className="text-red-500 text-sm">{errors.cat}</p>}
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

<div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5 `}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text='Created Category' accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
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
                        <th className='px-20 py-3'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    


{Array.isArray(Category) && Category.length > 0 ? (
  Category.map((Category, index) => (
    <tr key={Category._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{Category.category}</td>
 
<td className='px-6 py-4'>
        <button className='underline mx-2' onClick={() => handleEditCat(Category)}>
          Edit
        </button>
        <button className='underline ml-2' onClick={() => deleteCat(Category._id)}>
          Delete
        </button>
      </td>
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

export default CoodCategory
