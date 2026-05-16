import React from 'react'
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import GenAccor from '../../../Components/Accordians/GenAccor';
import TestTable from '../../Supervisor/SupAssignedExams/SupTablewWthinCard';

const CoodAddFaculty = (props) => {

    const { panelData, accordionId, deleteFacultyClick, editFacultyClick, handleAddFacultyClickinAddFaculty } = props;

   
    console.log(panelData, "inside")
    return (
        <>
            <div className='bg-slate-100 w-full h-full'>
                <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                    <div id="cardOneButton ">
                        <CardOnebutton title={"Add Faculty"} butText={"Add"} onClick={() => handleAddFacultyClickinAddFaculty(panelData._id)}
 />
                    </div>
                </div>

                <div className='mt-28'>

                    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
                        <GenAccor accordionId={accordionId} text={`Add Faculty ${panelData?.panelCode}`} />
                        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>

                            {(<TestTable
                                groupData={panelData.PanelMembers}
                                headers={[
                                    { text: 'Sr. no', colSpan: 1 },
                                    { text: 'Member Name', colSpan: 1 },
                                    { text: 'Designation', colSpan: 1 },
                                    { text: 'Role', colSpan: 1 },
                                    { text: 'Department', colSpan: 1 },
                                    { text: 'Action', colSpan: 3 },
                                ]}
                                buttons={[
                    
                                    {
                                        text: "Delete",
                                        click: deleteFacultyClick,
                                    },
                                ]}
                                fields={['index', 'name', 'designation', 'examrole', 'department']}
                            />)}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default CoodAddFaculty
