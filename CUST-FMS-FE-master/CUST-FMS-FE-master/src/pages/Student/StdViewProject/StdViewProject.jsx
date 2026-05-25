import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initFlowbite } from 'flowbite';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';

import ProjectInfo from '../../SupProjectDetails/StdProjectInfo';
import PanelDetails from '../../SupProjectDetails/PartOneDetails/SupPanel_Details';
import GroupDetails from "../../SupProjectDetails/PartOneDetails/Supgroup_details";
import AttendanceTable from '../../SupProjectDetails/Stdattendence';
import SupAttendanceDetailsofStd from "./SupAttendanceDetailsofStd";
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import OrientationEvaluation from '../../SupProjectDetails/PartOneDetails/StdOrientationEvaluation';
import ProposalEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation';
import MidEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation'
import FinalEvaluation from '../../SupProjectDetails/PartOneDetails/StdProposalEvaluation'

import OverAll from '../../SupProjectDetails/StdOverAll';
import axios from 'axios';
import ReportSubmissionComponent from '../../StdProjectDetails/ReportSubmissionComponent';
import ShowAllUploadedReports from '../../StdProjectDetails/ShowAllUploadedReports';
import StdOverAllReport from '../../StdProjectDetails/StdOverAllReport';





const StdViewProject = () => {
    const [filteredgroupData, setFilteredgroupData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);


    const [showDetails, setShowDetails] = useState(true)
    const [showProjectDetails, setShowProjectDetails] = useState(false)
    const [loadingSpinner, setLoadingSpinner] = useState(false);





    const [approvedProjects, setApprovedProjects] = useState(null);
    const [projectInfoData, setProjectInfoData] = useState(null);
    const [groupData, setgroupData] = useState(null);
    const [groupAttendanceData, setGroupAttendanceData] = useState(null);
    const [penalData, setPenalData] = useState(null);


    // const [addedExamMarks, setAddedExamMarks] = useState(null);
    const [studentForAttendence, setStudentforAttendance] = useState(null);
    const [currentPartStatus, setCurrentPartStatus] = useState('part-I');
    const [examData, setExamData] = useState(null);

    const [ReportDeadline, setReportDeadline] = useState('');
    const [showReportInstance, setShowReportInstance] = useState(false);
    const [createdExam, setCreatedExam] = useState(null);
    const [pendingExamsQueue, setPendingExamsQueue] = useState([]);


    const [overallResultData, setOverallResultData] = useState(null);




    const [OrientationData, setOrientationData] = useState(null);
    const [ProposalData, setProposalData] = useState(null);

    const [Mid_1_data, setMid_1_data] = useState(null);
    const [Final_1_data, setFinal_1_data] = useState(null);

    const [Mid_2_data, setMid_2_data] = useState(null);
    const [Final_2_data, setFinal_2_data] = useState(null);
    const [FetchedGroupReports, setFetchedGroupReports] = useState([]);
    const [showUploadedReports, setShowUploadedReports] = useState(false);
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [isReportRejected, setIsReportRejected] = useState(false);












    const location = useLocation();


    const convertToDDMMYYYY = (isoDate) => {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };



    const fetchAttendance = async (grpId) => {
        try {
            setLoadingSpinner(true);
            const token = JSON.parse(localStorage.getItem('key'));
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


    useEffect(() => { }, [groupAttendanceData])







    const fetchExamData = async (groupId, termId) => {
        try {
            setLoadingSpinner(true);
            const token = JSON.parse(localStorage.getItem('key'));
            const userDataStr = localStorage.getItem('user');
            if (!userDataStr) return;
            //const termId = parsedUserData.term._id;
            console.log(termId, "lookme");
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
            const token = JSON.parse(localStorage.getItem('key'));
            const userDataStr = localStorage.getItem('user');
            if (!userDataStr) return;
            const parsedUserData = JSON.parse(userDataStr);
            const userId = parsedUserData._id;

            // Backend route is /getresultsbygrpId/:groupId/:userId
            const response = await fetch(`/api/results/getresultsbygrpId/${groupId}/${userId}`, {
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
            console.log(data, "Overall Exam Data for exams");

            // Backend returns { result: [...] } where result is an array of student results
            const filterdata = data.result?.filter(student => {
                const sid = student.studentId?._id || student.studentId;
                return sid.toString() === userId.toString();
            }) || [];

            setOverallResultData(filterdata);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    useEffect(() => {
        const userDataStr = localStorage.getItem('user');
        if (!userDataStr || !examData || !examData.groupExams) return;
        const parsedUserData = JSON.parse(userDataStr);
        const userId = parsedUserData._id;

        const exams = examData.groupExams || [];
        const groupId = (exams.length > 0 && exams[0]) ? (exams[0].groupId || "") : ""; // Fallback

        const getStudentMarksForExam = (keywords) => {
            return exams.map(ex => {
                const name = ex.examId?.examName || ex.examName || "";
                const isMatch = keywords.some(kw => name.toLowerCase().includes(kw.toLowerCase()));
                const status = ex.examId?.status || "";
                const isCompleted = status === "Completed" || status === "Finished";

                if (isMatch && isCompleted) {
                    const student = ex.students.find(s => {
                        const sid = s.studentId?._id || s.studentId;
                        return sid.toString() === userId.toString();
                    });
                    if (student) {
                        return {
                            examName: name,
                            obtainedAverage: student.obtainedAverage,
                            obtainedAverageofCLO: student.obtainedAverageofCLO,
                            evaluationsByExaminers: student.evaluationsByExaminers
                        };
                    }
                }
                return null;
            }).filter(Boolean);
        };

        if (currentPartStatus === "part-I") {
            const orientationMarks = getStudentMarksForExam(["Orientation"]);
            setOrientationData(orientationMarks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: orientationMarks
                }]
            } : null);

            const proposalMarks = getStudentMarksForExam(["Proposal"]);
            setProposalData(proposalMarks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: proposalMarks
                }]
            } : null);

            const mid1Marks = getStudentMarksForExam(["Mid-I", "Midterm 1", "Mid I", "Midterm"]);
            setMid_1_data(mid1Marks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: mid1Marks
                }]
            } : null);

            const final1Marks = getStudentMarksForExam(["Final-I", "Final I", "Final Evaluation"]);
            setFinal_1_data(final1Marks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: final1Marks
                }]
            } : null);
        } else {
            const mid2Marks = getStudentMarksForExam(["Mid-II", "Midterm 2", "Mid II"]);
            setMid_2_data(mid2Marks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: mid2Marks
                }]
            } : null);

            const final2Marks = getStudentMarksForExam(["Final-II", "Final II"]);
            setFinal_2_data(final2Marks.length > 0 ? {
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: final2Marks
                }]
            } : null);
        }
    }, [examData, currentPartStatus]);



    useEffect(() => {
        // We need groupData to at least show the members, even if attendance is zero
        if (!groupData || groupData.length === 0) return;

        const getAttendanceMarks = (studentId) => {
            if (!examData || !examData.groupExams) return 0;
            const keywords = currentPartStatus === "part-I" 
                ? ["Attendance-I", "Attendance I"] 
                : ["Attendance-II", "Attendance II"];
            
            const attExam = examData.groupExams.find(ex => {
                const name = ex.examId?.examName || ex.examName || "";
                return keywords.some(kw => name.toLowerCase().includes(kw.toLowerCase()));
            });

            if (attExam) {
                const studentScore = attExam.students?.find(s => {
                    const sid = s.studentId?._id || s.studentId;
                    return sid.toString() === studentId.toString();
                });
                if (studentScore) {
                    return studentScore.obtainedAverage;
                }
            }
            return 0;
        };

        const fypGroups = groupAttendanceData?.fypGroup || [];

        if (fypGroups.length === 0) {
            // No attendance recorded at all
            const members = groupData.map(member => ({
                _id: member._id,
                regNo: member.regno,
                Name: member.name,
                Percentage: getAttendanceMarks(member._id)
            }));
            const attend = [{
                members: members,
                Course: `Design Project (${currentPartStatus})`,
                Meetings: 0,
                _id: null
            }];
            setStudentforAttendance(attend);
            return;
        }

        const attend = fypGroups.map(group => {
            let partStatus = group.partStatus?.find(status => status.part === currentPartStatus);
            if (!partStatus) {
                partStatus = { meetings: [] };
            }
            const totalMeetings = partStatus.meetings?.length || 0;

            const members = group.fypgroup?.groupMembers.map(grpMember => {
                return {
                    _id: grpMember._id,
                    regNo: grpMember.registrationNumber,
                    Name: grpMember.name,
                    Percentage: getAttendanceMarks(grpMember._id),
                };
            }) || [];

            return {
                members: members,
                Course: `Design Project (${currentPartStatus})`,
                Meetings: totalMeetings,
                _id: group._id
            };
        });

        setStudentforAttendance(attend);
    }, [groupAttendanceData, currentPartStatus, groupData, examData]);



    const fetchApprovedGroups = async () => {
        try {
            setLoadingSpinner(true);
            const token = JSON.parse(localStorage.getItem('key'));
            const userDataStr = localStorage.getItem('user');
            if (!userDataStr) {
                console.error("User data not found in local storage");
                setLoadingSpinner(false);
                return;
            }
            const parsedUserData = JSON.parse(userDataStr);
            const userid = parsedUserData._id;
            const role = parsedUserData.role;
            // const filter = "approved";
            const params = new URLSearchParams(location.search);
            const groupId = params.get('id');


            let response;
            if (!groupId && (role === "faculty" || role === "hod" || role === "coordinator")) {


                response = await fetch(`/api/fyp/getfypregistrations/${userid}?`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    },
                });
            }
            else if (role === "Student" || role === "student") {

                response = await fetch(`/api/fyp/getfypregistrationsforStudent/${userid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'

                    },
                });

            }
            else {
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

            if (!data.FYPDatas && !data.filteredFyps) {
                console.log('No FYP registrations found for this student');
                setLoadingSpinner(false);
                return;
            }
            const fypArray = data.filteredFyps || data.FYPDatas;
            if (!fypArray || fypArray.length === 0) {
                console.log('Empty FYP registrations array');
                setLoadingSpinner(false);
                return;
            }
            const filteredData1 = fypArray.map((fyp, index) => ({
                index: 'My Group ',
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

            // AUTO-SELECT for Students: Force open the first project found
            if ((role === "Student" || role === "student") && filteredData1.length > 0) {
                const autoFyp = data.filteredFyps[0];
                viewButtonClick(autoFyp._id, autoFyp.term?._id, autoFyp);
            }
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
            const token = JSON.parse(localStorage.getItem('key'));
            const userDataStr = localStorage.getItem('user');
            if (!userDataStr) return;


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


        const userDataStr = localStorage.getItem('user');
        if (!userDataStr) return;
        const parsedUserData = JSON.parse(userDataStr);
        const role = parsedUserData.role;

        if (role === "Student") {
            console.log(role, "Student hai")
        }

        fetchApprovedGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search])




    useEffect(() => {

    }, [currentPartStatus])





























    const viewButtonClick = async (id, termIdParam = null, groupParam = null) => {
        console.log(id, "viewBtn");
        const fypsList = approvedProjects?.filteredFyps || approvedProjects?.FYPDatas;
        const group = groupParam || (fypsList ? fypsList.find(group => (group._id === id)) : null);
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

        // Populate Panel Data if available
        if (group.assignedPanel && group.assignedPanel.PanelMembers) {
            const panelMembers = group.assignedPanel.PanelMembers.map(pm => ({
                name: pm.member?.name || "N/A",
                designation: pm.member?.designation || "N/A",
                role: pm.role,
                department: group.assignedPanel.department?.departmentName || "CS", // Using panel department or fallback
                term: group.term?.sessionTerm || "N/A",
                panelcode: group.assignedPanel.panelCode
            }));
            setPenalData(panelMembers);
        }


        setShowDetails(false);
        setShowProjectDetails(true);
    };



    const handleGoBack = () => {
        setShowProjectDetails(false);
        setShowDetails(true)
    }
    //VIEW Attendance Details ka button



    const handleViewClickStdAttendanceDetailsP1 = (id) => {
        const fypGroupWithPartStatus = groupAttendanceData?.fypGroup?.find(group => {
            return group.partStatus?.some(partStatus => partStatus.part === currentPartStatus);
        });
        let group = null;
        if (fypGroupWithPartStatus) {
            group = fypGroupWithPartStatus.partStatus.find(partStatus => partStatus.part === currentPartStatus);
        }

        const meeting = group?.meetings ? group.meetings.filter(meeting =>
            meeting.memberAttendances?.some(attendance => attendance.member === id)
        ) : [];

        const studentAttendance = meeting.reduce((acc, curr) => {
            const attendance = curr.memberAttendances?.find(attendance => attendance.member === id);
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

        const selectedStudentInfo = groupData?.find(member => member._id === id);
        const selectedStudent = {
            Meeting: studentAttendance,
            Course: `Design Project (${currentPartStatus})`,
            student: selectedStudentInfo,
        };
        setSelectedStudent(selectedStudent);
    }








    const handleViewClickStdAttendanceDetailsP2 = (id) => {
        const fypGroupWithPartStatus = groupAttendanceData?.fypGroup?.find(group => {
            return group.partStatus?.some(partStatus => partStatus.part === currentPartStatus);
        });
        let group = null;
        if (fypGroupWithPartStatus) {
            group = fypGroupWithPartStatus.partStatus.find(partStatus => partStatus.part === currentPartStatus);
        }

        const meeting = group?.meetings ? group.meetings.filter(meeting =>
            meeting.memberAttendances?.some(attendance => attendance.member === id)
        ) : [];

        const studentAttendance = meeting.reduce((acc, curr) => {
            const attendance = curr.memberAttendances?.find(attendance => attendance.member === id);
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

        const selectedStudentInfo = groupData?.find(member => member._id === id);
        const selectedStudent = {
            Meeting: studentAttendance,
            Course: `Design Project (${currentPartStatus})`,
            student: selectedStudentInfo,
        };
        setSelectedStudent(selectedStudent);
    }


    // useEffect(() => {
    //     const currentDate = new Date(); // Current date

    //     if (ReportDeadline) {
    //       const ReportDeadlineDate = new Date(ReportDeadline); // Convert ReportDeadline to Date object

    //       // Zero out the time components for comparison
    //       currentDate.setHours(0, 0, 0, 0);
    //       ReportDeadlineDate.setHours(0, 0, 0, 0);

    //       console.log("First Checkign Report Deadline", ReportDeadlineDate);
    //       console.log("First Checking Current Date", currentDate);

    //       if (ReportDeadlineDate < currentDate) {
    //         console.log("Not running Report Deadline if statement");
    //         setShowReportInstance(false);
    //       }
    //     }
    //   }, [ReportDeadline]);







    const CheckReportExist = async () => {
        const key = JSON.parse(localStorage.getItem("key"));
        try {
            const fypDataStr = localStorage.getItem("FYPData");
            if (!fypDataStr) {
                console.log("No FYP Data in LocalStorage, skipping CheckReportExist");
                return;
            }
            const fyp = JSON.parse(fypDataStr);
            const groupId = fyp._id;

            if (!createdExam || !createdExam.ExamType) {
                console.log("createdExam or ExamType is missing/not ready, skipping CheckReportExist");
                return;
            }

            const examId = createdExam.ExamType._id;
            console.log("Inside CheckReportExist — fetching full report to check status");

            const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

            // Fetch full reports to check status (not just existence)
            const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);

            if (response.status === 200) {
                const reports = response.data.reports || [];
                // Find the report matching this specific exam
                const matchingReport = reports.find(r => r.Exam?._id === examId || r.Exam === examId);

                if (matchingReport) {
                    if (matchingReport.status === 'rejected') {
                        // Supervisor denied it — re-open the form with feedback
                        console.log("Report REJECTED — re-opening submission form");
                        setRejectionFeedback(matchingReport.supervisorFeedback || 'Your report was denied. Please fix the issues and resubmit.');
                        setIsReportRejected(true);
                        setShowReportInstance(true);
                    } else {
                        // Pending or approved — hide form
                        console.log("Report exists with status:", matchingReport.status, "— hiding form");
                        setRejectionFeedback('');
                        setIsReportRejected(false);
                        setShowReportInstance(false);
                    }
                } else {
                    console.log('No matching report for this exam — form stays visible if within deadline');
                    setIsReportRejected(false);
                }
            }
        } catch (error) {
            console.error('Error fetching Reports:', error);
        }
    };


    const fetchUploadedReports = async () => {
        const key = JSON.parse(localStorage.getItem("key"));
        try {
            const fypDataStr = localStorage.getItem("FYPData");
            if (!fypDataStr) {
                console.log("No FYPData in localStorage, skipping fetchUploadedReports");
                return;
            }
            const fyp = JSON.parse(fypDataStr);
            const groupId = fyp._id;

            const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
            console.log("Request Sent");
            const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);

            if (response.status === 200) {
                console.log("Fetched Reportsssssssssssssss", response.data);
                setFetchedGroupReports(response.data.reports);

            } else {
                console.log('Error fetching Uploaded Reports');
            }
        } catch (error) {
            console.error('Error fetching Reports:', error);
        }
    };

    useEffect(() => {
        fetchCreatedExamReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        fetchUploadedReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleGoBackFromRep = () => {
        setShowReportInstance(false); // Reset showReportInstance to false when going back
    };

    const fetchCreatedExamReport = async () => {
        const key = JSON.parse(localStorage.getItem("key"));
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const termId = user.term?._id || user.term;
            if (!termId) {
                console.log("No term found for this student — skipping report check");
                return;
            }

            const rawRole = user.role || "Student";
            const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

            console.log("Fetching created exams for termId:", termId, "role:", role);
            const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

            // Query Created Exams directly — triggers as soon as coordinator CREATES an exam
            const response = await axios.get(
                `/api/ExamCreationRoutes/getParticularExam?role=${role}&termId=${termId}`,
                config
            );

            if (response.status === 200) {
                const exams = response.data.exams;
                if (!exams || exams.length === 0) {
                    console.log("No active created exams found for this term/role");
                    setShowReportInstance(false);
                    return;
                }

                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                console.log("[REPORT-DEBUG] Today string:", todayStr, "| Total exams received:", exams.length);

                // Step 1: Exclude Attendance exams and filter by date window
                const eligibleExams = exams.filter(exam => {
                    // Exclude Attendance — no report submission needed for attendance
                    if (exam.portalCategory === "Attendance") {
                        console.log("Skipping Attendance exam:", exam.ExamType?.examName);
                        return false;
                    }
                    const announced = exam.AnnouncedDate?.split('T')[0];
                    const deadline = exam.ReportDeadline?.split('T')[0];
                    if (announced && deadline) {
                        const inWindow = announced <= todayStr && todayStr <= deadline;
                        if (!inWindow) {
                            console.log("Exam outside date window:", exam.ExamType?.examName, "Announced:", announced, "Deadline:", deadline, "Today:", todayStr);
                        }
                        return inWindow;
                    }
                    // If no date restrictions set, consider it active if announced
                    if (announced && !deadline) return announced <= todayStr;
                    return true;
                });

                console.log("Eligible exams (non-Attendance, within date window):", eligibleExams.length);

                if (eligibleExams.length === 0) {
                    console.log("No eligible exams within date window");
                    setShowReportInstance(false);
                    return;
                }

                // Step 2: Check which exams don't have a submitted (pending/approved) report yet
                const fypDataStr = localStorage.getItem("FYPData");
                let groupId = null;
                if (fypDataStr) {
                    groupId = JSON.parse(fypDataStr)._id;
                }

                let unreportedExams = eligibleExams;
                if (groupId) {
                    try {
                        const reportsRes = await axios.get(
                            `/api/StudentReport/gettingGroupReports/${groupId}`, config
                        );
                        const existingReports = reportsRes?.data?.reports || [];
                        console.log("Existing reports for group:", existingReports.length);

                        unreportedExams = eligibleExams.filter(exam => {
                            const examTypeId = exam.ExamType?._id || exam.ExamType;
                            const matchingReport = existingReports.find(r => {
                                const reportExamId = r.Exam?._id || r.Exam;
                                return reportExamId === examTypeId;
                            });

                            if (!matchingReport) {
                                // No report exists — needs submission
                                return true;
                            }
                            if (matchingReport.status === 'rejected') {
                                // Report was rejected — store feedback and allow resubmission
                                exam._rejectionFeedback = matchingReport.supervisorFeedback || 'Your report was denied. Please fix the issues and resubmit.';
                                return true;
                            }
                            // Report is pending or approved — already submitted, skip
                            console.log("Report already submitted for exam:", exam.ExamType?.examName, "Status:", matchingReport.status);
                            return false;
                        });
                    } catch (reportErr) {
                        console.log("Could not check existing reports (group may have none):", reportErr?.response?.status);
                        // If reports check fails, show form for all eligible exams
                    }
                }

                console.log("Unreported exams needing submission:", unreportedExams.length);

                // Step 3: Queue all unreported exams and show the first one
                if (unreportedExams.length > 0) {
                    setPendingExamsQueue(unreportedExams);
                    const firstExam = unreportedExams[0];
                    setCreatedExam(firstExam);

                    // Handle rejection feedback for the first exam
                    if (firstExam._rejectionFeedback) {
                        setRejectionFeedback(firstExam._rejectionFeedback);
                        setIsReportRejected(true);
                    } else {
                        setRejectionFeedback('');
                        setIsReportRejected(false);
                    }

                    setShowReportInstance(true);
                    if (firstExam.ReportDeadline) {
                        setReportDeadline(convertToDDMMYYYY(firstExam.ReportDeadline.split('T')[0]));
                    }
                    console.log("✅ Report Submission VISIBLE for exam:", firstExam.ExamType?.examName, "| Queue size:", unreportedExams.length);
                } else {
                    console.log("All reports already submitted — hiding form");
                    setShowReportInstance(false);
                }
            }
        } catch (error) {
            console.error('Error fetching created exam for report trigger:', error);
            setShowReportInstance(false);
        }
    };





    const viewReportClick = (fypTitle) => {

        setShowUploadedReports(true);
    }

    const handlePartStatus = (status) => {
        setCurrentPartStatus(status);
    };


    const handleRepInstance = () => {
        console.log("Report submitted successfully — checking for next exam in queue");
        // Remove the just-submitted exam from queue
        const remaining = pendingExamsQueue.slice(1);
        setPendingExamsQueue(remaining);

        if (remaining.length > 0) {
            // Show the next exam's report form
            const nextExam = remaining[0];
            setCreatedExam(nextExam);

            // Handle rejection feedback for next exam
            if (nextExam._rejectionFeedback) {
                setRejectionFeedback(nextExam._rejectionFeedback);
                setIsReportRejected(true);
            } else {
                setRejectionFeedback('');
                setIsReportRejected(false);
            }

            if (nextExam.ReportDeadline) {
                setReportDeadline(convertToDDMMYYYY(nextExam.ReportDeadline.split('T')[0]));
            }
            setShowReportInstance(true);
            console.log("➡️ Advancing to next exam:", nextExam.ExamType?.examName, "| Remaining:", remaining.length);
        } else {
            // All reports submitted — show normal project page
            setCreatedExam(null);
            setShowReportInstance(false);
            console.log("✅ All reports submitted — showing project details");
        }
    };

    const BackToPrevious = () => {
        setShowUploadedReports(false);
    }



    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'StudentProjectDetails';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            if (selectedTab) {
                const topOffset = selectedTab.offsetTop;
                indicator.style.top = `${topOffset}px`;
            }
        }
    }, []);
    console.log("[RENDER-DEBUG] loadingSpinner:", loadingSpinner, "| showUploadedReports:", showUploadedReports, "| showReportInstance:", showReportInstance, "| createdExam:", createdExam?.ExamType?.examName || 'none', "| pendingQueue:", pendingExamsQueue.length);
    return (
        <>
            {loadingSpinner ? (
                <div>
                    <LoadingSpinner />
                </div>
            ) : showUploadedReports ? (
                <ShowAllUploadedReports accordionId={206} handleBack={BackToPrevious} FetchedGroupReports={FetchedGroupReports} />
            ) :
                showReportInstance ? (
                    <ReportSubmissionComponent accordionId={202} onGoBack={handleGoBackFromRep} createdExam={createdExam} ReportInst={handleRepInstance} rejectionFeedback={rejectionFeedback} currentIndex={pendingExamsQueue.length > 0 ? pendingExamsQueue.indexOf(createdExam) + 1 : 1} totalExams={pendingExamsQueue.length} />
                ) : (
                    <div className='bg-slate-100 w-full h-full'>
                        {showDetails && (<div className='mx-10 pt-12 flex flex-col gap-3' >
                            {filteredgroupData && (<div>

                                <AccordionGenericTable
                                    groupData={filteredgroupData}
                                    headers={['FYP Title', 'Members', 'Term', 'Status',]}
                                    accordionId={15}
                                    buttons={[
                                        {
                                            bheading: 'Details',
                                            text: 'View',
                                            click: viewButtonClick,
                                        },
                                        {
                                            bheading: 'Report',
                                            text: 'View',
                                            click: viewReportClick,
                                        },
                                    ]}
                                    tabheading={'My Project Details'}
                                    fields={['fypTitle', 'members', 'term', 'reqStatus']}
                                    memberFields={['Name', 'RegistrationNo']}
                                />
                            </div>)}
                        </div>)}
                        {showProjectDetails && (
                            <div className='mx-10 pt-12 flex flex-col gap-3 relative'>
                                <div className="mb-4 border-b border-gray-200 font-semibold">
                                    <ul className="flex flex-wrap -mb-px justify-around text-sm font-medium text-center" role="tablist">
                                        <li role="presentation">
                                            <button 
                                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200 ${
                                                    currentPartStatus === "part-I"
                                                        ? "text-[#514B96] border-[#514B96] font-bold"
                                                        : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                                                }`}
                                                type="button" 
                                                role="tab" 
                                                aria-selected={currentPartStatus === "part-I"}
                                                onClick={() => handlePartStatus("part-I")}
                                            >
                                                Part 1
                                            </button>
                                        </li>
                                        <li role="presentation">
                                            <button 
                                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200 ${
                                                    (groupData && groupData[0] && groupData[0].partStatus !== 'part-II') 
                                                        ? 'text-gray-400 border-transparent cursor-not-allowed' 
                                                        : currentPartStatus === "part-II"
                                                        ? "text-[#514B96] border-[#514B96] font-bold"
                                                        : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                                                }`}
                                                type="button"
                                                role="tab"
                                                aria-selected={currentPartStatus === "part-II"}
                                                onClick={() => groupData && groupData[0] && groupData[0].partStatus === 'part-II' && handlePartStatus("part-II")}
                                                disabled={groupData && groupData[0] && groupData[0].partStatus !== 'part-II'}
                                            >
                                                Part 2
                                            </button>
                                        </li>
                                        <li role="presentation">
                                            <button
                                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200 ${
                                                    currentPartStatus === "all"
                                                        ? "text-[#514B96] border-[#514B96] font-bold"
                                                        : "text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300"
                                                }`}
                                                type="button"
                                                role="tab"
                                                aria-selected={currentPartStatus === "all"}
                                                onClick={() => handlePartStatus("all")}
                                            >
                                                Overall
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="w-full h-full">
                                    <div className={`rounded-lg bg-gray-50 ${currentPartStatus === "part-I" ? "" : "hidden"}`} role="tabpanel">
                                        <div className="partOneDetails flex flex-col gap-3">
                                            <ProjectInfo accordionId={14} data={projectInfoData} />
                                            <GroupDetails accordionId={1} data={groupData} />
                                            {studentForAttendence && (<SupAttendanceDetailsofStd data={studentForAttendence} accordionId={16} handleViewClick={handleViewClickStdAttendanceDetailsP1} accordText="Attendance I Details" />)}
                                            {selectedStudent && (<AttendanceTable accordionId={2} data={selectedStudent} accordText="Attendance I Details" />)}
                                            {penalData && (<PanelDetails accordionId={3} data={penalData} />)}
                                            {OrientationData && <OrientationEvaluation accordionId={4} data={OrientationData} />}
                                            {ProposalData && <ProposalEvaluation accordionId={5} data={ProposalData} accordText="Proposal Evaluation" />}
                                            {Mid_1_data && <MidEvaluation accordionId={7} data={Mid_1_data} accordText="Mid I Evaluation" />}
                                            {Final_1_data && <FinalEvaluation accordionId={8} data={Final_1_data} accordText="Final I Evaluation" />}
                                        </div>
                                    </div>

                                    <div className={`rounded-lg bg-gray-50 ${currentPartStatus === "part-II" ? "" : "hidden"}`} role="tabpanel">
                                        <div className="partTwoDetails flex flex-col gap-3">
                                            <SupAttendanceDetailsofStd data={studentForAttendence} accordionId={17} handleViewClick={handleViewClickStdAttendanceDetailsP2} accordText="Attendance II Details" />
                                            {selectedStudent && (<AttendanceTable accordionId={10} data={selectedStudent} accordText="Attendance II Details" />)}
                                            {Mid_2_data && <MidEvaluation accordionId={11} data={Mid_2_data} accordText="Mid II Evaluation" />}
                                            {Final_2_data && <FinalEvaluation accordionId={12} data={Final_2_data} accordText="Final II Evaluation" />}
                                        </div>
                                    </div>

                                    <div className={`rounded-lg bg-gray-50 ${currentPartStatus === "all" ? "" : "hidden"}`} role="tabpanel">
                                        <div className="OverallEvaluationDetails flex flex-col gap-3">
                                            <StdOverAllReport />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-end mt-5'>
                                    <button className="text-white bg-primary hover:bg-[#3c3773] transition-all duration-200 border-0 py-2.5 px-7 focus:outline-none rounded-lg text-lg shadow-md font-medium" onClick={handleGoBack}>Back</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </>

    )
}

export default StdViewProject
