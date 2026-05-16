
import React, { useState, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import GenAccor from '../../../Components/Accordians/GenAccor';
import Select from 'react-select';
import { departmentAndPrograms } from '../AdmStudentCreate/ProgramData';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import SuccessMessage from '../../../Components/ConfirmationMessages/SuccessMessage';

const AdmCreateDepartment = ({ accordionId }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ViewDepartment, setViewDepartment] = useState(false);
  const [ActivatedFYPTerm,  setActivatedFYPTerm] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  // const [selectedTermID, setSelectedTermID] = useState(null);
  // const [selectedTerm, setSelectedTerm] = useState(null);
  const [TermOptions, setTermOptions] = useState([]);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [viewMode, setViewMode] = useState(false);


  
  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [formErrors, setFormErrors] = useState({
    departmentName: '',
    // description: '',
  });

  useEffect(() => {
    initFlowbite();
   
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AdmCreateDepartment';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    // Fetch department data when component mounts
    fetchDepartments();
  }, []);
  // useEffect(() => {
  //   fetchFYPTerms();
  // }, []);


 console.log("Activated Term checking", ActivatedFYPTerm);
  const fetchDepartments = async () => {
    setLoadingSpinner(true);
  
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch('/api/auth/fetchDepartmentData', {
        method: 'GET',
        headers: {
          
          // 'Content-Type': 'application/json',
          // You can add the authorization token here if required
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      
      const data = await response.json();
      
      setDepartments(data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error.message);
    }
    finally {
      setLoadingSpinner(false); // Set loading back to false after data is fetched
    }
  };

  const handleCreateDepartment = async () => {
    
    console.log("Handle Create Department called");
    console.log("Handle Create Department called");
    console.log("Handle Create Department called");
    console.log("Handle Create Department called");
    console.log("Handle Create Department called");
    console.log("Department Name", departmentName);
    // console.log("Department TErm", selectedTerm);
    console.log("Department Description", description);
    try {
      setLoadingSpinner(true); // Show loading spinner while processing
  
      // Fetch activated term ID
  
      if (validateForm()) {
        const apiUrl = '/api/auth/createDepartment';
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            departmentName,
            description,
            // term: selectedTerm.value,
          }),
        });
  // console.log("Request send");
  // console.log("Request send");
  // console.log("Request send");
  // console.log("Request send");
  // console.log("Request send");
  // console.log("Request send");
        if (response.ok) {
          // Handle successful response
          console.log('Department created successfully');
        
          // Clear form fields after successful creation
          setDepartmentName('');
          setDescription('');
          // setSelectedTerm('');
          setShowModal(false);
          // Fetch updated departments and update state
          // fetchDepartments();
          const responseData = await response.json();
          const newDepartmentId = responseData.department._id;
        
        const newDepartment = {
          _id: newDepartmentId, // Use actual ID returned by the server
          departmentName,
          description,
          // term: {
          //   _id: selectedTerm.value, 
          //   sessionTerm: selectedTerm.label,
          // }, // Assuming termId is available
        };
        setDepartments([newDepartment, ...departments]);
        setConfirmationMessage('Department Created Successfully');
        setShowConfirmation(true);
  
          // Perform any other actions after successful creation
  
        } else {
          console.log('Failed to create department');
        }
       
    }
    else{
      console.log("Else")
    }
   }
    catch (error) {
      console.error('Error creating department:', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }
  
  
  
  // const fetchFYPTerms = async () => {
  //   try {
  //     // Update API endpoint for fetching FYP terms
  //     const nkey = localStorage.getItem('key');
  //     const token = JSON.parse(nkey);
  //     const apiUrl = '/api/auth/getTermdata';
  
  //     const response = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (response.ok) {
  //       console.log("Inside Fetch FYP Terms 1");
  //       const data = await response.json();
        
  //       // Assuming data.fypTerms is an array of FYP term objects
  //       const fypTerms = data.fypTerms.map(term => ({
  //         value: term._id,
  //         label: term.sessionTerm,
  //         startDate: term.startDate,
  //         endDate: term.endDate,
  //         isActive: term.isActive, // Assuming each term object has an isActive boolean property
  //       }));
  
  //       // Sort terms based on activation status (active terms first)
  //       fypTerms.sort((a, b) => {
  //         if (a.isActive && !b.isActive) return -1; // 'a' comes before 'b' if 'a' is active and 'b' is inactive
  //         if (!a.isActive && b.isActive) return 1; // 'b' comes before 'a' if 'b' is active and 'a' is inactive
  //         return 0; // no change in order if both are active or inactive
  //       });
  
  //       // Set fypTermOptions from the sorted FYP terms
  //       const fypTermOptions = fypTerms.map(term => ({
  //         value: term.value,
  //         label: term.label,
  //         startDate: term.startDate,
  //         endDate: term.endDate,
  //       }));
  
  //       console.log("Inside Fetch FYP Terms 3");
  
  //       // Set TermOptions with activated terms on top
  //       setTermOptions(fypTermOptions);
  //     } else {
  //       console.log('Failed to fetch FYP terms');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching FYP terms:', error);
  //   }
  // };

 



  // const handleDepartmentNameChange = (e) => {
  //   setDepartmentName(e.target.value);
  //   setFormErrors({ ...formErrors, departmentName: '' }); // Clear departmentName error
  // };


  const handleDepartmentNameChange = (e) => {
    const value = e.target.value;
    // Allow alphabets, spaces, and hyphens
    if (/^[a-zA-Z\s-]*$/.test(value)) {
      setDepartmentName(value);
      setFormErrors({ ...formErrors, departmentName: '' }); // Clear departmentName error
    } else {
      setFormErrors({ ...formErrors, departmentName: 'Department name should contain only alphabets, spaces, and hyphens.' });
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    // setFormErrors({ ...formErrors, description: '' }); 
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      departmentName: '',
      // description: '',
    };

    if (!departmentName) {
      errors.departmentName = 'Department Name is required.';
      isValid = false;
    }
    // if (!description) {
    //   errors.description = 'Description is required.';
    //   isValid = false;
    // }

    setFormErrors(errors);
    return isValid;
  };



  const handleCloseModal = () => {
    setDepartmentName('');
    setDescription('');
    // setSelectedTerm('');
    setSelectedDepartment(null);
    setViewDepartment(false)
    setViewMode(false); 
    setShowModal(false);
  
  };

  const handleViewDepartment = (department) => {
    
    setSelectedDepartment(department);
    
    setDepartmentName(department.departmentName);
    // setSelectedTerm({ value: department.term._id, label: department.term.sessionTerm });
    setDescription(department.description);
    setViewDepartment(true);
    setViewMode(true);
    // setViewDepartment(true);
    setShowModal(true);
  };

  // const handleTermChange = (selectedOption) => {
  //   setSelectedTerm(selectedOption);
  // };


  const handleEditDepartment = (department) => {
    // setViewDepartment(false);
    console.log("in edit department ", department._id);
    setSelectedDepartment(department._id);
    setDepartmentName(department.departmentName);
    setDescription(department.description);
    // console.log("Selected Term", selectedTerm);
    // setSelectedTerm({ value: department.term._id, label: department.term.sessionTerm });
    setViewMode(false);
    setViewDepartment(false);
    
    setShowModal(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleUpdateDepartment = async (
    departmentId,
    updatedDepartmentName,
    updatedDescription,
    // selectedTermID
  ) => {
    
    console.log("Inside UpdateDepartment", departmentId)
    console.log("Inside UpdateDepartment", updatedDepartmentName)
    console.log("Inside UpdateDepartment", updatedDescription)
    // console.log("Inside UpdateDepartment", selectedTermID)
    try {
      setLoadingSpinner(true);
      const apiUrl = '/api/auth/updateDepartmentData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentId: departmentId,// Assuming you have access to selectedDepartment or departmentId
          departmentName: updatedDepartmentName,
          description: updatedDescription,
          // term: selectedTermID,
        }),
      });
  
      if (response.ok) {
        // Handle successful update
        console.log('Department updated successfully');
        setDepartmentName('');
        setDescription('');
        setSelectedDepartment(null); // Clear selected Department if needed
        setShowModal(false);
        const updatedDepartments = departments.map((item) => {
          if (item._id === departmentId) {
            return {
              ...item,
              departmentName: updatedDepartmentName,
              description: updatedDescription,
            };
          }
          return item;
        });
        setDepartments(updatedDepartments);
        setConfirmationMessage('Department Updated Successfully');
        setShowConfirmation(true);
        // window.location.reload(true);
       
      } else {
        // Handle update failure
        console.log('Failed to update department');
        // You may want to show an error message or perform other actions upon update failure
      }
    } catch (error) {
      console.error('Error updating department:', error);
      // Handle network errors or other errors
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleDeleteDepartment = async (department) => {
    console.log("Inside Delete Department front end");
    try {
      setLoadingSpinner(true);
      const apiUrl = `/api/auth/deleteDepartment/${department._id}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Handle successful deletion
        console.log('Department deleted successfully');
        const updatedDepartments = departments.filter(item => item._id !== department._id);
        setDepartments(updatedDepartments);
        setConfirmationMessage('Department Deleted Successfully');
        setShowConfirmation(true);

        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete department');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      // Handle network errors or other errors
    }
    finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  };
  
 

  const handleSubmit = async (e) => {
    console.log('Handle Submit Called');
    e.preventDefault();
    if (loading) {
      return; // Prevent multiple clicks while loading
    }
  
    if (selectedDepartment) {
      const departmentId = selectedDepartment;
      console.log("Checking Selected Department id in handle submit", departmentId);
      // handleUpdateDepartment(departmentId,departmentName, description, selectedTerm.value); 
      handleUpdateDepartment(departmentId,departmentName, description); 
    } else {
      handleCreateDepartment(); 
    }
  };
  
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
            <p className="font-semibold text-white text-xl ml-6 pt-4">Department</p>
          </div>
          <div className="mt-12 ml-6">
            {/* <Simple text={'Create'} onClick={() => setShowModal(true)} /> */}

            <Simple
                text={'Create'}
                onClick={async () => {
                 
                  if (ActivatedFYPTerm) {
                    setShowModal(true);
                  } else {
                    alert('There is no term active currently');
                  }
                }}
              />
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg w-[31.25rem] h-[33.125rem] relative">
            <form onSubmit={handleSubmit}>
              <button
                className="absolute top-2 right-2 text-gray-600 focus:outline-none"
                onClick={() => handleCloseModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className='font-bold text-xl flex flex-row justify-center'>
                {/* <p>{selectedDepartment ? 'View Department' : 'Create Department'}</p> */}
                <p>
  {selectedDepartment && !ViewDepartment ? 'Edit Department' : ''}
  {selectedDepartment && ViewDepartment ? 'View Department' : ''}
  {!selectedDepartment ? 'Create Department' : ''}
</p>
              </div>
            
              <div className='mt-8'>
                <label htmlFor="departmentName" className="block mb-1 text-sm font-medium text-black">
                  Department Name
                </label>
                <input
                  type="text"
                  id="departmentName"
                  placeholder="Enter department name"
                  value={departmentName}
                  onChange={handleDepartmentNameChange}
                  readOnly={viewMode}
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  // required
                />
                {formErrors.departmentName && <p className='text-red-500 text-sm mt-1'>{formErrors.departmentName}</p>}
              </div>
              {/* <div className='mb-4 mt-4 relative'>
                <label htmlFor='departmentDropdown' className=" mb-1 text-sm font-medium text-black">
                  Term
                </label>
                <Select
  id='termDropdown'
  name='termDropdown'
  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
  options={TermOptions}
  isSearchable
  onChange={handleTermChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
  value={selectedTerm}
  placeholder='Select or type term'
  maxMenuHeight={100}
  isDisabled={viewMode}
/>
                  {formErrors.selectedTerm && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTerm}</p>
                  )}
              </div> */}
              <div className='mt-4'>
                <label htmlFor="description" className="block mb-1 text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter department description"
                  value={description}
                  onChange={handleDescriptionChange}
                  readOnly={viewMode}
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  rows={7}
                  style={{ resize: 'none' }}
                  // required
                />
                {/* {formErrors.description && <p className='text-red-500 text-sm mt-1'>{formErrors.description}</p>} */}
              </div>
              <div className="flex justify-center mt-9">
              {!ViewDepartment && (
  selectedDepartment ? (
    <button type="submit" className="bg-primary hover:bg-slate-700 text-white font-bold py-2 px-12 mt-2 rounded">
      Update
    </button>
  ) : (
    <button type="submit" className="bg-primary hover:bg-secondary text-white font-bold py-2 px-12 mt-2 rounded">
      Create
    </button>
  )
)}
</div>
              </form>
            </div>
          </div>
        )}

        {/* Accordion for Departments */} 
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className={`mt-1 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Created Departments" accordionId={accordionId} />
      </h2>

      <div id={`accordion-collapse-body-timetable-${accordionId}`}  className={`${
              showModal ? 'hidden' : ''
            } transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative h-72 overflow-y-auto">
                <div className='bg-white text-sm'>
              
            </div>
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white     sticky top-0">
                    <tr className='border-b text-center'>
                    <th className="px-6 py-3 w-28">Sr. No</th>
                    <th className="px-6 py-3">Department Name</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(departments) && departments.length > 0 ? (
  departments.map((item, index) => {
    const srno = index + 1;

    return (
      <tr key={index} className="text-center font-normal">
        <td className="px-6 py-4">{srno}</td>
        <td className="px-6 py-4">{item.departmentName}</td>
        <td className="px-6 py-4">
          <button className="underline" onClick={() => handleViewDepartment(item)}>View</button>
        </td>
        <td className="px-6 py-4">
          <button className="underline mx-2" onClick={() => handleEditDepartment(item)}>Edit</button>
          <button className="underline" onClick={() => handleDeleteDepartment(item)}>Delete</button>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan='6' className='text-center py-4'>No Department Found</td>
  </tr>
)}


                    
                        {/* {departments.map((item, index) => {
                    const srno = index + 1;

                    return (
                        <tr key={index} className="text-center font-normal">

                        <td className="px-6 py-4">{srno}</td>
                        <td className="px-6 py-4">{item.departmentName}</td>
                        <td className="px-6 py-4"><button className="underline"  onClick={() => handleViewDepartment(item)}>View</button></td>
                        <td className="px-6 py-4">
                            
                            <button className="underline mx-2" onClick={() => handleEditDepartment(item)}>Edit</button>
                            <button className="underline" onClick={() => handleDeleteDepartment(item)}>Delete</button>
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

      </div>
    )}
    </>
  );
};

export default AdmCreateDepartment;
