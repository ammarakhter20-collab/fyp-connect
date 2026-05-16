import React from 'react';
import TestTable from '../SupAssignedExams/SupTablewWthinCard';


const SupSupervisionReqTable = (props) => {
    const { groupData, viewButtonClick, handleFilterClick, dropdownOptions, componentid} = props;

    
    return (
        <div>
           {groupData && ( <TestTable
                groupData={groupData}
                headers={[
                    { text: 'Serial no', colSpan: 1 },
                    { text: 'FYP Title', colSpan: 1 },
                    { text: 'Request Date', colSpan: 1 },
                    { text: 'Status', colSpan: 1 },
                ]}
                buttons={[
                    {
                        bheading: 'Details',
                        text: 'View',
                        click: viewButtonClick,
                    },
                ]}
                fields={['groupNo', 'fypTitle', 'SuprvisionRequest', 'reqStatus']}
                componentid={componentid}
                handleFilterClick={handleFilterClick}
                dropdownOptions={dropdownOptions}
            />)}
        </div>
    )
}

export default SupSupervisionReqTable
