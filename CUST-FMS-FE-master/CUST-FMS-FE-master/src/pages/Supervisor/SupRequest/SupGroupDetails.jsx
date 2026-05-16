import React from 'react'
import ReportTable from '../SupAssignedExams/SupTablewWthinCard';

const SupGroupDetails = ({data}) => {
    // const handleApprovalClick = (index) => {
    //     console.log('Approve click', index);
        
    //   }
    //   const handleDenialClick = (index) => {
    //     console.log('Denial click', index);
        
    //   }
    
  return (
    <>
      <div>
        <div className='bg-white w-full h-full rounded-md '>
          <ReportTable
            groupData={data} headers={[
                { text: 'Registration No', colSpan: 1 },
                { text: 'Name', colSpan: 1 },
                { text: 'CGPA', colSpan: 1 },
                { text: 'Credit Hours', colSpan: 1 },
                { text: 'Term', colSpan: 1 },
            ]}
  
              fields={['RegistrationNo', 'Name',  'CGPA', 'CreditHours','Term',]}
          />
        </div>
      </div>
    </>
  )
}

export default SupGroupDetails
