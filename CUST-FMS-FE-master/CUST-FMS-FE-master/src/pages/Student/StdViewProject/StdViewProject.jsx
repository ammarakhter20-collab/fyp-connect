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
    const [createdExam, setCreatedExam] = useState('');


    const [overallResultData, setOverallResultData] = useState(null);




    const [OrientationData, setOrientationData] = useState(null);
    const [ProposalData, setProposalData] = useState(null);

    const [Mid_1_data, setMid_1_data] = useState(null);
    const [Final_1_data, setFinal_1_data] = useState(null);

    const [Mid_2_data, setMid_2_data] = useState(null);
    const [Final_2_data, setFinal_2_data] = useState(null);
    const [FetchedGroupReports, setFetchedGroupReports] = useState('');
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

                if (isMatch) {
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
            setOrientationData({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Orientation"])
                }]
            });

            setProposalData({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Proposal"])
                }]
            });

            setMid_1_data({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Mid-I", "Midterm 1", "Mid I", "Midterm"])
                }]
            });

            setFinal_1_data({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Final-I", "Final I", "Final Evaluation"])
                }]
            });
        } else {
            setMid_2_data({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Mid-II", "Midterm 2", "Mid II"])
                }]
            });

            setFinal_2_data({
                groupId,
                students: [{
                    regNo: parsedUserData.registrationNumber,
                    studentName: parsedUserData.name,
                    _Id: userId,
                    exam: getStudentMarksForExam(["Final-II", "Final II"])
                }]
            });
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
                )?.length || 0;

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
            const fyp = JSON.parse(localStorage.getItem("FYPData"));
            const groupId = fyp._id;

            // Extract the term from user.term
            // const termId = user.term;
            // console.log("Checking Term", termId);
            const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
            console.log("Request Sent");
            const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);

            if (response.status === 200) {
                console.log("Fetched Reportsssssssssssssss", response.data);
                setFetchedGroupReports(response.data.reports);
                // setShowReportInstance(false);

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
        CheckReportExist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdExam])
    useEffect(() => {
        fetchUploadedReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleGoBackFromRep = () => {
        // setDetailsViewClick(false);
        setShowReportInstance(false); // Reset showReportInstance to false when going back
    };

    const fetchCreatedExamReport = async () => {
        const key = JSON.parse(localStorage.getItem("key"));
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);

            const termId = user.term;
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
                    return;
                }

                const examEntry = exams[exams.length - 1];
                setCreatedExam(examEntry);

                const reportDeadlineRaw = examEntry?.ReportDeadline;
                const announcedDateRaw = examEntry?.AnnouncedDate;

                console.log("Exam found:", examEntry?.ExamType?.examName);

                if (announcedDateRaw && reportDeadlineRaw) {
                    // Use UTC date strings (YYYY-MM-DD) to avoid timezone issues
                    const announcedStr = announcedDateRaw.split('T')[0];
                    const deadlineStr = reportDeadlineRaw.split('T')[0];
                    const todayStr = new Date().toISOString().split('T')[0];

                    console.log("Date comparison (UTC strings) - Announced:", announcedStr, "Deadline:", deadlineStr, "Today:", todayStr);

                    if (announcedStr <= todayStr && todayStr <= deadlineStr) {
                        console.log("✅ Report Submission VISIBLE — within date window");
                        setShowReportInstance(true);
                        setReportDeadline(convertToDDMMYYYY(deadlineStr));
                    } else {
                        console.log("⚠️ Report Submission HIDDEN — outside date window. Announced:", announcedStr, "Deadline:", deadlineStr, "Today:", todayStr);
                        setShowReportInstance(false);
                    }
                } else {
                    console.log("✅ Report Submission VISIBLE — exam exists, no date restriction");
                    setShowReportInstance(true);
                    if (reportDeadlineRaw) setReportDeadline(convertToDDMMYYYY(reportDeadlineRaw.split('T')[0]));
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No active created exams for this student's term — report not available yet");
                setShowReportInstance(false);
            } else {
                console.error('Error fetching created exam for report trigger:', error);
            }
        }
    };

    useEffect(() => {
        const currentDate = new Date();

        if (ReportDeadline) {
            const ReportDeadlineDate = new Date(ReportDeadline);

            currentDate.setHours(0, 0, 0, 0);
            ReportDeadlineDate.setHours(0, 0, 0, 0);

            console.log("First Checking Report Deadline", ReportDeadlineDate);
            console.log("First Checking Current Date", currentDate);

            if (ReportDeadlineDate < currentDate) {
                // Only hide the form if the report is NOT rejected
                // A rejected report must always be re-submittable
                if (!isReportRejected) {
                    console.log("Deadline passed and report not rejected — hiding form");
                    setShowReportInstance(false);
                } else {
                    console.log("Deadline passed BUT report is rejected — keeping form open for resubmission");
                }
            }
        }
    }, [ReportDeadline, isReportRejected]);





    const viewReportClick = (fypTitle) => {

        setShowUploadedReports(true);
    }

    const handlePartStatus = (status) => {
        setCurrentPartStatus(status);
    };


    const handleRepInstance = () => {
        console.log("Hanlde SUccess Responseeeeeeeeeeee Calleddddddddddddddddddddd");
        setShowReportInstance(false);
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
                    <ReportSubmissionComponent accordionId={202} onGoBack={handleGoBackFromRep} createdExam={createdExam} ReportInst={handleRepInstance} rejectionFeedback={rejectionFeedback} />
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
                                            <GroupDetails accordionId={1} data={groupData} />
                                            {studentForAttendence && (<SupAttendanceDetailsofStd data={studentForAttendence} accordionId={16} handleViewClick={handleViewClickStdAttendanceDetailsP1} accordText="Attendance I Details" />)}
                                            {selectedStudent && (<AttendanceTable accordionId={2} data={selectedStudent} accordText="Attendance I Details" />)}
                                            {penalData && (<PanelDetails accordionId={3} data={penalData} />)}
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
                                            {selectedStudent && (<AttendanceTable accordionId={10} data={selectedStudent} accordText="Attendance II Details" />)}
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
                                    <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={handleGoBack}>Back</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </>

    )
}

export default StdViewProject
