import React, { useState, useEffect, useRef } from 'react'
import CardOneButton from '../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
import { initFlowbite, } from 'flowbite';
import axios from 'axios';
import { baseUrl } from '../../../Components/config/config';
import { Navigate } from 'react-router-dom';
import GenAccor from '../../../Components/Accordians/GenAccor';



const CoodResults = () => {

    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [showResultsSelectCard, setShowResultsSelectCard] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showOverallResult, setShowOverAllResult] = useState(false);
    const [showPortalResult, setShowPortalResult] = useState(false);
    const [termData, setTermData] = useState([]);
    const [filteredResults, setFilteredResults] = useState(null);
    const [portalResults, setPortalResults] = useState(null);
    const [term, setTerm] = useState('');
    const [exam, setExam] = useState('');
    const [AllExamTypes, setAllExamTypes] = useState('');
    const [examData, setExamData] = useState([]);
    const [resultsdata, setResultsData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [tabheading, setTabHeading] = useState(null);
    const [overAllResult, setOverAllResult] = useState(null)
    const [portalResult, setPortalResult] = useState(null)




    const handletermChange = (selectedOption) => {
        setTerm(selectedOption);
    };
    const handleExamChange = (selectedOption) => {

        setExam(selectedOption);

    };
    const handleViewResult = () => {
        setResultsData(null)

        console.log("Term ID:", term && term._id);
        console.log("Exam Name:", exam && exam.value);


        if (exam.value === 'portal_result_list') {
            console.log("Portal Result")
            fetchResultsData(term._id, exam.value)
            setShowResultsSelectCard(false);
            setShowResult(false);
            setShowOverAllResult(false)
            setShowPortalResult(true)
        }
        else if (exam.value === 'overall_result_list') {

            console.log("Overall Result")
            fetchResultsData(term._id, exam.value)
            setShowResultsSelectCard(false);
            setShowResult(false);
            setShowPortalResult(false)
            setShowOverAllResult(true)


        } else {
            fetchResultsData(term._id, exam.value)
            setShowResultsSelectCard(false);
            setShowOverAllResult(false)
            setShowPortalResult(false)
            setShowResult(true);

        }
        setTabHeading(exam.value);
        // setExam('')
        // setTerm('')


    };






    const handleViewResults = () => {
        setShowResultsSelectCard(true);


    }

    let totalMarks
















    const fetchResultsData = async (termId, examName) => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            let response = ''
            if (examName === 'portal_result_list') {
                // Use the correct portal-report API (same as Coordinator)
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/portal-report/${termId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Portal Result');
                }

                const portalData = await response.json();
                console.log('Portal Report Data:', portalData);

                if (portalData.success) {
                    const portalMap = {};
                    portalData.data.forEach(student => {
                        portalMap[student.registrationNumber] = student;
                    });
                    setPortalResult(portalMap);
                } else {
                    console.error('Portal Report Error:', portalData.error);
                    alert(`Error: ${portalData.error}`);
                }
                setLoadingSpinner(false);
                return; // Early return — portal result is handled entirely here

            } else if (examName === 'overall_result_list') {
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/getExamEvaluationsbyTerm/${termId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

            } else {
                response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/getExamEvaluations/${termId}/${examName}`, {
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
            console.log(data, 'fetched Results')
            // const dataofterm = data.fypTerms.map((term, index) => ({
            //     ...term,
            //     label: term.sessionTerm,
            //     value: term._id,
            // }))
            let EVAL = data.evaluation.evaluations
            console.log("EVAL (raw)", EVAL)

            // Re-group flat student array into exam-grouped format if needed
            // Backend returns flat: [{ name, registrationNumber, examName, obtainedAverage }]
            // Frontend expects grouped: [{ examName, students: [{ registrationNumber, name, obtainedAverage }] }]
            if (Array.isArray(EVAL) && EVAL.length > 0 && !EVAL[0].students) {
                const examMap = {};
                EVAL.forEach(item => {
                    if (!examMap[item.examName]) {
                        examMap[item.examName] = { examName: item.examName, students: [] };
                    }
                    examMap[item.examName].students.push({
                        registrationNumber: item.registrationNumber,
                        name: item.name,
                        obtainedAverage: item.obtainedAverage
                    });
                });
                EVAL = Object.values(examMap);
                console.log("EVAL (re-grouped)", EVAL);
            }

            setResultsData(EVAL);

            if (EVAL && Array.isArray(EVAL)) {
                let students = [];

                if (exam.value === "overall_result_list") {
                    const studentsMap = {};

                    EVAL.forEach(exam => {
                        // Remove hyphens and other special characters from examName
                        const sanitizedExamName = exam.examName.replace(/[^a-zA-Z0-9]/g, '');

                        exam.students.forEach(student => {
                            const { registrationNumber, name, obtainedAverage } = student;

                            if (!studentsMap[registrationNumber]) {
                                studentsMap[registrationNumber] = {
                                    registrationNumber,
                                    name,
                                    exams: {}
                                };
                            }

                            studentsMap[registrationNumber].exams[sanitizedExamName] = obtainedAverage;
                        });
                    });
                    console.log(studentsMap, "OverAll Results of Students")

                    // const result =  Object.values(studentsMap);
                    setOverAllResult(studentsMap)


                }
                else if (exam.value === "portal_result_list") {
                    // Portal result is now handled by the portal-report API call above
                    // Data is already set via setPortalResult in the fetch block
                }
                else {

                    EVAL.forEach(instance => {

                        examName = instance.examName
                        if (instance.students) {
                            students = students.concat(instance.students);

                        }
                    });
                }
                setStudents(students)

                console.log(students, "all students");

                let ques
                if ((students.length > 0) && (exam.value === "Attendance" || exam.value === "Orientation")) {
                    console.log("ERROR in here")

                    const attendance_percentage = getAttendanceandOrientationMarks(students)
                    console.log(attendance_percentage, "CONSOLED QUES");
                    setQuestions(attendance_percentage)
                }
                else {
                    ques = getQuestions(students);
                    console.log(ques, "Yo Check this")
                    setQuestions(ques);
                    totalMarks = getTotalMarksForQuestions(students);

                }
            }



        } catch (error) {

            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };























    const fetchTermData = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
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
                { label: 'Portal Result List', value: 'portal_result_list' }
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


    const handleExportResultsClick = () => {


    }




    const getQuestions = (students) => {
        const questions = new Map();

        // Temporary storage to calculate averages
        const questionSums = {};
        const questionCounts = {};

        students.forEach(student => {
            student.evaluationsByExaminers.forEach(examiner => {
                examiner.examinations.forEach(examination => {
                    examination.questions.forEach(question => {
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



    const getTotalMarksForQuestions = (students) => {
        const totalMarks = {};
        students.forEach(student => {
            student.evaluationsByExaminers.forEach(examiner => {
                examiner.examinations.forEach(examination => {
                    examination.questions.forEach(question => {
                        totalMarks[question.shortCode] = question.totalMarks;
                    });
                });
            });
        });
        return totalMarks;
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



    useEffect(() => {
        fetchTermData();
    }, [])
    useEffect(() => {
        fetchExamTypes();
    }, [])









    useEffect(() => {
        initFlowbite();
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'HoDResults';
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
                <div className='bg-slate-100 w-full h-full'>
                    <div className="mx-10 pt-12 flex flex-col gap-3">
                        {((
                            <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                                <div id="cardOneButton">
                                    <CardOneButton title={"Results"} butText={"View"} onClick={handleViewResults} />
                                </div>
                            </div>
                        ))}

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
                                                <table className="w-full text-sm rtl:text-right text-center bg-white">
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
                                                                    <th>Total</th>
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
                                        <GenAccor text={"Overall Result"} accordionId={2} />
                                    </h2>
                                    <div id={`accordion-collapse-body-timetable-${2}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${2}`}>
                                        <table className="w-full text-sm rtl:text-right text-center bg-white">
                                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                                <tr>
                                                    <th>Sr no.</th>
                                                    <th>Reg no</th>
                                                    <th>Name</th>
                                                    <th>Proposal</th>
                                                    <th>Orientation</th>
                                                    <th>Mid I</th>
                                                    <th>Attendance</th>
                                                    <th>Final I</th>
                                                    <th>Total</th>
                                                    <th>Mid II</th>
                                                    <th>Attendance</th>
                                                    <th>Final II</th>
                                                    <th>Total</th>
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
                                                            <td>{student.exams.Proposal || '-'}</td>
                                                            <td>{student.exams.Orientation || '-'}</td>
                                                            <td>{student.exams.MidI || '-'}</td>
                                                            <td>{student.exams.AttendanceI || '-'}</td>
                                                            <td>{student.exams.FinalI || '-'}</td>
                                                            <td>{student.exams.TotalI || '-'}</td>
                                                            <td>{student.exams.MidII || '-'}</td>
                                                            <td>{student.exams.AttendanceII || '-'}</td>
                                                            <td>{student.exams.FinalII || '-'}</td>
                                                            <td>{student.exams.TotalII || '-'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={13}>No students found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>

                        )}


                        {showPortalResult && (


                            <div>

                                <div id={`accordion-collapse-${3}`} data-accordion="collapse">
                                    <h2 id={`accordion-collapse-heading-timetable-${3}`}>
                                        <GenAccor text={"Portal Result"} accordionId={3} />
                                    </h2>
                                    <div id={`accordion-collapse-body-timetable-${3}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${3}`}>
                                        <div className="overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                                            <table className="w-full text-sm rtl:text-right text-center bg-white whitespace-nowrap">
                                                <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                                    <tr>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Sr no.</th>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Reg no</th>
                                                        <th rowSpan="2" className="border-b px-2 py-2">Name</th>
                                                        <th colSpan="16" className="border-b bg-indigo-50 text-indigo-800 text-center py-2">Part I</th>
                                                        <th colSpan="16" className="border-b bg-purple-50 text-purple-800 text-center py-2">Part II</th>
                                                    </tr>
                                                    <tr>
                                                        {/* Part I Headers */}
                                                        <th className="px-1">A1</th><th className="px-1">A2</th><th className="px-1">A3</th><th className="px-1">A4</th>
                                                        <th className="px-1">Q1</th><th className="px-1">Q2</th><th className="px-1">Q3</th><th className="px-1">Q4</th>
                                                        <th className="px-1">M1</th><th className="px-1">M2</th>
                                                        <th className="px-1">F1</th><th className="px-1">F2</th><th className="px-1">F3</th><th className="px-1">F4</th>
                                                        <th className="bg-indigo-100 px-2 font-bold">Total I</th>
                                                        <th className="bg-green-50 px-2 font-bold">Status I</th>
                                                        {/* Part II Headers */}
                                                        <th className="px-1">A1</th><th className="px-1">A2</th><th className="px-1">A3</th><th className="px-1">A4</th>
                                                        <th className="px-1">Q1</th><th className="px-1">Q2</th><th className="px-1">Q3</th><th className="px-1">Q4</th>
                                                        <th className="px-1">M1</th><th className="px-1">M2</th>
                                                        <th className="px-1">F1</th><th className="px-1">F2</th><th className="px-1">F3</th><th className="px-1">F4</th>
                                                        <th className="bg-purple-100 px-2 font-bold">Total II</th>
                                                        <th className="bg-green-50 px-2 font-bold">Status II</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-indigo-950">
                                                    {portalResult && Object.values(portalResult).length > 0 ? (
                                                        Object.values(portalResult).map((student, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 border-b">
                                                                <td className="px-2 py-2">{index + 1}</td>
                                                                <td className="px-2 py-2">{student.registrationNumber}</td>
                                                                <td className="px-2 py-2">{student.name}</td>
                                                                {/* Part I Columns */}
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
                                                                {/* Part II Columns */}
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
                    </div>
                </div>)}
        </>
    );
}

export default CoodResults
