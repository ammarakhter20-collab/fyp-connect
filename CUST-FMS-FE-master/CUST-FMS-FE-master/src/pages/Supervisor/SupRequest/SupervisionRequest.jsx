///////TESTING REMAINING ONLY
import React, { useState, useEffect, useMemo } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import SupSupervisionReqTable from './SupSupervisionReqTable';


const SupervisionRequest = ({ groupData, accordionId, viewButtonClick }) => {
    console.log('in dash', groupData)

    const reqData = useMemo(() => {
        let serialNum = 1;
        return groupData.fypRequests.map(data => {
            const date = new Date(data.reqDate);
            console.log("Checking date", date);
            // const formattedDate = date.toISOString().slice(0, 10);

            return {
                _id: data._id,
                groupNo: serialNum++,
                fypTitle: data.topicData.topic,
                SuprvisionRequest: data.reqDate,
                reqStatus: data.reqStatus,
            };
        });
    }, [groupData]);


    const [filteredgroupData, setFilteredgroupData] = useState(reqData);
    const [dropdownOptions, setDropdownOptions] = useState([]);


    const handleFilterClick = (selectedOption) => {
        if (selectedOption) {
            const filteredData = reqData
                .filter((item) => item.reqStatus === selectedOption.value)
                .map((item, index) => ({
                    ...item,
                    groupNo: index + 1,
                    index: index + 1,
                }));
            setFilteredgroupData(filteredData);
        } else {
            const filteredData = reqData.map((item, index) => ({
                ...item,
                groupNo: index + 1,
                index: index + 1,
            }));
            setFilteredgroupData(filteredData);
        }
    };

    useEffect(() => {
        const extractDropdownOptions = () => {
            const options = reqData.map((item) => ({
                value: item.reqStatus,
                label: item.reqStatus,
            }));
            const uniqueOptions = [...new Set(options.map((option) => option.value))].map((value) =>
                options.find((option) => option.value === value)
            );
            setDropdownOptions(uniqueOptions);
        };
        extractDropdownOptions();
    }, [reqData]);



    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
                <GenAccor accordionId={accordionId} text={'Supervision Requests'} />
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    {groupData && (<SupSupervisionReqTable groupData={filteredgroupData} viewButtonClick={viewButtonClick} dropdownOptions={dropdownOptions} handleFilterClick={handleFilterClick} componentid={4} />)}
                </div>
            </div>
        </>
    );
};

export default SupervisionRequest;
