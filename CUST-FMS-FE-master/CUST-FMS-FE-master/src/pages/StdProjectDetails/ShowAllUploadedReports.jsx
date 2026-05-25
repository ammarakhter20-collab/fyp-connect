import React from 'react'
import GenAccor from '../../Components/Accordians/GenAccor'
import { useNavigate } from 'react-router-dom';
import { MdCloudDownload } from 'react-icons/md';
import { baseUrl } from '../../Components/config/config';

const ShowAllUploadedReports = ({accordionId, handleBack, FetchedGroupReports}) => {
    const navigate = useNavigate();

  const handleBackButtonClick = () => {
    handleBack();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  console.log("Checking All Uploaded Reports", FetchedGroupReports);

  return (
    
    <>
    <div className='mx-16 mt-10'>
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-20'>
          <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
            <GenAccor text="Uploaded Reports" accordionId={accordionId} />
          </h2>
  
          <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              <div className="table-container overflow-x-auto relative">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-52">Sr no</th>
                      <th className="px-6 py-3 w-[15.625rem] text-left">FYP Title</th>
                      <th className="px-6 py-3 w-52">Exam</th>
                      <th className="px-6 py-3 w-52">Status</th>
                      <th className="px-6 py-3 w-52">UploadedBy</th>
                      <th className="px-6 py-3 w-52">UploadedAt</th>
                      <th className="px-6 py-3 w-52">File</th>
                    </tr>
                  </thead>
                  <tbody>
                  {(Array.isArray(FetchedGroupReports) ? FetchedGroupReports : []).map((report, index) => (
                    <tr key={report._id} className='border-b text-center'>
                      <td className="px-6 py-3">{index + 1}</td>
                      <td className="px-6 py-3 text-left">{report.FYPGroup.topicData.topic}</td>
                      <td className="px-6 py-3">{report.Exam.examName}</td>
                      <td className="px-6 py-3">{report.status}</td>
                      <td className="px-6 py-3">{`${report.uploadedBy.name} - ${report.uploadedBy.registrationNumber}`}</td>
                      <td className="px-6 py-3">{formatDate(report.uploadedAt)}</td>

                      {/* <td className="px-6 py-3"><a href={`/${report.submitReportPdf}`} target="_blank" rel="noopener noreferrer">View Report</a></td> */}
                      <td className="px-6 py-4 font-semibold">
        <a onClick={() => {
          console.log('PDF URL:', `${baseUrl}/${report.submitReportPdf.replace(/\\/g, '/')}`);
        }}
          href={`${baseUrl}/${report.submitReportPdf.replace(/\\/g, '/')}`}
          // download={`file_${item.taskNo}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-left"
        >
          <div className='flex flex-row justify-center'>
            <MdCloudDownload style={{ fontSize: "1.5rem" }} className=''/>
            {/* <span>{item.taskTitle}</span> */}
          </div>
        </a>
      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      <div className="mt-4 flex flex-row justify-end">
        <button onClick={handleBackButtonClick} className="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded-md ">
          Back
        </button>
      </div>
        {/* Back button */}
        </div>
    </>
  )
}

export default ShowAllUploadedReports
