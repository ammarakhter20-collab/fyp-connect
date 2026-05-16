import React from 'react'
import ReportTable from './SupTablewWthinCard';

const ReportDetails = ({data, handleApprovalClick, handleDenialClick}) => {
  console.log('data in somewhere' ,data)

  return (
    <>
      <div>

        <div className='bg-white w-full h-full rounded-md '>
        <ReportTable
            groupData={data} headers={[
                { text: 'FYP Title', colSpan: 1 },
                { text: 'Date', colSpan: 1 },
                { text: 'Exam type', colSpan: 1 },
                { text: 'Uploaded At', colSpan: 1 },
                { text: 'File', colSpan: 1 },
                { text: 'Status', colSpan: 1 },
            ]}
              fields={['mainhead', 'examdate',  'examtype', 'fileupload', 'file', ]}
              componentid={1}
              handleApprovalClick={handleApprovalClick}
              handleDenialClick={handleDenialClick}
          />
        </div>
      </div>
    </>
  )
}

export default ReportDetails
