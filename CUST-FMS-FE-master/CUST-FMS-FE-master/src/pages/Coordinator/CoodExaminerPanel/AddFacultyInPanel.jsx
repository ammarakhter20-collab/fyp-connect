import React, { useState, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const AddFacultyInPanel = ({panelData, programsData, facultyData, onSave, onClose }) => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedFaculty, setSelectedFacutly] = useState('');
  const [programOptions, setProgramOptions] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [loadingSpinner, setloadingSpinner] = useState(false);


  console.log("FacultyDataaaaaaaaaaaaaaaaaaaaaaa", facultyData);
  
console.log("Checking Panelllllllllll", panelData);

  console.log("programData", programsData);

  useEffect(() => {
    const programOption = programsData.map(prog => ({
      value: prog.value, // Change from prog._id to prog.value
      label: prog.label,
    }));
    setProgramOptions(programOption);
  }, [programsData]);

  const handleProgramChange = async (selectedOption) => {
    setSelectedProgram(selectedOption);
   
  }
  useEffect(() => {
    console.log("Function Calledddddddd filtereing", facultyData);
    console.log("selected Program", selectedProgram);
    if (selectedProgram) {
      const filtered = facultyData.filter(faculty => {
        console.log("faculty.programId:", faculty.program._id);
        console.log("selectedProgram:", selectedProgram);
        return faculty.program._id === selectedProgram.value;
      });
      console.log("cheecking filtered Faculty", filtered);
      const faculty = filtered.map(fac => ({
        value: fac.value, // Change from prog._id to prog.value
        label: fac.label,
      }));
      setFacultyOptions(faculty);
    } else {
      setFacultyOptions([]);
    }
  }, [selectedProgram])

  const handleFacultyChange = (selectedOption) => {
     setSelectedFacutly(selectedOption);
  }

  const filterFacultyFromProgram = () => {
 
  }



  const handleSaveClick = async () => {
    console.log("Save Calleddddddd");
    console.log("selectedProgram", selectedProgram);
    console.log("selectedFaculty", selectedFaculty);
    console.log("selected Panel", panelData[0].PanelMembers);
  
    const panelId = panelData[0]._id; // Assuming panelData is an object containing the panel details, including its _id
    const member = selectedFaculty.value;
    
    // Check if the selected faculty is already in the panel
   const facultyExists = panelData[0].PanelMembers.some(member => {
  console.log("Member _id:", member._id);
  console.log("Selected Faculty value:", selectedFaculty.value);
  return member._id === selectedFaculty.value;
});
    
    if (facultyExists) {
      alert('Faculty already exists in the panel.');
      return; // Exit the function if faculty already exists
    }
  
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/manageexampanels/add-faculty-member'; // Update API endpoint for updating faculty
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'PATCH', // Change method to PATCH
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          panelId,
          member
         }), // Pass facultyId and updated data in the request body
      });
      console.log("request senttttttttttttttttttt");
  
      if (response.ok) {
        // Handle successful update
        console.log('Faculty updated successfully');
        window.location.reload();
        // You may perform additional actions here if needed
      } else {
        // Handle update failure
        console.log('Failed to add faculty in Panel');
        // You may want to show an error message or perform other actions upon update failure
      }
    } catch (error) {
      console.error('Error :', error);
      // Handle network errors or other errors
    } finally {
      setloadingSpinner(false);
    }
  };

  return (
    <>
         {loadingSpinner ? (
          <LoadingSpinner />
        ) : (
    <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
      <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative ">
        <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className='font-bold text-xl flex flex-row justify-center'>
          <p>Add Faculty</p>
        </div>
        <form>
          <div className='flex flex-col mt-1'>
            <label htmlFor='programDropdown' className='mb-1 text-sm font-medium text-black'>
              Program
            </label>
            <Select
              id='programDropdown'
              name='programDropdown'
              className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
              options={programOptions}
              onChange={handleProgramChange}
              value={selectedProgram}
              placeholder='Select Program'
            />
          </div>
          <div className='flex flex-col mt-1'>
            <label htmlFor='facultyDropdown' className='mb-1 text-sm font-medium text-black'>
              Faculty
            </label>
            <Select
              id='facultyDropdown'
              name='facultyDropdown'
              className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
              options={facultyOptions}
              onChange={handleFacultyChange}
              value={selectedFaculty}
              placeholder='Select Faculty'
            />
          </div>
          <div className="col-span-1 flex justify-center my-2">
            <Simple text={'Add'} type="Submit" onClick={handleSaveClick} />
          </div>
        </form>
      </div>
    </div>
        )}
  </>

  );
};

export default AddFacultyInPanel;
