import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react';
import { MdCloudDownload } from "react-icons/md";
import { AiOutlineSearch } from 'react-icons/ai';
import GenAccor from "../../../Components/Accordians/GenAccor";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import Select from 'react-select';
import Simple from '../../../Components/Buttons/Simple';
import FilterButton from '../../../Components/Buttons/FilterButton';
import { baseUrl } from '../../../Components/config/config';

const CoodCourseCat = ({ accordionId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseCatModal, setShowCourseCatModal] = useState(false);
  const [catalogTitle, setCatalogTitle] = useState('');
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [CourseCat, setCourseCat] = useState([]);
  const [ProgramOptions, setProgramOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  let serialCounter = 1;

  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodCourseCat';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    fetchProgram();
    fetchCourseCatalogue();
  }, []);

  const fetchCourseCatalogue = async () => {
    try {
      setLoadingSpinner(true);
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const departmentId = userData.department;
      console.log("CHecking Department ID on front end", departmentId);
      const token = JSON.parse(localStorage.getItem('key')); 

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`/api/coursecat/fetchCourseCatOfParticularDep/${departmentId}`, config);
      
      if(response.status === 200){
        console.log("Checkingggggggggggggggggggggggggggggg Cat", response.data);
        setCourseCat(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      throw error;
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleProgramChange = (selectedOption) => {
    setSelectedProgram(selectedOption);
    setFormErrors(prevErrors => ({ ...prevErrors, selectedProgram: '' }));
  };

  const fetchProgram = async () => {
    try {
      setLoadingSpinner(true);
      const apiUrl = '/api/auth/fetchProgramData';
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

        // Filter programs based on departmentId
        const programs = data.programs.map(program => ({
          value: program._id,
          label: program.programTitle,
        }));

        // Add an "All" option
        // programs.unshift({ value: 'All', label: 'All' });

        // Set the filtered programs in the state
        setProgramOptions(programs);
      } else {
        console.log('Failed to fetch programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const createCourseCatalog = async (program, fileTitle, genUser, file) => {
    try {
      setLoadingSpinner(true);
      const token = JSON.parse(localStorage.getItem('key'));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Important for file upload
        }
      };

      // Create FormData object to send file and other data
      const formData = new FormData();
      formData.append('program', program);
      formData.append('fileTitle', fileTitle);
      formData.append('genUser', genUser);
      formData.append('pdfFile', file); // Ensure the key matches the backend field name

      const response = await axios.post(`/api/coursecat/AddCourseCat`, formData, config);

      if (response.status === 201) {
        setCourseCat(prevCourseCats => [...prevCourseCats, response.data]);
        setFilteredData(prevCourseCats => [...prevCourseCats, response.data]);
        window.location.reload(true);
      }
    } catch (error) {
      console.error('Error creating course catalog:', error);
      throw error;
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleCatalogTitle = (e) => {
    setCatalogTitle(e.target.value);
    setFormErrors(prevErrors => ({ ...prevErrors, catalogTitle: '' }));
  };

  const handleAddCourseCat = () => {
    setShowCourseCatModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFormErrors(prevErrors => ({ ...prevErrors, selectedFile: '' }));
  };

  const handleDeleteCourseCat = async(CourseCatId) => {

    // console.log("Course Catalog Idd to Delete", CourseCatId);


try {
    setLoadingSpinner(true);

    const nkey = localStorage.getItem('key');
    const token = JSON.parse(nkey);
    const response = await fetch(`/api/coursecat/DeleteCourseCat/${CourseCatId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
       
    });
    console.log("Requestttttttttt senttttttt");

    if (response.ok) {
        const data = await response.json();
     
        console.log('Course Catalog Deleted successfully');
        window.location.reload(true);
      // Reload the page or update the UI as needed
    } else {
        console.error('Failed to Delete Course Catalog');
    }
} catch (error) {
    console.error('Error Deleting Course Catalog:', error);
} finally {
    setLoadingSpinner(false);
}
  }

  const handleFilterClick = (option) => {
    if (option.value === 'All') {
      setFilteredData(CourseCat);
    } else {
      const filtered = CourseCat.filter(proj => proj.program.programTitle === option.label);
      setFilteredData(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!selectedProgram) errors.selectedProgram = 'Please select a program';
    if (!catalogTitle) errors.catalogTitle = 'Please enter a file title';
    if (!selectedFile) errors.selectedFile = 'Please upload a file';
    
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const User = JSON.parse(localStorage.getItem('user'));
      const genUser = User._id;
      await createCourseCatalog(selectedProgram.value, catalogTitle, genUser, selectedFile);
      setShowCourseCatModal(false);
    } else {
      console.error('Please fill all fields and select a file');
    }
  };

  useEffect(() => {
    const results = CourseCat.filter(item => item.fileTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredData(results);
  }, [searchTerm, CourseCat]);

  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className='mx-16 mt-10'>
          <div className='w-[21%] mb-5'>
            <div id="cardOneButton">
              <CardOnebutton title={"Course Catalog"} butText={"Add"} onClick={handleAddCourseCat} />
            </div>
          </div>
         
          <div className="flex justify-end my-3">
            <FilterButton dropdownOptions={ProgramOptions} text="Filter" onClick={handleFilterClick} />
          </div>
          {showCourseCatModal && (
            <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
              <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowCourseCatModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div>
                  <div className='font-bold text-xl flex flex-row justify-center'>
                    <p>{'Add Catalog'}</p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className='mt-1'>
                      <label htmlFor='programDropdown' className='mb-1 text-sm font-medium text-black'>
                        Program
                      </label>
                      <Select
                        id='programDropdown'
                        name='programDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${formErrors.selectedProgram ? 'border-red-500' : ''}`}
                        options={ProgramOptions}
                        isSearchable
                        onChange={handleProgramChange}
                        value={selectedProgram}
                        placeholder='Select or type a Program'
                        maxMenuHeight={100}
                      />
                      {formErrors.selectedProgram && <p className="text-red-500 text-xs mt-1">{formErrors.selectedProgram}</p>}
                    </div>
                    <div className="my-4">
                      <label htmlFor="fileTitle" className="block text-md font-semibold text-gray-700">
                        File Title
                        <input
                          id="fileTitle"
                          name="fileTitle"
                          type="text"
                          value={catalogTitle}
                          onChange={handleCatalogTitle}
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${formErrors.catalogTitle ? 'border-red-500' : ''}`}
                        />
                      </label>
                      {formErrors.catalogTitle && <p className="text-red-500 text-xs mt-1">{formErrors.catalogTitle}</p>}
                    </div>
                    <div className="my-4">
                      <label htmlFor="fileUpload" className="block text-md font-semibold text-gray-700">
                        Upload File
                        <input
                          id="fileUpload"
                          name="fileUpload"
                          type="file"
                          onChange={handleFileChange}
                          className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${formErrors.selectedFile ? 'border-red-500' : ''}`}
                        />
                      </label>
                      {formErrors.selectedFile && <p className="text-red-500 text-xs mt-1">{formErrors.selectedFile}</p>}
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                      <Simple text={'Add'} type="Submit" onClick={handleSubmit} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text="Templates" accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                <div className="table-container overflow-x-auto relative">
                  <div className="flex justify-end items-center">
                    <div className="relative">
                      <AiOutlineSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-2 py-2 border text-xs border-gray-300 rounded-full"
                      />
                    </div>
                  </div>
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3 w-32">Serial no.</th>
                        <th className="px-6 py-3 w-[31.25rem] text-left">File Title</th>
                        <th className="px-6 py-3 w-48">Program</th>
                        <th className="px-6 py-3 w-52">Uploaded By</th>
                        <th className="px-6 py-3 w-48">Download</th>
                        <th className="px-6 py-3 w-48">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData && filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <tr key={index} className="text-center">
                            <td className="px-6 py-4 font-semibold">{serialCounter++}</td>
                            <td className="px-6 py-4 font-semibold text-left">{item.fileTitle}</td>
                            <td className="px-6 py-4 font-semibold">{item.program.shortCode}</td>
                            <td className="px-6 py-4 font-semibold">{item.genUser.name}</td>
                            <td className="px-6 py-4 font-semibold flex items-center justify-center">
                              {item.pdfFile && (
                                <a
                                  href={`${baseUrl}/${item.pdfFile.replace(/\\/g, '/')}`}
                                  download={`file_${serialCounter}.pdf`} // Use serialCounter for dynamic filename
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-center"
                                >
                                  <MdCloudDownload style={{ fontSize: "1.5rem" }} />
                                </a>
                              )}
                            </td>
                            <td className='px-6 py-4'>
                  <button className='underline mx-2' onClick={() => handleDeleteCourseCat(item._id)}>
                    Delete
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
      )}
    </>
  );
};

export default CoodCourseCat;
