import React, { useState, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import GenAccor from '../../../Components/Accordians/GenAccor';
import Select from 'react-select';
import { departmentAndPrograms } from '../AdmStudentCreate/ProgramData';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import SuccessMessage from '../../../Components/ConfirmationMessages/SuccessMessage';
import { Axios } from 'axios';

const AdmProgramCreate = ({ accordionId }) => {
  const [programTitle, setProgramTitle] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [DepartmentExist, setDepartmentExist] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDepartmentTermId, setSelectedDepartmentTermId] = useState(null);
  const [selectedProgramDepartmentId, setSelectedProgramDepartmentId] = useState(null);
  const [selectedProgramTermId, setSelectedProgramTermId] = useState(null);
  // const [TermOptions, setTermOptions] = useState([]);
  // const [selectedTerm, setSelectedTerm] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const [SelectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSpinner, setloadingSpinner] = useState(false);

  const [formErrors, setFormErrors] = useState({
    programTitle: '',
    shortCode: '',
    department: '',
  });

  useEffect(() => {
    initFlowbite();
    // if(!localStorage.getItem('key')){
    //   Navigate('/login');
    // }
    
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AdmProgramCreate';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    fetchDepartmentNames();
    
  }, []);
  useEffect(() => {
    fetchPrograms();
  }, []);
  // useEffect(() => {
  //   fetchFYPTerms();
  // }, []);


  console.log("Checking Program creation Dataaaaaaaaaaaaaaaaaaaaaa", programs);
  const fetchDepartmentNames = async () => {
    try {
      const apiUrl = '/api/auth/fetchDepartmentData'; 
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data department term", data);
        const deps = data;
        
        // setDepartmentsTerm(data.term)
        const departments = deps.departments.map(department => ({
          value: department._id, // Assuming department has an _id field
          label: department.departmentName, // Assuming department has a departmentName field
        
        }));
        setDepartmentExist(true);
        console.log("departments with term checking", departments);
        setDepartmentOptions(departments);
        
      } else  {
        console.log('Failed to fetch department names');
      }
    } catch (error) {
      console.error('Error fetching department names:', error);
    }
  };

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
  

  const fetchPrograms = async () => {
    console.log("Inside fetch Programs");
    try {
      setloadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch('/api/auth/fetchProgramData', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      
      const data = await response.json();
      console.log("checking programsssssssssssssss", data);
      // console.log("Fetched Programs:", data.programs);
      setPrograms(data.programs);
      //  console.log('Programs data', programs[0].department.departmentName);
    } catch (error) {
      console.error('Error fetching programs:', error.message);
    } finally {
      setloadingSpinner(false);
    }
  };

  const handleCloseModal = () => {
    setProgramTitle('');
    setShortCode('');
    setSelectedDepartment('');
    // setSelectedTerm('');
    setSelectedProgram(null);
    setShowModal(false);
  
  };
  


  const handleCreateProgram = async () => {
    console.log("Program Title", programTitle);
    console.log("Program Short Code", shortCode);
    console.log("Program Department", selectedDepartment);
    // console.log("Program Term", selectedTerm);
    try {
      setloadingSpinner(true);
      if (!validateForm()) {
        console.log('Program form has validation errors. Please fix them.');
        return;
      }

      const apiUrl = '/api/auth/createProgram'; // Update API endpoint
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          programTitle,
          shortCode,
          department: selectedDepartment.value,
          // term: selectedTerm.value,
          

          // Other program data if needed
        }),
        
      });
    

      if (response.ok) {
        // Handle successful response
        console.log('Program created successfully');
        setProgramTitle('');
        setShortCode('');
        setSelectedDepartment(null);
        // setSelectedTerm(null);
        // window.location.reload(true);
        setShowModal(false);

        const responseData = await response.json();
        const newProgramId = responseData.program._id;
      
      const newProgram = {
        _id: newProgramId, // Use actual ID returned by the server
        programTitle,
        shortCode,
        selectedDepartment: selectedDepartment.label,
        // selectedTerm: selectedTerm.value
      };
      setPrograms([newProgram, ...programs]);
      setConfirmationMessage('Program Created Successfully');
      setShowConfirmation(true);
      window.location.reload(true);
        
        // Additional actions after program creation if needed
      } else {
        console.log('Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
    }
    finally{
      setloadingSpinner(false);
    }
  };

  
  // const handleTermChange = (selectedOption) => {
    
  //   setSelectedTerm(selectedOption);

  // };

  // const handleProgramTitleChange = e => {
  //   setProgramTitle(e.target.value);
  //   setFormErrors({ ...formErrors, programTitle: '' }); // Clear programTitle error
  // };

  const handleProgramTitleChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z\s-]*$/; // Regular expression to match alphabets, spaces, and hyphens
    if (regex.test(inputValue)) {
      setProgramTitle(inputValue);
      setFormErrors({ ...formErrors, programTitle: '' }); // Clear programTitle error
    } else {
      setFormErrors({ ...formErrors, programTitle: 'Program Title should contain only alphabets, spaces, and hyphens.' });
    }
  };

  const handleShortCodeChange = e => {
    setShortCode(e.target.value);
    setFormErrors({ ...formErrors, shortCode: '' }); // Clear shortCode error
  };

  const handleDepartmentChange = selectedOption => {
    console.log("Departments data checking", selectedOption);
    setSelectedDepartment(selectedOption);
    setSelectedDepartmentId(selectedOption.value);
    // console.log("Department id inside handleChange", selectedOption.value)
    setSelectedDepartmentTermId(selectedOption.termId);
    // console.log("Checking Department's term id inside handleChange", selectedOption.termId);
    setFormErrors({ ...formErrors, department: '' }); // Clear department error
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      programTitle: '',
      shortCode: '',
      department: '',
    };

    if (!programTitle) {
      errors.programTitle = 'Program Title is required.';
      isValid = false;
    }
    if (!shortCode) {
      errors.shortCode = 'Short Code is required.';
      isValid = false;
    }
    if (!selectedDepartment) {
      errors.department = 'Department is required.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };



  const  handleEditProgram = (program) => {
    // console.log("Inside edit program", program.department)
    // console.log("Checking Program Id", program._id);
    // console.log("Checking proogram", program._id);
    // const program = programs.find(prog => prog.id === id);
    // if (program) {
      setSelectedProgram(program._id);
      setProgramTitle(program.programTitle);
      setShortCode(program.shortCode);
      
      // Safe check: department may be a populated object or a plain string ID
      if (program.department && typeof program.department === 'object' && program.department._id) {
        setSelectedDepartment({ value: program.department._id, label: program.department.departmentName });
        setSelectedProgramDepartmentId(program.department._id);
      } else if (program.department) {
        // department is a plain string ID — find the label from departmentOptions
        const depOption = departmentOptions?.find(d => d.value === program.department);
        setSelectedDepartment(depOption || { value: program.department, label: program.selectedDepartment || 'Unknown' });
        setSelectedProgramDepartmentId(program.department);
      } else {
        setSelectedDepartment(null);
        setSelectedProgramDepartmentId(null);
      }
      // setSelectedProgramTermId(program.term._id);
      // setSelectedTerm({ value: program.term._id, label: program.term.sessionTerm })
      

      setShowModal(true);
      setModalMode('edit');
    // }
  };

  const handleUpdateProgram = async (
    programId,
    updatedProgramTitle,
    updatedShortCode,
    selectedDepartmentId,
    // selectedTerm
  ) => {
    console.log("Inside handleUpdateProgram");
    console.log('ProgramId', programId);
    console.log('UpdatedProgramTitle',  updatedProgramTitle);
    console.log('UpdatedShortCode',  updatedShortCode);
    console.log('Selected Department ID',  selectedDepartmentId);
    // console.log('Selected Term',  selectedTerm.value);
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/updateProgramData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          programId: programId, // Assuming you have access to programId
          programTitle: updatedProgramTitle,
          shortCode: updatedShortCode,
          department: selectedDepartmentId.value,
          // term: selectedTerm.value,
         
        }),
      });
  
      if (response.ok) {
        // Handle successful update
        console.log('Program updated successfully');
        setProgramTitle('');
        setShortCode('');
        setSelectedDepartment(null);
        // setSelectedTerm(null);
         
        setShowModal(false);
        // window.location.reload(true);

        const updatedPrograms = programs.map((item) => {
          if (item._id === programId) {
            return {
              ...item,
              programTitle: updatedProgramTitle,
              shortCode: updatedShortCode,
              department: selectedDepartmentId.label,
            };
          }
          return item;
        });
        setPrograms(updatedPrograms);
        setConfirmationMessage('Program Updated Successfully');
        setShowConfirmation(true);
        window.location.reload(true);

      } else {
        // Handle update failure
        console.log('Failed to update program');
        // You may want to show an error message or perform other actions upon update failure
      }
    } catch (error) {
      console.error('Error updating program:', error);
      // Handle network errors or other errors
    } finally{
      setloadingSpinner(false);
    }
  };
  
  const handleProgramDelete = async (program) => {
    const programId = program._id;
    console.log("Delete program ", programId);
    console.log("Inside Delete Program ");
    try {
      const apiUrl = '/api/auth/deleteProgram';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ programId }), // Pass programId in the request body
      });
  
      if (response.ok) {
        // Handle successful deletion
        console.log('Program deleted successfully');
        // window.location.reload(true); 
        const updatedPrograms = programs.filter(item => item._id !== program._id);
        setPrograms(updatedPrograms);
        setConfirmationMessage('Program Deleted Successfully');
        setShowConfirmation(true);
        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete program');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      // Handle network errors or other errors
    }
  };

 



  

  const handleViewProgram = program => {
    setSelectedProgram(program);
    setProgramTitle(program.programTitle);
    setShortCode(program.shortCode);
    setSelectedDepartment({ value: program.department, label: program.department });
    setShowModal(true);
    setModalMode('view');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleSubmit = async (e) => {
    console.log('Handle Submit Called in Program Creation');
    e.preventDefault();
    if (loading) {
      return; // Prevent multiple clicks while loading
    }
  
    if (selectedProgram) {
      const programId = selectedProgram;
      console.log("Checking Selected Program id in handle submit",  programId);
      // handleUpdateProgram(programId,programTitle, shortCode, selectedDepartment, selectedTerm); 
      handleUpdateProgram(programId,programTitle, shortCode, selectedDepartment); 
    } else {
      handleCreateProgram(); // Call create department function
    }
  };
  // const handleCreateProgramCheck = () => {
  //   if (DepartmentExist) {
  //     setShowModal(true);
  //   } else {
  //     alert('Create Department first');
  //   }
  // };

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
            <p className="font-semibold text-white text-xl ml-6 pt-4">Program</p>
          </div>
          
          <div className="mt-12 ml-6">
          <Simple
                text={'Create'}
                onClick={() => setShowModal(true)}
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
                <p>{modalMode === 'edit' ? 'Edit Program' : 'Create Program'}</p>
              </div>
              <div className='mt-8'>
                <label htmlFor="programTitle" className="block mb-1 text-sm font-medium text-black">
                  Program Title
                </label>
                <input
                  type="text"
                  id="programTitle"
                  placeholder="Enter program title"
                  value={programTitle}
                  onChange={handleProgramTitleChange}
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  // required
                />
                {formErrors.programTitle && <p className='text-red-500 text-sm mt-1'>{formErrors.programTitle}</p>}
              </div>
              <div className='mt-4'>
                <label htmlFor="shortCode" className="block mb-1 text-sm font-medium text-black">
                  Short Code
                </label>
                <input
                  type="text"
                  id="shortCode"
                  placeholder="Enter short code"
                  value={shortCode}
                  onChange={handleShortCodeChange}
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  // required
                />
                {formErrors.shortCode && <p className='text-red-500 text-sm mt-1'>{formErrors.shortCode}</p>}
              </div>
              <div className='mb-4 mt-4 relative'>
                <label htmlFor='departmentDropdown' className=" mb-1 text-sm font-medium text-black">
                  Department
                </label>
                <Select
                  id='departmentDropdown'
                  name='departmentDropdown'
                  className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                  options={departmentOptions}
                  isSearchable
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                  placeholder='Select or type a Department'
                  maxMenuHeight={100}
                />
                {formErrors.department && <p className='text-red-500 text-sm mt-1'>{formErrors.department}</p>}
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
  isDisabled={modalMode === 'view'}
/>
                  {formErrors.selectedTerm && (
                    <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTerm}</p>
                  )}
              </div> */}
              <div className="flex justify-center mt-9">
  {selectedProgram ? (
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

        {/* Accordion for Programs */}
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className={`mt-1 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
          <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
            <GenAccor text="Created Programs" accordionId={accordionId} />
          </h2>

          <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`${showModal ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              {/* Timetable Table */}
              <div className="table-container overflow-x-auto relative h-72 overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-white     sticky top-0">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-28">Sr. No</th>
                      <th className="px-6 py-3">Program Title</th>
                      <th className="px-6 py-3">Short Code</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {programs.map((item, index) => {
  // console.log("Current item:", item.department.departmentName); 
  return (
    <tr key={index} className="text-center font-normal">
      <td className="px-6 py-4">{index + 1}</td>
      <td className="px-6 py-4">{item.programTitle}</td>
      <td className="px-6 py-4">{item.shortCode}</td>
      <td className="px-6 py-4">{item.department.departmentName}</td>
      
      <td className="px-6 py-4">
        <button className="underline mx-2" onClick={() => handleEditProgram(item)}>Edit</button>
        <button className="underline" onClick={() => handleProgramDelete(item)}>Dismiss</button>
      </td>
    </tr>
  );
})} */}


{Array.isArray(programs) && programs.length > 0 ? (
  programs.map((item, index) => {
    console.log('Current Program:', item._id); 
    return (
      <tr key={item._id} className="text-center font-normal">
        <td className="px-6 py-4">{index + 1}</td>
        <td className="px-6 py-4">{item.programTitle}</td>
        <td className="px-6 py-4">{item.shortCode}</td>
        
        <td className="px-6 py-4">
          {item.department && item.department.departmentName ? (
            item.department.departmentName
          ) : (
            item.department ? item.department : 'Hello'
          )}
        </td>
        <td className="px-6 py-4">
          <button className="underline mx-2" onClick={() => handleEditProgram(item)}>Edit</button>
          <button className="underline" onClick={() => handleProgramDelete(item)}>Dismiss</button>
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan='6' className='text-center py-4'>No Program Found</td>
  </tr>
)}


{/* {programs.map((item, index) => {
  console.log('Current Program:', item._id); 
  return (
    <tr key={item._id} className="text-center font-normal">
      <td className="px-6 py-4">{index + 1}</td>
      <td className="px-6 py-4">{item.programTitle}</td>
      <td className="px-6 py-4">{item.shortCode}</td>
      <td className="px-6 py-4">
        {item.department && item.department.departmentName ? (
          item.department.departmentName
        ) : (
          item.department ? item.department : 'Hello'
        )}
      </td>
      <td className="px-6 py-4">
        <button className="underline mx-2" onClick={() => handleEditProgram(item)}>Edit</button>
        <button className="underline" onClick={() => handleProgramDelete(item)}>Dismiss</button>
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

export default AdmProgramCreate;
