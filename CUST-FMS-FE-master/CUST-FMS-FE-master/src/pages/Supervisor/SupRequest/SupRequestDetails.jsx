import React, { useState, useEffect } from 'react';
import ReportTable from '../SupAssignedExams/SupTablewWthinCard';

const SupRequestDetails = ({ data, DenialClick, PartialDenyClick, ApprovalClick }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [isPartialDenied, setIsPartialDenied] = useState(false);
  const [status, setStatus] = useState();

  console.log("Status", status);

  useEffect(() => {
    if (data.length > 0) {
      setStatus(data[0].request);

      if (data[0].request === "approved") {
        setIsApproved(true);
        setIsDenied(false);
        setIsPartialDenied(false);
      } else if (data[0].request === "denied" || data[0].request === "rejected") {
        setIsApproved(false);
        setIsDenied(true);
        setIsPartialDenied(false);
      } else if (data[0].request === "partial-deny") {
        setIsApproved(false);
        setIsDenied(false);
        setIsPartialDenied(true);
      } else {
        setIsApproved(false);
        setIsDenied(false);
        setIsPartialDenied(false);
      }
    }

  }, [data]);
  console.log('Status to be checked', data.request)

  const handleApprovalClick = (index) => {
    ApprovalClick(index);
    setIsApproved(true);
  }

  const handlePartialDenyClick = (index) => {
    if(PartialDenyClick) PartialDenyClick(index);
    setIsPartialDenied(true);
  }

  const handleDenialClick = (index) => {
    DenialClick(index);
    setIsDenied(true);
  }

  const newData = data.map(item => ({
    ...item,
    appstatus: isApproved ? 'approved' : (isDenied ? 'denied' : (isPartialDenied ? 'partial-deny' : 'pending'))
  }));

  const buttons = isApproved || isDenied || isPartialDenied ? [{ bheading: 'Status', bcolspan: 1 }] : [{ bheading: 'Status', bcolspan: 3 }];

  let fields = isApproved || isDenied || isPartialDenied ? ['fyp', 'date', 'member', 'file', 'technology', 'appstatus'] : ['fyp', 'date', 'member', 'file', 'technology', ''];

  return (
    <>
      <div className='bg-white w-full h-full rounded-md'>
        <ReportTable
          groupData={newData}
          headers={[
            { text: 'FYP Title', colSpan: 1 },
            { text: 'Date', colSpan: 1 },
            { text: 'Group Members', colSpan: 1 },
            { text: 'File', colSpan: 1 },
            { text: 'Technology', colSpan: 1 },
          ]}
          fields={fields}
          componentid={isApproved || isDenied || isPartialDenied ? null : 2}
          buttons={buttons}
          handlePartialDenyClick={handlePartialDenyClick}
          handleApprovalClick={handleApprovalClick}
          handleDenialClick={handleDenialClick}
        />
      </div>
    </>
  );
}

export default SupRequestDetails;
