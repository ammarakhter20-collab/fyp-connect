import React from 'react';
import Table from '../SupAssignedExams/SupTablewWthinCard';


const SupFYPChangeReqTable = ({ groupData, accordionId, viewDetailsClickFYPChange, componentid}) => {
  return (
    <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
    <Table groupData={groupData} headers={[

        { text: 'Serial no', colSpan: 1 },
        { text: 'FYP Title', colSpan: 1 },
        { text: 'Platform', colSpan: 1 },
        { text: 'Category', colSpan: 1 },
        { text: 'Technology', colSpan: 1 },
        { text: 'Status', colSpan: 2 },
    ]} accordionId={accordionId} buttons={[

        {
            bheading : "Details",
            bcolspan : 2,
            text: 'View',
            click: viewDetailsClickFYPChange,

        },
    ]}
        fields={['groupNo', 'fypTitle', 'platform', 'category', 'technology', 'changeReq', 'termstatus']}
        componentid={componentid}
    />
</div>
  )
}

export default SupFYPChangeReqTable
