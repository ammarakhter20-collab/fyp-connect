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

const HoDCourseCatalog = ({ accordionId }) => {
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
      const tabName = 'HoDCourseCatalog';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    fetchProgram();
    fetchCourseCatalogue();
  }, []);

  useEffect(() => {
    const results = CourseCat.filter(item => item.fileTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredData(results);
  }, [searchTerm, CourseCat]);


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
        programs.unshift({ value: 'All', label: 'All' });

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


  const handleFilterClick = (option) => {
    if (option.value === 'All') {
      setFilteredData(CourseCat);
    } else {
      const filtered = CourseCat.filter(proj => proj.program.programTitle === option.label);
      setFilteredData(filtered);
    }
  };



  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className='mx-16 mt-10'>
          
         
          <div className="flex justify-end my-3">
            <FilterButton dropdownOptions={ProgramOptions} text="Filter" onClick={handleFilterClick} />
          </div>
         
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
                        <th className="px-6 py-3 w-[51.25rem] text-left">File Title</th>
                        <th className="px-6 py-3 w-48">Program</th>
                        <th className="px-6 py-3 w-52">Uploaded By</th>
                        <th className="px-6 py-3 w-48">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData && filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <tr key={index} className="text-center">
                            <td className="px-6 py-4 font-semibold">{serialCounter++}</td>
                            <td className="px-6 py-4 font-semibold text-left">{item.fileTitle}</td>
                            <td className="px-6 py-4 font-semibold">{item.program.shortCode}</td>
                            <td className="px-6 py-4 font-semibold">{item.genUser.role}</td>
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

export default HoDCourseCatalog;
