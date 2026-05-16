import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initFlowbite } from 'flowbite';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
import { IoIosCloudDownload } from "react-icons/io";
import ProjectInfo from '../../SupProjectDetails/StdProjectInfo';
import Panel_details from '../../SupProjectDetails/PartOneDetails/SupPanel_Details';
import Group_details from "../../SupProjectDetails/PartOneDetails/Supgroup_details";
import Attendence_table from '../../SupProjectDetails/Stdattendence';
import TaskIEvaluation from '../../SupProjectDetails/PartOneDetails/StdTaskIEvaluation';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import SupAttendanceDetailsofStd from "./SupAttendanceDetailsofStd";
import SupStudentTaskDetails from './SupStudentTaskDetails';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import OrientationEvaluation from '../../SupProjectDetails/PartOneDetails/StdOrientationEvaluation';
import ProposalEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation';
import MidEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation'
import FinalEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation'
import OverAll from '../../SupProjectDetails/StdOverAll';





const SupPrevSupervisedProj = () => {
    const [filteredgroupData, setFilteredgroupData] = useState(null);
    // const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [taskData, setTaskData] = useState(null);

    const [showDetails, setShowDetails] = useState(true)
    const [showProjectDetails, setShowProjectDetails] = useState(false)
    const [loadingSpinner, setLoadingSpinner] = useState(false);








    const [approvedProjects, setApprovedProjects] = useState(null);
    const [projectInfoData, setProjectInfoData] = useState(null);
    const [groupData, setgroupData] = useState(null);
    const [groupAttendanceData, setGroupAttendanceData] = useState(null);
    const [penalData, setPenalData] = useState(null);
    const [addedMarks, setAddedMarks] = useState(null);
    // const [addedExamMarks, setAddedExamMarks] = useState(null);
    const [studentForAttendence, setStudentforAttendance] = useState(null);
    const [currentPartStatus, setCurrentPartStatus] = useState('part-I');
    // const [examData, setExamData] = useState(null);
    const [studentTaskDetailData, setStudentTaskDetailData] = useState(null);
    const [selectedStudentForTasks, setSelectedStudentForTasks] = useState(null);



    const [examData, setExamData] = useState(null);
    const [overallResultData, setOverallResultData] = useState(null);
    const [term, setTerm] = useState(null);




    const [OrientationData, setOrientationData] = useState(null);
    const [ProposalData, setProposalData] = useState(null);
    const [Attendance_1_Data, setAttendance_1_Data] = useState(null);
    const [Mid_1_data, setMid_1_data] = useState(null);
    const [Final_1_data, setFinal_1_data] = useState(null);
    const [Attendance_2_Data, setAttendance_2_Data] = useState(null);
    const [Mid_2_data, setMid_2_data] = useState(null);
    const [Final_2_data, setFinal_2_data] = useState(null);












    const location = useLocation();






    const fetchAttendance = async (grpId) => {
        console.log("Inside Fetch Attendance")
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            // const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userId = parsedUserData._id;
            const response = await fetch(`/api/auth//get-group-attendance/${grpId}?`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data Attendanceeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
            }
            const data = await response.json();
            //Fetched  Data
            console.log("fetchedDataaaaaa in Attendance", data);
            setGroupAttendanceData(data);


        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    useEffect(() => { }, [groupAttendanceData])







    const fetchExamData = async (groupId, termId) => {
        console.log("Inside Fetch Exam Dataaaaaaaaaaaa");
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            //const termId = parsedUserData.term._id;
            console.log(termId, "lookmeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            console.log("Group Iddddddddddddd", groupId);
            const response = await fetch(`/api/EvaluateExamRoutes/getExamMarks/${termId}?groupId=${groupId}`, {
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
            // Fetched Data
            console.log(data, "Exam Data for All exams");
            setExamData(data);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };
    const fetchOverAllExams = async (groupId, termId) => {
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            //const termId = parsedUserData.term._id;
            console.log(termId, "lookme");
            const response = await fetch(`/api/results/getresultsbygrpId/${groupId}/${termId}`, {
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
            // Fetched Data
            console.log(data, "Overall Exam Data for exams");
            setOverallResultData(data);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    useEffect(() => {
        console.log("ExamDataaaaaaaaaaaaaaaaaa", examData);
        if (examData && examData.groupDetails) {
            if (currentPartStatus === "part-I") {
                const dataForOrientation = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Orientation")
                    }))
                };
                setOrientationData(dataForOrientation);

                const dataForProposal = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Proposal")
                    }))
                };
                setProposalData(dataForProposal);

                const dataForAttendance_1 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Attendance-I")
                    }))
                };
                //setAttendance_1_data(dataForAttendance_1);

                const dataForMid_1 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Mid-I")
                    }))
                };
                setMid_1_data(dataForMid_1);

                const dataForFinal_1 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Final-I")
                    }))
                };
                setFinal_1_data(dataForFinal_1);
            } else {
                const dataForAttendance_2 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Attendance-II")
                    }))
                };
                // setAttendance_2_data(dataForAttendance_2);

                const dataForMid_2 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Mid-II")
                    }))
                };
                setMid_2_data(dataForMid_2);

                const dataForFinal_2 = {
                    groupId: examData.groupDetails.groupId,
                    students: examData.groupDetails.students.map(student => ({
                        regNo: student.registrationNumber,
                        studentName: student.studentName,
                        _Id: student.studentId,
                        exam: student.exams.filter(exam => exam.examName === "Final-II")
                    }))
                };
                setFinal_2_data(dataForFinal_2);
            }
        }
        else {
            console.log("No Exam Data");
        }
    }, [examData, currentPartStatus]);



    useEffect(() => {
        if (!groupAttendanceData || !groupAttendanceData.fypGroup) {
            console.error("groupAttendanceData or groupAttendanceData.fypGroup is null or undefined");
            return;
        }

        const attend = groupAttendanceData.fypGroup.map(group => {
            const partStatus = group.partStatus?.find(status => status.part === currentPartStatus);
            if (!partStatus) {
                console.warn("Part status not found");
                return null;
            }
            const totalMeetings = partStatus.meetings?.length || 0;

            const members = group.fypgroup?.groupMembers.map(grpMember => {
                const attendedMeetings = partStatus.meetings?.filter(meeting =>
                    meeting.memberAttendances?.find(attendance => attendance.member === grpMember._id && attendance.status === "present")
                ).length || 0;

                const percentage = totalMeetings === 0 ? 0 : (attendedMeetings / totalMeetings) * 100;

                return {
                    _id: grpMember._id,
                    regNo: grpMember.registrationNumber,
                    Name: grpMember.name,
                    Percentage: percentage,
                };
            }) || [];

            return {
                members: members,
                Course: `Design Project (${group.fypgroup.partStatus})`,
                Meetings: totalMeetings,
                _id: group._id
            };
        }).filter(Boolean); // Filter out any null values

        setStudentforAttendance(attend);
    }, [groupAttendanceData, currentPartStatus])



    const fetchApprovedGroups = async () => {
        try {
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            const userid = parsedUserData._id;
            // const filter = "approved";
            const params = new URLSearchParams(location.search);
            const groupId = params.get('id');
            console.log("GroupIdddd Checkinggggggggggg", groupId);


            let response;
            if (!groupId) {


                response = await fetch(`/api/fyp/getfypregistrations/${userid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    },
                });
            } else {
                response = await fetch(`/api/fyp/getfypregistrationsbyGroupId/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    },
                });

            }
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data

            console.log("fetched Data for check", data)

            const fypArray = data.filteredFyps || data.FYPDatas || [];
            const filteredData1 = fypArray.map((fyp, index) => ({
                index: 'Group no. ' + (index + 1),
                fypTitle: fyp.topicData.topic,
                members: fyp.groupMembers.map(member => ({
                    Name: member.name,
                    RegistrationNo: member.registrationNumber,
                    _id: member._id,

                })),
                reqStatus: fyp.reqStatus,
                term: fyp.term.sessionTerm,
                termId: fyp.term._id,
                _id: fyp._id,
            }))
            setFilteredgroupData(filteredData1);



            setApprovedProjects(data);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    const getOverallResult = async (groupId, termId) => {
        try {
            console.log(groupId, termId, "Errorrrrr")
            setLoadingSpinner(true);
            const token = localStorage.getItem('key');
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            const userid = parsedUserData._id;


            const response = await fetch(`/api/results/getresultsbygrpId/${groupId}/${termId}`, {
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

            console.log("fetched Overall Data for check", data)

        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };






    useEffect(() => {

        fetchApprovedGroups();
    }, [location.search])




    useEffect(() => {

    }, [currentPartStatus])





























    const viewButtonClick = async (id) => {
        console.log(id, "viewBtn");
        const fypsList = approvedProjects?.filteredFyps || approvedProjects?.FYPDatas;
        const group = fypsList ? fypsList.find(group => (group._id === id)) : null;
        console.log(group, "dataaaaa");

        if (!group) {
            console.error("Group not found");
            return;
        }

        const termId = group.term?._id;
        if (!termId) {
            console.error("Term ID not found");
            return;
        }
        console.log(termId, "IIIIIDDDDDDDDDDDDDDDDDDDDDDDDD");

        // comeback
        await getOverallResult(id, termId);

        // Set project info data
        const data = [{
            fyptitle: group.topicData?.topic || "N/A",
            supervisor: group.selectedOption?.name || "N/A",
            panel: group.assignedPanel?.panelCode || "N/A",
            term: group.term?.sessionTerm || "N/A",
            category: group.topicData?.category || "N/A",
            platform: group.selectedPlatform?.platformName || "N/A",
            technology: group.selectedTechnology?.techName || "N/A",
        }];
        setProjectInfoData(data);

        // Set group data
        const groupData = group.groupMembers.map(member => ({
            name: member.name,
            regno: member.registrationNumber,
            cgpa: member.cgpa,
            crhrs: member.creditHours,
            category: group.topicData?.category || "N/A",
            course: `Design Project (${group.partStatus})`,
            term: group.term?.sessionTerm || "N/A",
            termId: member.term,
            _id: member._id,
            partStatus: group.partStatus
        }));
        setgroupData(groupData);

        // Fetch attendance data
        await fetchAttendance(id);
        // Ensure groupAttendanceData is available after fetchAttendance


        // Fetch exam data
        await fetchExamData(id, termId);


        await fetchOverAllExams(id, termId);


        setShowDetails(false);
        setShowProjectDetails(true);
    };



    const handleGoBack = () => {
        setShowProjectDetails(false);
        setShowDetails(true)
    }
    //VIEW Attendance Details ka button



    const handleViewClickStdAttendanceDetailsP1 = (id) => {
        const fypGroupWithPartStatus = groupAttendanceData.fypGroup.find(group => {
            return group.partStatus.some(partStatus => partStatus.part === currentPartStatus);
        });
        let group = null;
        if (fypGroupWithPartStatus) {
            group = fypGroupWithPartStatus.partStatus.find(partStatus => partStatus.part === currentPartStatus);
        }
        //  if (!group) return null;

        const meeting = group.meetings.filter(meeting =>
            meeting.memberAttendances.some(attendance => attendance.member === id)
        );
        // if (!meeting) return null;

        const studentAttendance = meeting.reduce((acc, curr) => {
            const attendance = curr.memberAttendances.find(attendance => attendance.member === id);
            if (attendance) {
                acc.push({
                    meetingNo: curr.meetingNo,
                    meetingDate: curr.meetingDate,
                    meetingStartTime: curr.meetingStartTime,
                    meetingEndTime: curr.meetingEndTime,
                    memberAttendances: [attendance]
                });
            }
            return acc;
        }, []);

        const selectedStudentInfo = groupData.find(member => member._id === id)
        const selectedStudent = {
            Meeting: studentAttendance,
            Course: `Design Project (${groupAttendanceData.fypGroup[0].fypgroup.partStatus})`,
            student: selectedStudentInfo,

        }
        setSelectedStudent(selectedStudent)


    }








    const handleViewClickStdAttendanceDetailsP2 = (id) => {
        const fypGroupWithPartStatus = groupAttendanceData.fypGroup.find(group => {
            return group.partStatus.some(partStatus => partStatus.part === currentPartStatus);
        });
        let group = null;
        if (fypGroupWithPartStatus) {
            group = fypGroupWithPartStatus.partStatus.find(partStatus => partStatus.part === currentPartStatus);
        }
        //  if (!group) return null;

        const meeting = group.meetings.filter(meeting =>
            meeting.memberAttendances.some(attendance => attendance.member === id)
        );
        // if (!meeting) return null;

        const studentAttendance = meeting.reduce((acc, curr) => {
            const attendance = curr.memberAttendances.find(attendance => attendance.member === id);
            if (attendance) {
                acc.push({
                    meetingNo: curr.meetingNo,
                    meetingDate: curr.meetingDate,
                    meetingStartTime: curr.meetingStartTime,
                    meetingEndTime: curr.meetingEndTime,
                    memberAttendances: [attendance]
                });
            }
            return acc;
        }, []);

        const selectedStudentInfo = groupData.find(member => member._id === id)
        const selectedStudent = {
            Meeting: studentAttendance,
            Course: `Design Project (${groupAttendanceData.fypGroup[0].fypgroup.partStatus})`,
            student: selectedStudentInfo,

        }
        setSelectedStudent(selectedStudent)


    }





    const viewReportClick = (fypTitle) => {
        // const group = NewData.groupData.find(group => group.fypTitle === fypTitle);

        // if (group) {
        //     const downloadLink = group.downloadLink;
        //     const link = document.createElement('a');
        //     link.href = downloadLink;
        //     link.download = `file_${group.fypTitle}.pdf`;
        //     link.target = "_blank";
        //     link.rel = "noopener noreferrer";
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // }
    }

    const handlePartStatus = (status) => {
        setCurrentPartStatus(status);
    };




    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodProjectsLists';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            if (selectedTab) {
                const topOffset = selectedTab.offsetTop;
                indicator.style.top = `${topOffset}px`;
            }
        }
    }, []);
    return (
        <>
            {loadingSpinner ? (<div>
                <LoadingSpinner />
            </div>) : (<div className='bg-slate-100 w-full h-full'>
                {showDetails && (<div className='mx-10 pt-12 flex flex-col gap-3' >
                    {filteredgroupData && (<div>

                        <AccordionGenericTable
                            groupData={filteredgroupData}
                            headers={['Group no', 'FYP Title', 'Members', 'Term', 'Status',]}
                            accordionId={15}
                            buttons={[
                                {
                                    bheading: 'Details',
                                    text: 'View',
                                    click: viewButtonClick,
                                },
                                {
                                    bheading: 'Report',
                                    text: <IoIosCloudDownload className='text-2xl' />,
                                    click: viewReportClick,
                                },
                            ]}
                            tabheading={'Previously Supervised Projects'}
                            fields={['index', 'fypTitle', 'members', 'term', 'reqStatus']}
                            memberFields={['Name', 'RegistrationNo']}
                        />
                    </div>)}
                </div>)}
                {showProjectDetails && (
                    <div className='mx-10 pt-12 flex flex-col gap-3 relative'>
                        <div class="mb-4 border-b border-gray-200 font-semibold">
                            <ul class="flex flex-wrap -mb-px justify-around text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
                                <li class="me-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="part1-tab" data-tabs-target="#part1" type="button" role="tab" aria-controls="part1" aria-selected="false" onClick={() => handlePartStatus("part-I")}>Part 1</button>
                                </li>
                                <li role="presentation">
                                    <button class={`inline-block p-4 border-b-2 rounded-t-lg ${(groupData && groupData[0] && groupData[0].partStatus !== 'part-II') ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:text-gray-600 hover:border-gray-300'}`}
                                        id="part2-tab"
                                        data-tabs-target="#part2"
                                        type="button"
                                        role="tab"
                                        aria-controls="part2" aria-selected="false" onClick={() => groupData && groupData[0] && groupData[0].partStatus === 'part-II' && handlePartStatus("part-II")}
                                        disabled={groupData && groupData[0] && groupData[0].partStatus !== 'part-II'}

                                    >Part 2</button>
                                </li>
                                <li role="presentation">
                                    <button
                                        className={`inline-block p-4 border-b-2 rounded-t-lg ${(groupData && groupData[0] && groupData[0].partStatus !== 'part-II') ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:text-gray-600 hover:border-gray-300'}`}
                                        id="overall-tab"
                                        data-tabs-target="#overall"
                                        type="button"
                                        role="tab"
                                        aria-controls="overall"
                                        aria-selected="false"
                                        onClick={() => groupData && groupData[0] && groupData[0].partStatus === 'part-II' && handlePartStatus("all")}
                                        disabled={groupData && groupData[0] && groupData[0].partStatus !== 'part-II'}
                                    >
                                        Overall
                                    </button>
                                </li>
                            </ul>

                        </div>
                        <div id="default-tab-content  w-full h-full">
                            <div class="hidden rounded-lg bg-gray-50" id="part1" role="tabpanel" aria-labelledby="part1-tab">
                                <div className="partOneDetails flex flex-col gap-3">

                                    <ProjectInfo accordionId={14} data={projectInfoData} />
                                    <Group_details accordionId={1} data={groupData} />
                                    {studentForAttendence && (<SupAttendanceDetailsofStd data={studentForAttendence} accordionId={16} handleViewClick={handleViewClickStdAttendanceDetailsP1} accordText="Attendance I Details" />)}
                                    {selectedStudent && (<Attendence_table accordionId={2} data={selectedStudent} accordText="Attendance I Details" />)}
                                    {penalData && (<Panel_details accordionId={3} data={penalData} />)}
                                    {/* it was below proposal */}
                                    {OrientationData && <OrientationEvaluation accordionId={4} data={OrientationData} />}
                                    {ProposalData && <ProposalEvaluation accordionId={5} data={ProposalData} accordText="Proposal Evaluation" />}
                                    {Mid_1_data && <MidEvaluation accordionId={7} data={Mid_1_data} accordText="Mid I Evaluation" />}
                                    {Final_1_data && <FinalEvaluation accordionId={8} data={Final_1_data} accordText="Final I Evaluation" />}
                                    {/* 
                            <OverallEvaluationI accordionId={9} data={Data.overallEvaluationDataP1} stdData={selectedGroup} /> */}

                                </div>
                            </div>

                            <div class="hidden rounded-lg bg-gray-50 " id="part2" role="tabpanel" aria-labelledby="part2-tab">
                                <div className="partTwoDetails flex flex-col gap-3">
                                    <SupAttendanceDetailsofStd data={studentForAttendence} accordionId={17} handleViewClick={handleViewClickStdAttendanceDetailsP2} accordText="Attendance II Details" />
                                    {selectedStudent && (<Attendence_table accordionId={10} data={selectedStudent} accordText="Attendance II Details" />)}
                                    {Mid_2_data && <MidEvaluation accordionId={11} data={Mid_2_data} accordText="Mid II Evaluation" />}
                                    {Final_2_data && <FinalEvaluation accordionId={12} data={Final_2_data} accordText="Final II Evaluation" />}
                                    {/* 
                                    <OverallEvaluationII accordionId={13} data={Data.overallEvaluationDataP2} stdData={selectedGroup} /> */}
                                </div>
                            </div>

                            <div class="hidden rounded-lg bg-gray-50 " id="overall" role="tabpanel" aria-labelledby="overall-tab">
                                <div className="OverallEvaluationDetails flex flex-col gap-3 click-event-hidden">
                                    {overallResultData && <OverAll accordionId={21} data={overallResultData} />}
                                </div>

                            </div>
                        </div>
                        <div className='flex flex-row justify-end mt-5'>
                            <ButbgPrimary text="Back" onClick={handleGoBack} />
                        </div>
                    </div>
                )}
            </div>)}
        </>
    )
}

export default SupPrevSupervisedProj
