import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react';
import { MdCloudDownload } from "react-icons/md";
import { AiOutlineSearch } from 'react-icons/ai';
import GenAccor from "../../../Components/Accordians/GenAccor";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const CourseCatalog = ({accordionId}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [CourseCat, setCourseCat] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [filteredData, setFilteredData] = useState([]);  
  const navigate = useNavigate();
  let serialCounter = 1;
  
  useEffect(() => {
    initFlowbite();
    if(!localStorage.getItem('key')){
      navigate('/login');
    }
    
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CourseCatalog';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, [navigate]);

  useEffect(() => {
    fetchCourseCatalogue();
  }, []); // Run once when component mounts

  const fetchCourseCatalogue = async () => {
    try {
      setLoadingSpinner(true);
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const programId = userData.program;
      const token = JSON.parse(localStorage.getItem('key')); 

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`/api/coursecat/fetchCourseCat/${programId}`, config);
      
      if(response.status === 200){
        setCourseCat(response.data);
      }
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      throw error;
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    const filtered = CourseCat.filter(item =>
      item.fileTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, CourseCat]);

  console.log("Checking Filtered Course Cat Data", filteredData);

  return (
    <>
    {loadingSpinner ? ( // Show loading spinner while loading is true
    <LoadingSpinner />
  ) : (
   <div className='mx-16 mt-10'>
     <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Templates" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
          {/* Timetable Table */}
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
              
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
              
                <tr className='border-b text-center'>
                  <th className="px-6 py-3  w-32">Serial no.</th>
                  <th className="px-6 py-3  w-[51.25rem] text-left">File Title</th>
                  <th className="px-6 py-3  w-48">Program</th>
                  <th className="px-6 py-3  w-52">Uploaded By</th>
                  <th className="px-6 py-3  w-48">Download</th>
                </tr>
              </thead>
              <tbody>
              
{/*                 
              {filteredData && filteredData.map((item, index) => (
  <tr key={index} className=" text-center">
    <td className="px-6 py-4  font-semibold">{serialCounter++}</td>
    <td className="px-6 py-4  font-semibold text-left">{item.fileTitle}</td>
    <td className="px-6 py-4  font-semibold">{item.program.shortCode}</td>
    <td className="px-6 py-4  font-semibold">{item.genUser.role}</td>
    <td className="px-6 py-4  font-semibold flex items-center justify-center">
      {item.pdfFile && (
        <a
          href={`/${item.pdfFile.replace(/\\/g, '/')}`}
          download={`file_${serialCounter}.pdf`} // Use serialCounter for dynamic filename
          target="_blank"
          rel="noopener noreferrer"
          className='text-center'
        >
          <MdCloudDownload style={{ fontSize: "1.5rem" }} />
        </a>
      )}
    </td>
  </tr>
))} */}

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
            href={`/${item.pdfFile.replace(/\\/g, '/')}`}
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

export default CourseCatalog;
