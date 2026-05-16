import React, {useEffect} from 'react'
import ReportTable from './SupTablewWthinCard';
import { baseUrl } from '../../../Components/config/config';

const ReportDetails = ({data, handleViewClickinSup, handleDeownloadClickinSup}) => {
 
  console.log("dekh lo data apna", data);

  let modifiedData;
  modifiedData = data.map((selectedGroup, index) => ({
    index : ++index,
    fyp: selectedGroup.groupId.topicData.topic,
    examdate: selectedGroup.dueDate,
    examtype: selectedGroup.examTitle,
    fileupload: selectedGroup.submitDate,
    file: selectedGroup.submitPdf,
    status: selectedGroup.reportStatus,
    uploadedby: selectedGroup.submitBy.name,
    _id : selectedGroup._id,
}));
  
  console.log('yeh dekho dataapna', modifiedData)

  const Click01 = (id) => {
    handleViewClickinSup(id);

    // Create a new <a> element
    const link = document.createElement('a');
    link.href = `${baseUrl}/${modifiedData[0].file.replace(/\\/g, '/')}`;
    link.download = `file_${modifiedData[0].file}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  const Click02 = (id) => {
    handleDeownloadClickinSup(id)

    const fileToDownload = modifiedData[0].file;

    const link = document.createElement('a');
    link.href = `${baseUrl}/${fileToDownload.replace(/\\/g, '/')}`;
    link.download = `file_${fileToDownload}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  
    // Append the <a> element to the document body
    document.body.appendChild(link);
  
    // Trigger a click event on the <a> element
    link.click();
  
    // Remove the <a> element from the document body
    document.body.removeChild(link);

  }


  return (
    <>
      <div>
        <div className='bg-white w-full h-full rounded-md '>


     





          <ReportTable
            groupData={modifiedData} headers={[
                { text: 'Serial no', colSpan: 1 },
                { text: 'FYP Title', colSpan: 1 },
                { text: 'Exam', colSpan: 1 },
                { text: 'Status', colSpan: 1 },
                { text: 'Uploaded by', colSpan: 1 },
                { text: 'Uploaded At', colSpan: 1 },
                { text: 'File', colSpan: 1 },

            ]}
               buttons={[
                // {
                //   text: 'View',
                //   click: Click01, // initialized with click handler function
                // },
                {
                  text: 'Download',
                  click: Click02, // initialized with click handler function
                },
              ]}
              fields={['index', 'fyp',  'examtype', 'status', 'uploadedby','fileupload', 'file']}
          />
        </div>
      </div>
    </>
  )
}

export default ReportDetails
