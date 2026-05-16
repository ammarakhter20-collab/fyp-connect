import React, { useEffect, useState } from 'react';
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import { BsUpload } from "react-icons/bs";
import Modal from '../../Components/Modal/reqModal'; // Import your modal component
import Simple from '../../Components/Buttons/Simple';
import ButbgGray from '../../Components/Buttons/ButbgGray';

const StudentProjectDetails = ({ data, accordionId, onOptSelect, onReportSelect }) => {
  const { srno, fyptitle, term, status } = data;
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file

  useEffect(() => {
    initFlowbite();
  }, []);

  const handleReportClick = () => {
    setShowReportModal(true);
    onReportSelect(true); // If needed to notify the parent component
  };

  const handleDetailsViewClick = () => {
    onOptSelect(true);
  };

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

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-20'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Student Project Details" accordionId={accordionId} />
      </h2>

      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-white   :text-gray-400 border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-white   :bg-gray-700   :text-gray-400">
                <tr className='border-b text-center'>
                  <th className="px-6 py-3  w-52">Sr no</th>
                  <th className="px-6 py-3  w-[15.625rem] text-left">FYP Title</th>
                  <th className="px-6 py-3  w-52">Term</th>
                  <th className="px-6 py-3  w-52">Status</th>
                  <th className="px-6 py-3  w-52">Details</th>
                  <th className="px-6 py-3  w-52">Report</th>
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
                  <td className="px-6 py-4 flex flex-row justify-center hover:text-gray-500 hover:cursor-pointer">
                    <BsUpload className='w-5 h-6' onClick={handleReportClick} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pop-up Modal */}
      {showReportModal && (
        <Modal closeModal={closeModal}>
          {/* Your modal content */}
          <div className="bg-white p-4">
            <div className='font-bold flex flex-row justify-center'>
              <p>File Upload</p>
            </div>
            <div className='mt-16'>
              <label htmlFor="UploadReport" className="block mb-1 text-sm font-medium text-black">
                Choose your file
              </label>
              <input
                type="file"
                id="pdf"
                accept="pdf/*" // Allow only PDF files
                onChange={handleFileChange}
                className={`bg-white border border-gray-300 text-white text-sm rounded-2xl block w-full p-2.5  `}
                required
                />
                {selectedFile && <p className="mt-2 text-sm">Selected File: {selectedFile.name}</p>}
            </div>
            <div className="flex justify-between mt-10">
              <ButbgGray text="Cancel" onClick={closeModal} />
              <Simple text="Upload" onClick={handleUploadFile} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default StudentProjectDetails;
