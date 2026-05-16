import React, { useState, useEffect } from 'react';
import { initFlowbite, } from 'flowbite';
import FYPAttendenceDetgroups from './SupFYPAttendenceDetgroups';
import AttendanceDet from './SupAttendanceDet';
import AttendanceMeetingCard from '../../../Components/Cards/AttendanceMeetingCard';

import StdAttendencedetails from './StdAttendencedetails';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
const Attendance = () => {
    const [isAttendanceCardOpen, setIsAttendanceCardOpen] = useState(false);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    //DATA STATE 

    const [isStdAttendanceOpen, setIsStdAttendanceOpen] = useState(false);
    const [showFYPGroups, setShowFYPGroups] = useState(true);
    const [showAttendaceDetails, setShowAttendaceDetails] = useState(false);
    const [selectedAttendanceGroup, setSelectedAttendanceGroup] = useState(null);

    const [memberId, setMemberId] = useState(null);
    const [approvedProjects, setApprovedProjects] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupAttendanceData, setGroupAttendanceData] = useState(null);
    const handleAttendanceCardClose = () => {
        setIsAttendanceCardOpen(false);
    };
    const handleMarkAttendance = async (meetingDetails) => {
        try {
            setLoadingSpinner(true); // Show loading spinner while processing

            const apiUrl = '/api/auth/mark-attendance';
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    meetingDetails
                }),
            });
            if (response.ok) {
                // Handle successful response
                console.log('Attendance Marked successfully');
            } else {
                console.log('Failed to Mark Attendance');
            }
        }
        catch (error) {
            console.error('Error Marking Attendance:', error);
            // Handle network errors or other exceptions
        } finally {
            setLoadingSpinner(false); // Hide loading spinner after processing
        }
    }
    const handleMarkAttendanceClick = (id) => {
        const selectedGroup = approvedProjects.fypRequests.find(group => group._id === id);
        setSelectedGroup(selectedGroup);
        if (selectedGroup) {
            const membersInfo = selectedGroup.groupMembers.map((member) => ({
                Name: member.name,
                RegistrationNo: member.registrationNumber,
                Percentage: member.Percentage,
                _id: member._id,
            }));

            setSelectedAttendanceGroup(membersInfo);

        }

        setIsAttendanceCardOpen(true);
    };
    const handleViewDetailsClick = (id) => {
        fetchAttendance(id);
        setShowAttendaceDetails(true)
        setShowFYPGroups(false);
    };
    const handleViewDetailsClick1 = (id) => {
        setMemberId(id);
        setIsStdAttendanceOpen(true);
        setShowAttendaceDetails(false);
    };
    const handleGoBack = () => {
        setIsAttendanceCardOpen(false)
        setIsStdAttendanceOpen(false)
        setShowAttendaceDetails(false)
        setShowFYPGroups(true)
    }
    const handleSaveClickMeetingAttendance = (meetingDetails) => {
        const groupId = selectedGroup._id;
        const partStatus = selectedGroup.partStatus;
        const updatedMeetingDetails = { ...meetingDetails, groupId, partStatus };
        handleMarkAttendance(updatedMeetingDetails);
    }
    const fetchApprovedGroups = async () => {
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            const userid = parsedUserData._id;


            const response = await fetch(`/api/fyp/fyprequests/${userid}?filter=approved`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            setApprovedProjects(data);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const fetchAttendance = async (grpId) => {
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');

            // const userId = parsedUserData._id;
            const response = await fetch(`/api/auth/get-group-attendance/${grpId}?`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            console.log("fetchedData", data);
            setGroupAttendanceData(data);


        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };
    useEffect(() => {
        fetchApprovedGroups();
    }, []);
    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'SupAttendance';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            if (selectedTab) {
                const topOffset = selectedTab.offsetTop;
                indicator.style.top = `${topOffset}px`;
            }
        }
    }, []);

    return (
        <>
            {loadingSpinner ? ( // Show loading spinner while loading is true
                <LoadingSpinner />
            ) : (
                <div className='bg-slate-100 w-full h-full'>
                    <div className=" mx-10 pt-12 flex flex-col gap-3 ">
                        {showFYPGroups && approvedProjects && (<div>
                            <FYPAttendenceDetgroups
                                accordionId={1}
                                groupData={approvedProjects}
                                onMarkAttendanceClick={handleMarkAttendanceClick}
                                onViewDetailsClick={handleViewDetailsClick}
                            />
                        </div>)}
                        {showAttendaceDetails && (
                            <div>
                                {groupAttendanceData ? (
                                    <div>

                                        <AttendanceDet
                                            accordionId={2}
                                            groupData={groupAttendanceData}
                                            onViewDetailsClick={handleViewDetailsClick1} />
                                        {/* ... additional components ... */}
                                    </div>) : (
                                    <div>
                                        NO DATA FOUND
                                    </div>
                                )}
                                <div className='flex flex-row justify-end mr-5 mt-5'>
                                    <ButbgPrimary text="Back" onClick={handleGoBack} />
                                </div>

                            </div>)}
                        <div>
                            {isStdAttendanceOpen && (
                                <div>
                                    <div>

                                        <StdAttendencedetails
                                            accordionId={3}
                                            groupData={groupAttendanceData} memberId={memberId} />
                                    </div>
                                    <div className='flex flex-row justify-end mr-5 mt-5'>
                                        <ButbgPrimary text="Back" onClick={handleGoBack} />
                                    </div>
                                </div>

                            )}
                        </div>
                    </div>
                    {isAttendanceCardOpen && (
                        <div className="fixed top-0 left-0 w-full min-h-screen flex justify-center items-center bg-black bg-opacity-50">
                            {/* Reminder 101 : is mei mapping ki error aa rahi abhi jo mei subha dekhu ga  */}
                            <AttendanceMeetingCard groupData={selectedAttendanceGroup} onClose={handleAttendanceCardClose} handleSaveClick={handleSaveClickMeetingAttendance} />
                        </div>
                    )}
                </div>)}



        </>
    )
};

export default Attendance;
