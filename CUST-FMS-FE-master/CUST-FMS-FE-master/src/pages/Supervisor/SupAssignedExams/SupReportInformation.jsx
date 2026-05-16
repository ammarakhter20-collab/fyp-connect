import React, { useState, useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import ReportDetails from './SupReportDetails';
import ApprovedReports from './SupApprovedReports';

const SupReportInformation = ({ reportData, handleApprovalClick, handleDenialClick, handleviewClick, handledownloadClick, approvedreportData }) => {


    const function1 = (id) => {
        handleApprovalClick(id);
    }
    const function2 = (id) => {
        handleDenialClick(id);
    }

    useEffect(() => {
        initFlowbite();
    }, []);
    console.log('yeh ApproveReport mri data a gaya ha', reportData)
    return (
        <>
            <div className='w-full h-full'>
                <div class="mb-4 border-b border-gray-200 font-semibold">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center " id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
                        <li class="me-2" role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg" id="reportdetails-tab" data-tabs-target="#reportdetails" type="button" role="tab" aria-controls="reportdetails" aria-selected="false">Report Details</button>
                        </li>
                        <li role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 " id="approvedreports-tab" data-tabs-target="#approvedreports" type="button" role="tab" aria-controls="approvedreports" aria-selected="false">Approved Reports</button>
                        </li>
                    </ul>
                </div>
                <div id="default-tab-content  w-full h-full">
                    <div class="hidden rounded-lg bg-gray-50" id="reportdetails" role="tabpanel" aria-labelledby="reportdetails-tab">
                        {reportData[0].status === "submitted" ? (<div className='bg-white w-full h-full rounded-md '>
                            No Pending Request
                        </div>) : (
                            <ReportDetails data={reportData} handleApprovalClick={function1} handleDenialClick={function2} />
                        )}
                    </div>

                    <div class="hidden rounded-lg bg-gray-50 " id="approvedreports" role="tabpanel" aria-labelledby="approvedreports-tab">
                        {approvedreportData[0] ? (
                            <div>
                                 <ApprovedReports data={approvedreportData} handleDeownloadClickinSup={handledownloadClick} handleViewClickinSup={handleviewClick} />
                            </div>
                    ) : (<div className='bg-white w-full h-full rounded-md '>
                            No Approved Request
                        </div>)}
                    </div>
                </div>

            </div>
        </>
    )
}

export default SupReportInformation
