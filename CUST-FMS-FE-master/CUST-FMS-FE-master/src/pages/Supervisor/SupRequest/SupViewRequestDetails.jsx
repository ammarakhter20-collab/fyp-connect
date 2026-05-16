import React, { useState, useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import SupRequestDetails from './SupRequestDetails';
import SupGroupDetails from './SupGroupDetails';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';

const SupViewRequestDetails = ({ Data, handleApproval, handlePartialDeny, handleDenial, handleGoBack }) => {
    console.log('let us see ', Data);
    const [requestData, setRequestData] = useState(null);
    const [grouptData, setGroupData] = useState(null);

    useEffect(() => {
        initFlowbite();
    }, []);
    useEffect(() => {
        const selection = [{
            fyp: Data.topicData.topic,
            date: Data.reqDate,
            member: Data.groupMembers.length,
            file: Data.file,
            technology: Data.topicData.category,
            request: Data.reqStatus,
        }];
        setRequestData(selection);

        const group = Data.groupMembers.map(member => ({
            Name: member.name,
            RegistrationNo: member.registrationNumber,
            CGPA: member.cgpa,
            CreditHours: member.creditHours,
            Term: member.term.sessionTerm,
        }));
        setGroupData(group);
    }, [Data]);

    return (
        <>
            <div className='w-full h-full'>
                <div class="mb-4 border-b border-gray-200 font-semibold">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center " id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
                        <li class="me-2" role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg" id="reportdetails-tab" data-tabs-target="#reportdetails" type="button" role="tab" aria-controls="reportdetails" aria-selected="false">Request Details</button>
                        </li>
                        <li role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 " id="approvedreports-tab" data-tabs-target="#approvedreports" type="button" role="tab" aria-controls="approvedreports" aria-selected="false">Group Details</button>
                        </li>
                    </ul>
                </div>
                <div id="default-tab-content  w-full h-full">
                    <div class="hidden rounded-lg bg-gray-50" id="reportdetails" role="tabpanel" aria-labelledby="reportdetails-tab">
                        {requestData && (<SupRequestDetails data={requestData} PartialDenyClick={handlePartialDeny} DenialClick={handleDenial} ApprovalClick={handleApproval} />)}
                    </div>
                    <div class="hidden rounded-lg bg-gray-50 " id="approvedreports" role="tabpanel" aria-labelledby="approvedreports-tab">
                        {grouptData && (<SupGroupDetails data={grouptData} />)}
                    </div>
                </div>
                <div className='flex flex-row justify-end mr-5 mt-5'>
                    <ButbgPrimary text="Back" onClick={handleGoBack} />
                </div>

            </div>
        </>
    )
}

export default SupViewRequestDetails
