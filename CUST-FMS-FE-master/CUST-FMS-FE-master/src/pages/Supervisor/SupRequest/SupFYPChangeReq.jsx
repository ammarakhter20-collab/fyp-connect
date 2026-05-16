import React from 'react';
import SupFYPChangeReqTable from './SupFYPChangeReqTable'
import GenAccor from '../../../Components/Accordians/GenAccor';

const SupFYPChangeReq = (props) => {


    const { groupData, accordionId, viewDetailsClickFYPChange } = props;
    

    let serialNum = 1;
    const reqData = groupData.filteredChangeRequests.map(data => {

        return {
            _id: data.fypGroup._id,
            groupNo: serialNum++,
            fypTitle: data.fypGroup.topicData.topic,
            platform: data.fypGroup.selectedPlatform.platformName,
            technology: data.fypGroup.selectedTechnology.techName,
            category: data.fypGroup.topicData.category,
            description: data.fypGroup.topicData.description,
            term: data.requestedBy.term,
            changeReq: data.changeReq
        };

    });




    return (
        <>
           
                <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>

                    <GenAccor accordionId={accordionId} text={'Change Requests'} />
                    <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                        {reqData.length !== 0 ? (<SupFYPChangeReqTable groupData={reqData} accordionId={accordionId} viewDetailsClickFYPChange={viewDetailsClickFYPChange} />) : (
                            <div className="relative overflow-x-auto h-full shadow-md sm:rounded-lg block w-full p-6 bg-white border border-gray-200 rounded-2xl  ">                                No Change Requests
                            </div>
                        )}
                    </div>
                </div>
            
        </>

    );
}

export default SupFYPChangeReq
