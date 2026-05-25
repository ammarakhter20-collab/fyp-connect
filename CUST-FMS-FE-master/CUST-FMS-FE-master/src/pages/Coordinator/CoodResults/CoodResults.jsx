import React, { useState, useEffect } from 'react'
import CardOneButton from '../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';

import { initFlowbite, } from 'flowbite';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { baseUrl } from '../../../Components/config/config';
import ProjectWiseReportTable from './ProjectWiseReportTable';
import ProjectDetailsModal from './ProjectDetailsModal';
import ProjectExamResultsModal from './ProjectExamResultsModal';



const CoodResults = () => {

    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [showResultsSelectCard, setShowResultsSelectCard] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showOverallResult, setShowOverAllResult] = useState(false);
    const [showPortalResult, setShowPortalResult] = useState(false);
    const [termData, setTermData] = useState([]);

    const [term, setTerm] = useState('');
    const [exam, setExam] = useState('');
    const [AllExamTypes, setAllExamTypes] = useState([]);

    const [resultsdata, setResultsData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [tabheading, setTabHeading] = useState(null);
    const [overAllResult, setOverAllResult] = useState(null)
    const [portalResult, setPortalResult] = useState(null)
    const [isCombinedView, setIsCombinedView] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Promote to Part II states
    const [isPromoteEnabled, setIsPromoteEnabled] = useState(false);
    const [loadingPromote, setLoadingPromote] = useState(false);
    const [promoteMessage, setPromoteMessage] = useState('');

    const [hasPartII, setHasPartII] = useState(false);
    const [partStatusFilter, setPartStatusFilter] = useState('combined'); // 'combined', 'part-I', 'part-II'

    // Project-wise report states
    const [showProjectWiseReport, setShowProjectWiseReport] = useState(false);
    const [projectWiseData, setProjectWiseData] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [showProjectExamResults, setShowProjectExamResults] = useState(false);

    const handletermChange = async (selectedOption) => {
        setTerm(selectedOption);
        setHasPartII(false);
        setPartStatusFilter('combined'); // Reset filter
        setIsCombinedView(false);
        setIsPromoteEnabled(false);
        setPromoteMessage('');

        if (selectedOption && selectedOption.value) {
            await checkPartIIStatus(selectedOption.value);
            await checkPromotionEligibility(selectedOption.value);
        }
    };

    const handleExamChange = (selectedOption) => {
        setExam(selectedOption);
    };

    const handlePartStatusChange = (e) => {
        setPartStatusFilter(e.target.value);
    };

    const handleViewResult = () => {
        setResultsData(null);
        setIsCombinedView(false);

        console.log("Term ID:", term && term.value);
        console.log("Exam Name:", exam && exam.value);
        console.log("Part Status Filter:", partStatusFilter);

        if (exam.value === 'portal_result_list') {
            console.log("Portal Result");
            fetchResultsData(term.value, exam.value);
            setShowResultsSelectCard(false);
            setShowResult(false);
            setShowOverAllResult(false);
            setShowPortalResult(true);
            setShowProjectWiseReport(false);
        }
        else if (exam.value === 'overall_result_list') {
            console.log("Overall Result");
            fetchResultsData(term.value, exam.value);
            setShowResultsSelectCard(false);
            setShowResult(false);
            setShowPortalResult(false);
            setShowOverAllResult(true);
            setShowProjectWiseReport(false);
        }
        else if (exam.value === 'project_wise_report') {
            console.log("Project-Wise Report");
            fetchProjectWiseReport(term.value);
            setShowResultsSelectCard(false);
            setShowResult(false);
            setShowPortalResult(false);
            setShowOverAllResult(false);
            setShowProjectWiseReport(true);
        } else {
            fetchResultsData(term.value, exam.value);
            setShowResultsSelectCard(false);
            setShowOverAllResult(false);
            setShowPortalResult(false);
            setShowResult(true);
            setShowProjectWiseReport(false);
        }
        setTabHeading(exam.value);
    };

    const handleViewResults = () => {
        setShowResultsSelectCard(true);
    };

    const fetchResultsData = async (termId, examName) => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            let response = '';

            // Construct query string for partStatus
            const queryParams = hasPartII ? `?partStatus=${partStatusFilter}` : '';

            // Portal Result
            if (examName === 'portal_result_list') {
                console.log(`Fetching Portal Result with filter: ${queryParams || 'default'}`);
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/portal-report/${termId}${queryParams}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error + (errorData.missing ? ': ' + errorData.missing.join(', ') : ''));
                }

                const data = await response.json();
                console.log('Portal Report Data:', data);

                if (data.success) {
                    const portalMap = {};
                    data.data.forEach(student => {
                        portalMap[student.registrationNumber] = student;
                    });
                    setPortalResult(portalMap);
                    setNotifications(data.notifications || []);
                    // Update heading to reflect view
                    setTabHeading(`Portal Result (${data.partStatus || 'Combined'})`);
                } else {
                    console.error('Portal Report Error:', data.error);
                    alert(`Error: ${data.error}`);
                }
            }
            // Overall Result
            else if (examName === 'overall_result_list') {
                console.log(`Fetching Overall FYP Result with filter: ${queryParams || 'default'}`);
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/overall-fyp-result/${termId}${queryParams}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }

                const data = await response.json();
                console.log('Overall FYP Result Data:', data);

                if (data.success) {
                    setOverAllResult(data.data); // data.data is now Array of students with dynamic .exams
                    setNotifications(data.notifications || []);
                    setTabHeading(`Overall Result (${data.partStatus || 'Combined'})`);
                }
 else {
                    console.error('Overall Result Error:', data.error);
                    alert(`Error: ${data.error}`);
                }
            }
            // Individual exam results
            else {
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/getExamEvaluations/${termId}/${examName}`, {
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
                const EVAL = data.evaluation.evaluations;
                setResultsData(EVAL);

                if (EVAL && Array.isArray(EVAL)) {
                    let students = [];
                    EVAL?.forEach(instance => {
                        if (instance.students) {
                            students = students.concat(instance.students);
                        }
                    });
                    setStudents(students);

                    if ((students.length > 0) && (exam.value === "Attendance" || exam.value === "Orientation")) {
                        const attendance_percentage = getAttendanceandOrientationMarks(students);
                        setQuestions(attendance_percentage);
                    }
                    else {
                        const ques = getQuestions(students);
                        setQuestions(ques);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching Data:', error.message);
            alert('Error fetching data: ' + error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    // Check if term has Part II students
    const checkPartIIStatus = async (termId) => {
        try {
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/check-part-ii-status/${termId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Failed to check Part II status');
                return;
            }

            const data = await response.json();
            console.log('Part II status check:', data);

            if (data.success && data.hasPartII) {
                setHasPartII(true);
            } else {
                setHasPartII(false);
            }
        } catch (error) {
            console.error('Error checking Part II status:', error);
        }
    };

    const checkPromotionEligibility = async (termId) => {
        try {
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`${baseUrl}/api/CreateFypReg/check-promotion-eligibility/${termId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Failed to check promotion eligibility');
                setIsPromoteEnabled(false);
                return;
            }

            const data = await response.json();
            if (data.success && data.eligible) {
                setIsPromoteEnabled(true);
                setPromoteMessage('');
            } else {
                setIsPromoteEnabled(false);
                setPromoteMessage(data.message || 'Not eligible for promotion');
            }
        } catch (error) {
            console.error('Error checking promotion eligibility:', error);
            setIsPromoteEnabled(false);
        }
    };

    const handlePromoteToPartII = async () => {
        if (!term || !term.value) return;

        if (!window.confirm("Are you sure you want to promote all eligible Part I groups to Part II? This action cannot be undone easily.")) {
            return;
        }

        try {
            setLoadingPromote(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(`${baseUrl}/api/CreateFypReg/promote-to-part-ii`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ termId: term.value })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(data.message || `Successfully promoted groups to Part II`);
                // Re-check status
                await checkPartIIStatus(term.value);
                await checkPromotionEligibility(term.value);
            } else {
                alert(`Error: ${data.error || 'Failed to promote groups'}`);
            }
        } catch (error) {
            console.error('Error promoting groups:', error);
            alert('Error promoting groups: ' + error.message);
        } finally {
            setLoadingPromote(false);
        }
    };






















    // Fetch Project-Wise Report
    const fetchProjectWiseReport = async (termId) => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/project-wise-report/${termId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch project-wise report');
            }

            const data = await response.json();
            console.log('Project-Wise Report Data:', data);

            if (data.success) {
                setProjectWiseData(data.data);
                setTabHeading(`Project-Wise Report - ${data.termName}`);
            } else {
                console.error('Project-Wise Report Error:', data.error);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching project-wise report:', error);
            alert('Error fetching project-wise report: ' + error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    // Modal handlers
    const handleViewProjectDetails = (project) => {
        setSelectedProject(project);
        setShowProjectDetails(true);
    };

    const handleViewProjectExamResults = (project) => {
        setSelectedProject(project);
        setShowProjectExamResults(true);
    };


    const fetchTermData = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            // const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`${baseUrl}/api/auth/getTermdata`, {
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
            console.log(data, 'fetched Term Data')
            const dataofterm = data.fypTerms.map((term, index) => ({
                ...term,
                label: term.sessionTerm,
                value: term._id,
            }))
            setTermData(dataofterm);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };
    const fetchExamTypes = async () => {
        try {
            setLoadingSpinner(true);
            const key = JSON.parse(localStorage.getItem("key"));
            const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
            const url = `${baseUrl}/api/ExamType/GetCreatedExamType`;
            const response = await axios.get(url, config);

            if (response.status !== 497) {
                if (!response.data || !response.data.examTypes) {
                    console.error('Error fetching Exam Types:', response.statusText);
                    return;
                }
            } else {
                Navigate('/login');
            }

            console.log("Checking Exam Types", response.data.examTypes);

            // Transform exam types to the format expected by react-select
            const examOptions = response.data.examTypes.map((exam) => ({
                label: exam.examName,
                //  value: exam._id,
                value: exam.examName,
            }));

            // Add two more options
            const additionalOptions = [
                { label: 'Overall Result List', value: 'overall_result_list' },
                { label: 'Portal Result List', value: 'portal_result_list' },
                { label: 'Project-Wise Report', value: 'project_wise_report' }
            ];

            // Concatenate existing options with additional options
            const allOptions = [...additionalOptions, ...examOptions];

            setAllExamTypes(allOptions);
        } catch (error) {
            console.error('Error fetching Exam Types:', error.response ? error.response.data : error.message);
        } finally {
            setLoadingSpinner(false);
        }
    }







    const getQuestions = (students) => {
        const questions = new Map();

        // Temporary storage to calculate averages
        const questionSums = {};
        const questionCounts = {};

        students?.forEach(student => {
            student.evaluationsByExaminers?.forEach(examiner => {
                examiner.examinations?.forEach(examination => {
                    examination.questions?.forEach(question => {
                        const shortCode = question.shortCode;

                        if (!questionSums[shortCode]) {
                            questionSums[shortCode] = 0;
                            questionCounts[shortCode] = 0;
                        }

                        questionSums[shortCode] += question.marksObtained;
                        questionCounts[shortCode] += 1;

                        questions.set(shortCode, {
                            question: question.question,
                            shortCode: question.shortCode,
                            marksObtained: 0, // Placeholder for average
                            totalMarks: question.totalMarks
                        });
                    });
                });
            });
        });

        // Calculate averages and update the questions map
        questions.forEach((value, key) => {
            value.marksObtained = questionSums[key] / questionCounts[key];
        });

        return Array.from(questions.values());
    };









    const getAttendanceandOrientationMarks = (students) => {

        console.log(students, "Students in orientation")
        const attendanceMarks = [];
        students.forEach(student => {
            student.evaluationsByExaminers.forEach(examiner => {
                attendanceMarks.push({
                    student: student.name,
                    regno: student.registrationNumber,
                    totalWeightage: examiner.totalWeightage,
                    marksObtained: examiner.marks
                });
            });
        });
        return attendanceMarks;
    };

    const handleViewAttendanceClick = () => { }

    const exportTableToCSV = (tableId, filename) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        let csvContent = "";
        const rows = table.querySelectorAll("tr");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.querySelectorAll("td, th");
            const rowData = [];
            for (let j = 0; j < cols.length; j++) {
                let data = cols[j].innerText.replace(/"/g, '""');
                if (data.search(/("|,|\n)/g) >= 0) {
                    data = `"${data}"`;
                }
                rowData.push(data);
            }
            csvContent += rowData.join(",") + "\n";
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ─── Excel Export: Portal Result (plain, no colours, no Total/Status) ────
    const exportPortalResultToExcel = () => {
        if (!portalResult || Object.keys(portalResult).length === 0) {
            alert('No portal result data to export.'); return;
        }
        const showPartI  = partStatusFilter === 'combined' || partStatusFilter === 'part-I';
        const showPartII = partStatusFilter === 'combined' || partStatusFilter === 'part-II';
        const th = (text, cs = 1, rs = 1) =>
            `<th colspan="${cs}" rowspan="${rs}" style="font-weight:bold;border:1px solid #888;padding:4px 6px;text-align:center;">${text}</th>`;
        const td = (val) =>
            `<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;">${val ?? ''}</td>`;

        // Header row 1 – section spans
        let hdr1 = th('Reg No',1,2)+th('Name',1,2);
        if (showPartI)  hdr1 += th('Part I', 14);
        if (showPartII) hdr1 += th('Part II', 14);

        // Header row 2 – column labels (no Total/Status)
        const colLabels = () => [
            th('Q1'),th('Q2'),th('Q3'),th('Q4'),
            th('A1'),th('A2'),th('A3'),th('A4'),
            th('M1'),th('M2'),
            th('F1'),th('F2'),th('F3'),th('F4'),
        ].join('');
        let hdr2 = '';
        if (showPartI)  hdr2 += colLabels();
        if (showPartII) hdr2 += colLabels();

        const fv = (v) => (v != null ? parseFloat(v).toFixed(2) : '0.00');
        const dataRows = Object.values(portalResult).map((s) => {
            let r = td(s.registrationNumber)+td(s.name);
            if (showPartI) {
                r+=td(fv(s.Q1_1))+td(fv(s.Q2_1))+td(fv(s.Q3_1))+td(fv(s.Q4_1));
                r+=td(fv(s.A1_1))+td(fv(s.A2_1))+td(fv(s.A3_1))+td(fv(s.A4_1));
                r+=td(fv(s.M1_1))+td(fv(s.M2_1));
                r+=td(fv(s.F1_1))+td(fv(s.F2_1))+td(fv(s.F3_1))+td(fv(s.F4_1));
            }
            if (showPartII) {
                r+=td(fv(s.Q1_2))+td(fv(s.Q2_2))+td(fv(s.Q3_2))+td(fv(s.Q4_2));
                r+=td(fv(s.A1_2))+td(fv(s.A2_2))+td(fv(s.A3_2))+td(fv(s.A4_2));
                r+=td(fv(s.M1_2))+td(fv(s.M2_2));
                r+=td(fv(s.F1_2))+td(fv(s.F2_2))+td(fv(s.F3_2))+td(fv(s.F4_2));
            }
            return `<tr>${r}</tr>`;
        }).join('');
        const lbl = partStatusFilter==='combined'?'Combined':partStatusFilter==='part-I'?'Part I':'Part II';
        const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1" cellspacing="0" cellpadding="4" style="font-family:Arial;font-size:11px;border-collapse:collapse;"><thead><tr>${hdr1}</tr><tr>${hdr2}</tr></thead><tbody>${dataRows}</tbody></table></body></html>`;
        const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8;'});
        const link=document.createElement('a');
        link.href=URL.createObjectURL(blob);
        link.download=`Portal_Result_${lbl}_${new Date().toISOString().slice(0,10)}.xls`;
        link.style.display='none';
        document.body.appendChild(link);link.click();document.body.removeChild(link);
    };

    // ─── Excel Export: Overall Result (plain, no colours, no Total/Status) ───
    const exportOverallResultToExcel = () => {
        if (!overAllResult || overAllResult.length === 0) {
            alert('No overall result data to export.'); return;
        }
        const th = (text) =>
            `<th style="font-weight:bold;border:1px solid #888;padding:4px 6px;text-align:center;">${text}</th>`;
        const td = (val) =>
            `<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;">${val ?? ''}</td>`;
        const examNames = overAllResult.length > 0 ? Object.keys(overAllResult[0].exams) : [];
        const hdrRow = [
            th('Reg No'),th('Name'),
            ...examNames.map(e=>th(e)),
        ].join('');
        const dataRows = overAllResult.map((s) => {
            let r=td(s.registrationNumber)+td(s.name);
            examNames.forEach(e=>{r+=td(s.exams[e]??'-');});
            return `<tr>${r}</tr>`;
        }).join('');
        const lbl=partStatusFilter==='combined'?'Combined':partStatusFilter==='part-I'?'Part I':'Part II';
        const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1" cellspacing="0" cellpadding="4" style="font-family:Arial;font-size:11px;border-collapse:collapse;"><thead><tr>${hdrRow}</tr></thead><tbody>${dataRows}</tbody></table></body></html>`;
        const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8;'});
        const link=document.createElement('a');
        link.href=URL.createObjectURL(blob);
        link.download=`Overall_Result_${lbl}_${new Date().toISOString().slice(0,10)}.xls`;
        link.style.display='none';
        document.body.appendChild(link);link.click();document.body.removeChild(link);
    };


    useEffect(() => {
        fetchTermData();
    }, [])
    useEffect(() => {
        fetchExamTypes();
    }, [])









    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodResults';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);
    return (
        <>
            {loadingSpinner ? ( // Show loading spinner while loading is true
                <LoadingSpinner />
            ) : (
                    <div className="mx-10 pt-12 flex flex-col gap-3">
                        {/* Notification Banner for Gaps in Assessment */}
                        {notifications.length > 0 && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md shadow-sm">
                                <div className="flex items-center mb-2">
                                    <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide">Incomplete Assessment Slots Detected</h3>
                                </div>
                                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                    {notifications.map((n, i) => (
                                        <li key={i}>{n.message}</li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-xs text-yellow-600 italic font-medium">Please add missing exams or marks before the term expires to ensure accurate portal uploads.</p>
                            </div>
                        )}

                        <div className={`grid grid-cols-2 w-[42%] gap-4`}>
                            <div id="cardOneButton">
                                <CardOneButton title={"Results"} butText={"View"} onClick={handleViewResults} />
                            </div>

                            <div id="cardPromoteButton" className={`bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center gap-2 h-[100%] min-h-[160px] border border-gray-200`}>
                                <h3 className="text-xl text-center font-medium text-indigo-900">Promote to Part II</h3>
                                <button
                                    onClick={handlePromoteToPartII}
                                    disabled={!isPromoteEnabled || loadingPromote || !(term && term.value)}
                                    className={`mt-auto px-6 py-2 rounded-md font-medium text-white transition-colors duration-200 ${!isPromoteEnabled || loadingPromote || !(term && term.value) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {loadingPromote ? '...' : 'Promote'}
                                </button>
                                {!(term && term.value) ? (
                                    <p className="text-xs text-gray-500 text-center font-medium mt-1 leading-tight">Select a term first to promote</p>
                                ) : !isPromoteEnabled && promoteMessage && (
                                    <p className="text-xs text-red-500 text-center font-medium mt-1 leading-tight">{promoteMessage}</p>
                                )}
                            </div>
                        </div>

                        {showResultsSelectCard && (
                            <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative" /*ref={cardRef}*/>
                                    <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowResultsSelectCard(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {/* <RxCross2 /> */}
                                    </button>
                                    <div>
                                        <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Results</h4>
                                        <form>
                                            <div className="my-4">
                                                <label htmlFor='term' className="block text-md font-semibold text-gray-700">Exam Term
                                                    <Select
                                                        id='term'
                                                        name='term'
                                                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                        options={termData}
                                                        isSearchable
                                                        onChange={handletermChange}
                                                        value={term}
                                                        placeholder='Select or type'
                                                    />
                                                </label>
                                            </div>
                                            <div className="my-4">
                                                <label htmlFor='exam' className="block text-md font-semibold text-gray-700">Exam Name
                                                    <Select
                                                        id='exam'
                                                        name='exam'
                                                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                        //className="border p-4 h-14 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"

                                                        options={AllExamTypes}
                                                        isSearchable
                                                        onChange={handleExamChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
                                                        value={exam}
                                                        placeholder='Select or type'
                                                    //isDisabled={modalMode === 'view'}
                                                    />
                                                </label>
                                            </div>

                                            {term && term.value && (
                                                <div className="my-4">
                                                    <label className="block text-md font-semibold text-gray-700 mb-2">Filter by Part Status</label>
                                                    <div className="flex gap-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                                        <label className="inline-flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded">
                                                            <input
                                                                type="radio"
                                                                className="form-radio text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                                name="partStatus"
                                                                value="combined"
                                                                checked={partStatusFilter === 'combined'}
                                                                onChange={handlePartStatusChange}
                                                            />
                                                            <span className="ml-2 text-gray-700 font-medium">Combined</span>
                                                        </label>
                                                        <label className="inline-flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded">
                                                            <input
                                                                type="radio"
                                                                className="form-radio text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                                name="partStatus"
                                                                value="part-I"
                                                                checked={partStatusFilter === 'part-I'}
                                                                onChange={handlePartStatusChange}
                                                            />
                                                            <span className="ml-2 text-gray-700 font-medium">Part I</span>
                                                        </label>
                                                        <label className="inline-flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded">
                                                            <input
                                                                type="radio"
                                                                className="form-radio text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                                name="partStatus"
                                                                value="part-II"
                                                                checked={partStatusFilter === 'part-II'}
                                                                onChange={handlePartStatusChange}
                                                            />
                                                            <span className="ml-2 text-gray-700 font-medium">Part II</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-span-1 flex justify-center my-2">
                                                <Simple text="Done" type="Submit" onClick={handleViewResult} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}


                        {showResult && (
                            <div>
                                <div id={`accordion-collapse-${1}`} data-accordion="collapse">
                                    <h2 id={`accordion-collapse-heading-timetable-${1}`}>
                                        <GenAccor text={tabheading} accordionId={1} />
                                    </h2>
                                    <div id={`accordion-collapse-body-timetable-${1}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${1}`}>
                                        {(resultsdata && resultsdata.length > 0) ? (
                                            <div className="overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                                                <div className="flex justify-end p-2 bg-white">
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); exportTableToCSV(`individual-exam-table-${1}`, `${tabheading}_Report`); }}
                                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        Export to Excel
                                                    </button>
                                                </div>
                                                <table id={`individual-exam-table-${1}`} className="w-full text-sm rtl:text-right text-center bg-white">
                                                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                                        <tr>
                                                            <th>Reg no</th>
                                                            <th>Name</th>
                                                            {tabheading === "Attendance-I" || tabheading === "Attendance-II" || tabheading === "Orientation" ? (
                                                                <th>Obtained Marks</th>
                                                            ) : (
                                                                <>
                                                                    {students[0]?.obtainedAverageofCLO.map((clo, cloIdx) => (
                                                                        <th key={cloIdx}>{`CLO ${cloIdx + 1} (${clo.totalCLOPercentage.toFixed(2)})`}</th>
                                                                    ))}
                                                                    <th>{`Total (${students[0]?.obtainedAverageofCLO.reduce((tot, clo) => tot + clo.totalCLOPercentage, 0).toFixed(2)})`}</th>
                                                                </>
                                                            )}
                                                            {(tabheading === "Attendance-I" || tabheading === "Attendance-II") && (<th>Details</th>)}
                                                        </tr>
                                                    </thead>
                                                    <tbody className='text-indigo-950'>
                                                        {students.length > 0 ? (
                                                            students.map((student, studentIdx) => (
                                                                <tr key={studentIdx}>
                                                                    <td>{student.registrationNumber}</td>
                                                                    <td>{student.name}</td>
                                                                    {tabheading === "Attendance-I" || tabheading === "Attendance-II" || tabheading === "Orientation" ? (
                                                                        <td>{student.obtainedAverage?.toFixed(2)}</td>
                                                                    ) : (
                                                                        <>
                                                                            {student.obtainedAverageofCLO.map((clo, cloIdx) => (
                                                                                <td key={cloIdx}>{clo.averageCLOPercentage.toFixed(2)}</td>
                                                                            ))}
                                                                            <td>{student.obtainedAverageofCLO.reduce((total, clo) => total + clo.averageCLOPercentage, 0).toFixed(2)}</td>
                                                                        </>
                                                                    )}
                                                                    {(tabheading === "Attendance-I" || tabheading === "Attendance-II") && (
                                                                        <td>
                                                                            <button className='underlined' onClick={handleViewAttendanceClick}>view</button>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={questions.length + 2}>No students found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className='overflow-x-auto max-h-96 shadow-md sm:rounded-lg rtl:text-right text-center text-xs text-indigo-900 uppercase bg-gray-50 py-10'>
                                                No Data Found
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}




                        {showOverallResult && (


                            <div>

                                <div id={`accordion-collapse-${2}`} data-accordion="collapse">
                                    <h2 id={`accordion-collapse-heading-timetable-${2}`}>
                                        <GenAccor text={isCombinedView ? "Overall Result (Part I + Part II)" : "Overall Result"} accordionId={2} />
                                    </h2>

                                    {/* Combined Report Button Removed - Replaced by Part Status Filter in Modal */}

                                    {/* Combined Info Banner Removed - Replaced by Part Status Filter in Modal */}

                                    <div id={`accordion-collapse-body-timetable-${2}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${2}`}>
                                        <div className="flex justify-end p-2 bg-white border-b border-gray-200">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); exportOverallResultToExcel(); }}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Export to Excel
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                            <table id={`overall-result-table-${2}`} className="w-full text-sm rtl:text-right text-center bg-white">
                                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                                <tr>
                                                    <th>Sr no.</th>
                                                    <th>Reg no</th>
                                                    <th>Name</th>
                                                    {/* Dynamic Header Rendering */}
                                                    {overAllResult && overAllResult.length > 0 && Object.keys(overAllResult[0].exams).map((examName, idx) => (
                                                        <th key={idx}>{examName}</th>
                                                    ))}
                                                    {(partStatusFilter === 'combined' || partStatusFilter === 'part-I') && (
                                                        <>
                                                            <th className="bg-indigo-50 font-bold border-l border-gray-300">Total I</th>
                                                            <th className="bg-green-50">Status I</th>
                                                        </>
                                                    )}
                                                    {(partStatusFilter === 'combined' || partStatusFilter === 'part-II') && (
                                                        <>
                                                            <th className="bg-indigo-50 font-bold border-l border-gray-300">Total II</th>
                                                            <th className="bg-green-50">Status II</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className='text-indigo-950'>
                                                {console.log(overAllResult, "Overall data consoled")}
                                                {overAllResult && Object.values(overAllResult).length > 0 ? (
                                                    Object.values(overAllResult).map((student, studentIdx) => (
                                                        <tr key={studentIdx}>
                                                            <td>{studentIdx + 1}</td>
                                                            <td>{student.registrationNumber}</td>
                                                            <td>{student.name}</td>
                                                            {/* Dynamic Marks Rendering */}
                                                            {Object.keys(student.exams).map((examName, idx) => (
                                                                <td key={idx}>{student.exams[examName] || '-'}</td>
                                                            ))}
                                                            
                                                            {(partStatusFilter === 'combined' || partStatusFilter === 'part-I') && (
                                                                <>
                                                                    <td className="font-bold bg-indigo-50 border-l border-gray-300">{student.TotalPartI?.toFixed(2) || '0.00'}</td>
                                                                    <td className="font-semibold">
                                                                        {student.passFailPartI === 'PASS' ? (
                                                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700">PASS</span>
                                                                        ) : student.passFailPartI === 'FAIL' ? (
                                                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700">FAIL</span>
                                                                        ) : (
                                                                            <span>-</span>
                                                                        )}
                                                                    </td>
                                                                </>
                                                            )}
                                                            
                                                            {(partStatusFilter === 'combined' || partStatusFilter === 'part-II') && (
                                                                <>
                                                                    <td className="font-bold bg-indigo-50 border-l border-gray-300">{student.TotalPartII?.toFixed(2) || '0.00'}</td>
                                                                    <td className="font-semibold">
                                                                        {student.passFailPartII === 'PASS' ? (
                                                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700">PASS</span>
                                                                        ) : student.passFailPartII === 'FAIL' ? (
                                                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700">FAIL</span>
                                                                        ) : (
                                                                            <span>-</span>
                                                                        )}
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={14}>No students found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        )}


                        {showPortalResult && (


                            <div>

                                <div id={`accordion-collapse-${3}`} data-accordion="collapse">
                                    <h2 id={`accordion-collapse-heading-timetable-${3}`}>
                                        <GenAccor text={isCombinedView ? "Portal Result (Part I + Part II)" : "Portal Result"} accordionId={3} />
                                    </h2>

                                    {/* Combined Report Button - Only show for Part I when Part II exists */}
                                    {/* Combined Report Button Removed - Replaced by Part Status Filter in Modal */}

                                    {/* Combined Info Banner Removed - Replaced by Part Status Filter in Modal */}

                                    <div id={`accordion-collapse-body-timetable-${3}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${3}`}>
                                        <div className="flex justify-end p-2 bg-white border-b border-gray-200">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); exportPortalResultToExcel(); }}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Export to Excel
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                                            <table id={`portal-result-table-${3}`} className="w-full text-sm rtl:text-right text-center bg-white whitespace-nowrap">
                                                <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                                    <tr>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Sr no.</th>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Reg no</th>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Name</th>

                                                        {(partStatusFilter === 'combined' || partStatusFilter === 'part-I') && (
                                                            <th colSpan="16" className="border-b bg-indigo-50 text-indigo-800 text-center py-2">Part I</th>
                                                        )}
                                                        {(partStatusFilter === 'combined' || partStatusFilter === 'part-II') && (
                                                            <th colSpan="16" className="border-b bg-purple-50 text-purple-800 text-center py-2">Part II</th>
                                                        )}
                                                    </tr>
                                                    <tr>
                                                        {/* Part I Headers */}
                                                        {(partStatusFilter === 'combined' || partStatusFilter === 'part-I') && (
                                                            <>
                                                                <th className="px-1">A1</th><th className="px-1">A2</th><th className="px-1">A3</th><th className="px-1">A4</th>
                                                                <th className="px-1">Q1</th><th className="px-1">Q2</th><th className="px-1">Q3</th><th className="px-1">Q4</th>
                                                                <th className="px-1">M1</th><th className="px-1">M2</th>
                                                                <th className="px-1">F1</th><th className="px-1">F2</th><th className="px-1">F3</th><th className="px-1">F4</th>
                                                                <th className="bg-indigo-100 px-2 font-bold">Total I</th>
                                                                <th className="bg-green-50 px-2 font-bold">Status I</th>
                                                            </>
                                                        )}

                                                        {/* Part II Headers */}
                                                        {(partStatusFilter === 'combined' || partStatusFilter === 'part-II') && (
                                                            <>
                                                                <th className="px-1">A1</th><th className="px-1">A2</th><th className="px-1">A3</th><th className="px-1">A4</th>
                                                                <th className="px-1">Q1</th><th className="px-1">Q2</th><th className="px-1">Q3</th><th className="px-1">Q4</th>
                                                                <th className="px-1">M1</th><th className="px-1">M2</th>
                                                                <th className="px-1">F1</th><th className="px-1">F2</th><th className="px-1">F3</th><th className="px-1">F4</th>
                                                                <th className="bg-purple-100 px-2 font-bold">Total II</th>
                                                                <th className="bg-green-50 px-2 font-bold">Status II</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-indigo-950">
                                                    {portalResult && Object.values(portalResult).length > 0 ? (
                                                        Object.values(portalResult).map((student, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 border-b">
                                                                <td className="px-2 py-2">{index + 1}</td>
                                                                <td className="px-2 py-2">{student.registrationNumber}</td>
                                                                <td className="px-2 py-2">{student.name}</td>

                                                                {/* Part I Columns (Suffix _1) */}
                                                                {(partStatusFilter === 'combined' || partStatusFilter === 'part-I') && (
                                                                    <>
                                                                        <td>{student.A1_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A2_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A3_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A4_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q1_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q2_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q3_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q4_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.M1_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.M2_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F1_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F2_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F3_1?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F4_1?.toFixed(2) || '0.00'}</td>
                                                                        <td className="font-bold bg-indigo-50">{student.Total_1?.toFixed(2) || '0.00'}</td>
                                                                        <td className="font-semibold bg-green-50">
                                                                            {student.passFailPartI === 'PASS' ? (
                                                                                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">PASS</span>
                                                                            ) : student.passFailPartI === 'FAIL' ? (
                                                                                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">FAIL</span>
                                                                            ) : (
                                                                                <span>-</span>
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )}

                                                                {/* Part II Columns (Suffix _2) */}
                                                                {(partStatusFilter === 'combined' || partStatusFilter === 'part-II') && (
                                                                    <>
                                                                        <td>{student.A1_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A2_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A3_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.A4_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q1_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q2_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q3_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.Q4_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.M1_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.M2_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F1_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F2_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F3_2?.toFixed(2) || '0.00'}</td>
                                                                        <td>{student.F4_2?.toFixed(2) || '0.00'}</td>
                                                                        <td className="font-bold bg-purple-50">{student.Total_2?.toFixed(2) || '0.00'}</td>
                                                                        <td className="font-semibold bg-green-50">
                                                                            {student.passFailPartII === 'PASS' ? (
                                                                                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">PASS</span>
                                                                            ) : student.passFailPartII === 'FAIL' ? (
                                                                                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">FAIL</span>
                                                                            ) : (
                                                                                <span>-</span>
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={38} className="py-4 text-center">No students found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        )}

                        {/* Project-Wise Report */}
                        {showProjectWiseReport && (
                            <div>
                                <div id={`accordion-collapse-${4}`} data-accordion="collapse">
                                    <h2 id={`accordion-collapse-heading-timetable-${4}`}>
                                        <GenAccor text="Project-Wise Report" accordionId={4} />
                                    </h2>
                                    <div id={`accordion-collapse-body-timetable-${4}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${4}`}>
                                        <ProjectWiseReportTable
                                            data={projectWiseData}
                                            onViewDetails={handleViewProjectDetails}
                                            onViewResults={handleViewProjectExamResults}
                                            onExport={(e) => { e.preventDefault(); exportTableToCSV('project-wise-table', 'Project_Wise_Report'); }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
            )}

            {/* Project Details Modal */}
            {showProjectDetails && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => setShowProjectDetails(false)}
                />
            )}

            {/* Project Exam Results Modal */}
            {showProjectExamResults && (
                <ProjectExamResultsModal
                    project={selectedProject}
                    onClose={() => setShowProjectExamResults(false)}
                />
            )}
        </>
    );
}

export default CoodResults


