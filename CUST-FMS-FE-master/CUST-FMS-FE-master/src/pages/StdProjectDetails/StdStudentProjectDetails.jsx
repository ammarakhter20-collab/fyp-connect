import React, { useEffect, useState } from 'react';
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import { BsUpload } from "react-icons/bs";
import Modal from '../../Components/Modal/reqModal'; // Import your modal component
import Simple from '../../Components/Buttons/Simple';
import ButbgGray from '../../Components/Buttons/ButbgGray';
import axios from 'axios';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import ShowAllUploadedReports from './ShowAllUploadedReports';

const StudentProjectDetails = ({ data, accordionId, onOptSelect, onReportSelect, FetchedGroupReports }) => {
  const { srno, fyptitle, term, status } = data;
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file
  const [ShowUploadedReports, setShowUploadedReports] = useState(false); // State to hold the selected file
  const [isLoading, setIsLoading] = useState(false);
  const [displayReports, setDisplayReports] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  // useEffect (() => {
  //   fetchUploadedReports();
  // }, [])

  console.log("CHecking Fetched Reportsssssssssss", FetchedGroupReports);



  const handleReportClick = () => {
    setShowReportModal(true);
    onReportSelect(true); // If needed to notify the parent component
  };

  const handleDetailsViewClick = () => {
    onOptSelect(true);
  };

 const handleReportViewClick = () => {
  console.log("View Report clickedddddddddddddddddd");
  setShowUploadedReports(true);
  setDisplayReports(true);
 }
 console.log("CHecking Show Reprots statussssssssssss", ShowUploadedReports);
  const closeModal = () => {
    setShowReportModal(false);
  };
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    // Logic to upload the file goes here
    console.log("File uploaded:", selectedFile);
    closeModal(); // Close the modal after file upload
  }

  const BackToPrevious = () => {
    setDisplayReports(false);
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : displayReports ? (
        <ShowAllUploadedReports accordionId={206} handleBack = {BackToPrevious} FetchedGroupReports = {FetchedGroupReports}/>
      ) : (
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-20'>
          <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
            <GenAccor text="Student Project Details" accordionId={accordionId} />
          </h2>
  
          <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              <div className="table-container overflow-x-auto relative">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-52">Sr no</th>
                      <th className="px-6 py-3 w-[15.625rem] text-left">FYP Title</th>
                      <th className="px-6 py-3 w-52">Term</th>
                      <th className="px-6 py-3 w-52">Status</th>
                      <th className="px-6 py-3 w-52">Details</th>
                      <th className="px-6 py-3 w-52">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center font-normal">
                      <td className="px-6 py-4">{srno}</td>
                      <td className="px-6 py-4 text-left">{fyptitle}</td>
                      <td className="px-6 py-4">{term}</td>
                      <td className="px-6 py-4">{status}</td>
                      <td className="px-6 py-4">
                        <button className="underline font-normal text-black hover:text-gray-500" onClick={handleDetailsViewClick}>
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button className="underline font-normal text-black hover:text-gray-500" onClick={handleReportViewClick}>
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentProjectDetails;
