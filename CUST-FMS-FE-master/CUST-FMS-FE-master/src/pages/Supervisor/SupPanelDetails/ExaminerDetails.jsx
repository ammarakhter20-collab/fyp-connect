import React, { useState, useEffect } from 'react';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';

const ExaminerDetails = ({ groupData, accordionId, handleViewClick }) => {
    const [PanelCode, setPanelCode] = useState('');

    useEffect(() => {
        if (groupData.length > 0) {
            // Assuming panelcode is the same for all items in groupData
            setPanelCode(groupData[0].panelcode);
        }
    }, [groupData]);

    const updateddata = groupData.map((item, index) => ({ ...item, index: index + 1 }));

    return (
        <div>
            <AccordionGenericTable
                groupData={updateddata}
                tabheading={`Examiner Details ${PanelCode}`}
                accordionId={accordionId}
                headers={['Serial no', 'Member Name', 'Designation', 'Role', 'Department']}
                fields={['index', 'name', 'designation', 'role', 'department']}
            />
        </div>
    );
};

export default ExaminerDetails;
