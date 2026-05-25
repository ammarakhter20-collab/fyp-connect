import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExamAssignmentAsSupervisor from './SupExamAssignmentAsSupervisor';
import ExamAssignmentAsExaminer from './SupExamAssignmentAsExaminer';
import SupReportInformation from './SupReportInformation';
import { initFlowbite } from 'flowbite';
import AddMarks from './SupAddMarks';
import SupDenialFeedBack from '../SupRequest/SupDenialFeedBack';
import SupFYPReports from './SupFYPReports';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

import { baseUrl } from '../../../Components/config/config';

const AssignedExam = () => {
  const [showSupervisor, setShowSupervisor] = useState(true);
  const [showExaminer, setShowExaminer] = useState(true);
  const [showApproveReport, setShowApproveReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showAddMarks, setShowAddMarks] = useState(false);
  const [isSelectedGroup, setIsSelectedGroup] = useState(null);
  const [approvedExamReports, setApprovedReports] = useState(null);
  const [examDataAsSup, setExamDataAsSup] = useState(null);
  const [showDenialFeedback, setShowDenialFeedback] = useState(false);
  const [showFYPReports, setShowFYPReports] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [studentSubmittedReports, setStudentSubmittedReports] = useState([]);
  const [noReportMessage, setNoReportMessage] = useState('');

  const [taskId, setTaskId] = useState(null);
  const [selectedGrpId, setSelectedGrpId] = useState(null);
  const [approvedReportsforExaminer, setApprovedReportsforExaminer] = useState(null);
  const [newExamReports, setNewExamReports] = useState(null);
  const [examDetailsAsSupervisor, setExamDetailsAsSupervisor] = useState(null);
  const [examDetailsAsExaminer, setExamDetailsAsExaminer] = useState(null);
  const [examWeightage, setExamWeightage] = useState(null);
  const [examData, setExamData] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [existingMarksData, setExistingMarksData] = useState(null);
  const [isMarksEditable, setIsMarksEditable] = useState(true);
  const examDataRef = useRef(null);




  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const groupIdToView = queryParams.get('viewReportForGroup');

    if (groupIdToView) {
      const fetchDirectReports = async () => {
        try {
          const nkey = localStorage.getItem('key');
          const token = JSON.parse(nkey);
          const response = await fetch(`/api/StudentReport/gettingGroupReports/${groupIdToView}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            alert("No report has been submitted by this group yet.");
            // Optionally redirect back or clear query params
            return;
          }

          const data = await response.json();
          const reports = data.reports || [];

          if (!reports.length) {
            alert("No report has been submitted by this group yet.");
            return;
          }

          const formattedReports = reports.map((report, index) => ({
            serial: index + 1,
            mainhead: report.FYPGroup?.topicData?.topic || "N/A",
            examtype: report.Exam?.examName || "N/A",
            fileupload: report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A",
            file: report.submitReportPdf,
            status: report.status || "pending",
            uploadedby: report.uploadedBy?.name || "N/A",
            _id: report._id,
            groupId: { topicData: { topic: report.FYPGroup?.topicData?.topic || "N/A" } },
            dueDate: "N/A",
            examTitle: report.Exam?.examName || "N/A",
            submitDate: report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A",
            submitPdf: report.submitReportPdf,
            reportStatus: report.status || "pending",
            submitBy: { name: report.uploadedBy?.name || "N/A" },
          }));

          setReportData(formattedReports);
          setStudentSubmittedReports(formattedReports);
          setNewExamReports(formattedReports);
          setShowSupervisor(false);
          setShowExaminer(false);
          setShowApproveReport(true);
        } catch (error) {
          console.error("Error fetching direct group reports:", error);
        }
      };

      fetchDirectReports();
    }
  }, [location.search]);


  const handleReportClickasSup = async (id) => {
    // id = group._id (from examDataAsSup which holds newExamDetailsAsSupervisor)
    const selectedGroup = examDataAsSup.find(group => group._id === id);
    console.log("Report click - Selected Group:", selectedGroup);

    if (!selectedGroup) {
      alert("Group not found.");
      return;
    }

    // Fetch the actual student-submitted report for this group from the StudentReport collection
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/StudentReport/gettingGroupReports/${selectedGroup._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // 404 = no report submitted yet
        console.warn("No student report found for group", selectedGroup._id);
        alert("No report has been submitted by this group yet.");
        return;
      }

      const data = await response.json();
      console.log("Fetched student submitted reports:", data);
      const reports = data.reports || [];

      if (!reports.length) {
        alert("No report has been submitted by this group yet.");
        return;
      }

      // Map reports to display format
      const formattedReports = reports.map((report, index) => ({
        serial: index + 1,
        mainhead: report.FYPGroup?.topicData?.topic || selectedGroup.fypTitle || "N/A",
        examtype: report.Exam?.examName || "N/A",
        fileupload: report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A",
        file: report.submitReportPdf,
        status: report.status || "pending",
        uploadedby: report.uploadedBy?.name || "N/A",
        _id: report._id,
        groupId: { topicData: { topic: report.FYPGroup?.topicData?.topic || selectedGroup.fypTitle || "N/A" } },
        dueDate: "N/A",
        examTitle: report.Exam?.examName || "N/A",
        submitDate: report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A",
        submitPdf: report.submitReportPdf,
        reportStatus: report.status || "pending",
        submitBy: { name: report.uploadedBy?.name || "N/A" },
      }));

      setReportData(formattedReports);
      setStudentSubmittedReports(formattedReports);
      setNewExamReports(formattedReports);
      setShowSupervisor(false);
      setShowExaminer(false);
      setShowApproveReport(true);

    } catch (error) {
      console.error("Error fetching student reports:", error);
      alert("Error fetching student reports. Please try again.");
    }
  }

  const handleReportClickasExm = async (id) => {
    // id = group._id from examDetailsAsExaminer/approvedReportsforExaminer
    const selectedGroup = approvedReportsforExaminer.find(report => report._id === id);
    console.log("Examiner report click - Selected Group:", selectedGroup);

    if (!selectedGroup) {
      alert("Group not found.");
      return;
    }

    // Fetch actual student-submitted reports for this group
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/StudentReport/gettingGroupReports/${selectedGroup._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn("No student report found for group", selectedGroup._id);
        alert("No report has been submitted by this group yet.");
        return;
      }

      const data = await response.json();
      const reports = data.reports || [];

      if (!reports.length) {
        alert("No report has been submitted by this group yet.");
        return;
      }

      // Filter reports so examiners only see APPROVED ones
      const approvedReports = reports.filter(r => r.status && r.status.toUpperCase() === "APPROVED");

      if (!approvedReports.length) {
        alert("The supervisor has not approved any report for this group yet.");
        return;
      }

      const formattedReports = approvedReports.map((report, index) => ({
        serial: index + 1,
        fyp: report.FYPGroup?.topicData?.topic || selectedGroup.fypTitle || "N/A",
        examtype: report.Exam?.examName || "N/A",
        fileupload: report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A",
        file: report.submitReportPdf,
        status: report.status || "pending",
        uploadedby: report.uploadedBy?.name || "N/A",
      }));

      setReportData(formattedReports);
      setShowSupervisor(false);
      setShowExaminer(false);
      setShowFYPReports(true);

    } catch (error) {
      console.error("Error fetching student reports for examiner:", error);
      alert("Error fetching student reports. Please try again.");
    }
  }

  const fetchExistingMarks = async (termId, examId, groupId) => {
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const examinerId = parsedUserData._id;

      const response = await fetch(`${baseUrl}/api/EvaluateExamRoutes/examiner-marks?termId=${termId}&examId=${examId}&groupId=${groupId}&examinerId=${examinerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch existing marks, proceeding with blank form');
        return { found: false, examStatus: 'Active', termExpired: false };
      }

      const data = await response.json();
      console.log('Existing marks data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching existing marks:', error);
      return { found: false, examStatus: 'Active', termExpired: false };
    }
  };

  const handleMarksClick = async (id) => {
    const selectedGroup = examDetailsAsSupervisor.find(group => group._id === id);
    if (!selectedGroup) return;

    const selectedPanel = selectedGroup.assignedPanel._id;
    setSelectedPanelId(selectedPanel);
    const grpId = selectedGroup._id;
    setSelectedGrpId(grpId);

    const selectedMembers = selectedGroup.groupMembers.map(member => ({
      Name: member.name,
      RegistrationNo: member.registrationNumber,
      _id: member._id
    }));
    setIsSelectedGroup(selectedMembers);
    console.log('Selected Group Members:', selectedMembers);
    setTaskId(id);

    // Fetch existing marks for this examiner+group
    // Use ref (synchronous) instead of state (async) to avoid stale data race
    const currentExamData = examDataRef.current || examData;
    let termId, examIdVal;
    if (currentExamData && currentExamData.schedule && currentExamData.schedule.length > 0) {
      termId = currentExamData.schedule[0].CreatedExam.Term._id;
      examIdVal = currentExamData.schedule[0].CreatedExam._id;
    } else if (currentExamData && currentExamData.exams && currentExamData.exams.length > 0) {
      termId = currentExamData.exams[0].Term._id;
      examIdVal = currentExamData.exams[0]._id;
    }
    // Fallback: use termId from the group object itself
    if (!termId && selectedGroup.term && selectedGroup.term._id) {
      termId = selectedGroup.term._id;
    }

    if (termId && examIdVal) {
      setLoadingSpinner(true);
      const marksInfo = await fetchExistingMarks(termId, examIdVal, grpId);
      setExistingMarksData(marksInfo.found ? marksInfo : null);
      const editable = (marksInfo.examStatus === 'Active') && (!marksInfo.termExpired);
      setIsMarksEditable(editable);
      setLoadingSpinner(false);
    } else {
      setExistingMarksData(null);
      setIsMarksEditable(true);
    }

    setShowAddMarks(true);
  }

  const handleExamMarksClick = async (id) => {
    const selectedGroup = examDetailsAsExaminer.find(group => group._id === id);
    if (!selectedGroup) return;

    const selectedPanel = selectedGroup.assignedPanel._id;
    setSelectedPanelId(selectedPanel);
    const grpId = selectedGroup._id;
    setSelectedGrpId(grpId);

    const selectedMembers = selectedGroup.groupMembers.map(member => ({
      Name: member.name,
      RegistrationNo: member.registrationNumber,
      _id: member._id
    }));
    setIsSelectedGroup(selectedMembers);
    console.log('Selected Group Members:', selectedMembers);
    setTaskId(id);

    // Fetch existing marks for this examiner+group
    // Use ref (synchronous) instead of state (async) to avoid stale data race
    const currentExamData = examDataRef.current || examData;
    let termId, examIdVal;
    if (currentExamData && currentExamData.schedule && currentExamData.schedule.length > 0) {
      termId = currentExamData.schedule[0].CreatedExam.Term._id;
      examIdVal = currentExamData.schedule[0].CreatedExam._id;
    } else if (currentExamData && currentExamData.exams && currentExamData.exams.length > 0) {
      termId = currentExamData.exams[0].Term._id;
      examIdVal = currentExamData.exams[0]._id;
    }
    // Fallback: use termId from the group object itself
    if (!termId && selectedGroup.term && selectedGroup.term._id) {
      termId = selectedGroup.term._id;
    }

    if (termId && examIdVal) {
      setLoadingSpinner(true);
      const marksInfo = await fetchExistingMarks(termId, examIdVal, grpId);
      setExistingMarksData(marksInfo.found ? marksInfo : null);
      const editable = (marksInfo.examStatus === 'Active') && (!marksInfo.termExpired);
      setIsMarksEditable(editable);
      setLoadingSpinner(false);
    } else {
      setExistingMarksData(null);
      setIsMarksEditable(true);
    }

    setShowAddMarks(true);
  }




  const handleAddMarks = async (termId, examId, evaluations, groupId, feedback, panelId) => {

    try {
      setLoadingSpinner(true); // Show loading spinner while processing
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const examinerId = parsedUserData._id;

      const apiUrl = `${baseUrl}/api/EvaluateExamRoutes/evaluations/${groupId}`;
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          termId, examId, examinerId, evaluations, groupId, feedback, panelId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful response
        console.log(' Marks Added successfully');
        alert("Marks added successfully!");
        setShowAddMarks(false); // Close the modal on success
      } else {
        console.log('Failed to Add Marks ', data);
        alert(`Failed to add marks: ${data.error || "Unknown error"}`);
      }
    }
    catch (error) {
      console.error('Error Marking :', error);
      alert("Error uploading marks. Please check console.");
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }











  const handleDetailsClickAsSup = (id) => {
    console.log(id, "consoled");
    const selectedAssignment = examDetailsAsSupervisor.find(item => item._id === id);
    if (selectedAssignment) {
      // selectedAssignment IS the group object in this context
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.role === 'hod' ? '/HoDMyProjects'
                     : user?.role === 'coordinator' ? '/CoodMyProjects'
                     : '/SupPrevSupProj';
      navigate(`${basePath}?id=${selectedAssignment._id}`);
    } else {
      console.error("Group ID not found for assignment", id);
      alert("Error: Could not find group details.");
    }
  }

  const handleDetailsClickAsExm = (id) => {
    console.log(id, "consoled");
    const selectedAssignment = examDetailsAsExaminer.find(item => item._id === id);
    if (selectedAssignment) {
      const user = JSON.parse(localStorage.getItem('user'));
      const basePath = user?.role === 'hod' ? '/HoDMyProjects'
                     : user?.role === 'coordinator' ? '/CoodMyProjects'
                     : '/SupPrevSupProj';
      navigate(`${basePath}?id=${selectedAssignment._id}`);
    } else {
      console.error("Group ID not found for assignment", id);
      alert("Error: Could not find group details.");
    }
  }




  const handleApprovalClick = (id) => {
    // id here is the reportId
    const status = "approved";
    updateReportStatus(status, id);
  }

  const handleDenialClick = (id) => {
    // Open the feedback modal with the reportId saved
    setShowDenialFeedback(true);
    setTaskId(id);
  }

  const handleAddMarksClose = () => {
    setShowAddMarks(false);
    setExistingMarksData(null);
    setIsMarksEditable(true);
  }

  const AddMarksAsSup = (evaluations, feedback) => {
    console.log("Check Add Marks", examData)
    let termId
    let examId
    if (examData.schedule && examData.schedule.length > 0) {

      termId = examData.schedule[0].CreatedExam.Term._id
      examId = examData.schedule[0].CreatedExam._id
    }
    else {
      termId = examData.exams[0].Term._id
      examId = examData.exams[0]._id
    }
    handleAddMarks(termId, examId, evaluations, selectedGrpId, feedback, selectedPanelId);
    console.log(evaluations, "feed added", feedback)

  }


  const handleFeedbackClick = (feedback) => {
    // Feedback is given, status becomes rejected
    const status = "rejected";
    console.log(feedback);
    updateReportStatus(status, taskId, feedback);
  }



















  const handleFeedbackClose = () => {
    setShowDenialFeedback(false);
  }
  const handleViewClickinExm = () => {

  }


  const handleDownloadClickinExm = (id) => {
    console.log(id, "returned")

  }
  const handleViewClickinSup = (id) => {

    console.log(id, "returned")

  }


  const handleDownloadClickinSup = (id) => {
    console.log(id, "returned")
  }

  const handleGoBack = () => {
    setShowSupervisor(true)
    setShowExaminer(true)
    setShowApproveReport(false)
    setShowAddMarks(false)
    setShowDenialFeedback(false)
    setShowFYPReports(false)
  }



  const updateReportStatus = async (status, reportId, feedback) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      console.log("Updating report status", status, reportId);
      const response = await fetch(`${baseUrl}/api/StudentReport/update-status/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log('Updated request:', data);
      alert(`Report marked as ${status} successfully.`);
      
      // Update UI state locally instead of closing the panel
      if (reportData) {
        setReportData(prevData => prevData.map(report => 
          report._id === reportId ? { ...report, status: status } : report
        ));
      }

      if (status === 'rejected') {
         setShowDenialFeedback(false);
      }
    } catch (error) {
      console.error('Error updating report status:', error.message);
      alert('Error updating report status: ' + error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };





  // const fetchAssignedExams = async () => {
  //   try {
  //     setLoadingSpinner(true);
  //     const token = localStorage.getItem('key');
  //     const userData = localStorage.getItem('user');
  //     const parsedUserData = JSON.parse(userData);
  //     const userid = parsedUserData._id;

  //     const response = await fetch(`/api/manageexams/get-exam/${userid}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'

  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch Data');
  //     }
  //     const data = await response.json();
  //     //Fetched  Data
  //     setExamDataAsSup(data);
  //     console.log(data, 'fetched tasks');

  //   } catch (error) {
  //     console.error('Error fetching Data:', error.message);
  //   } finally {
  //     setLoadingSpinner(false);
  //   }
  // };

  const fetchApprovedExamReports = async () => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;


      const response = await fetch(`${baseUrl}/api/manageexams/get-approved-exam/${userid}`, {
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
      setApprovedReports(data.examAssignments);
      console.log(data, 'fetched tasks');

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  // const fetchApprovedExamReportsforExaminer = async () => {
  //   try {
  //     setLoadingSpinner(true);
  //     const token = localStorage.getItem('key');
  //     const userData = localStorage.getItem('user');
  //     const parsedUserData = JSON.parse(userData);
  //     const userid = parsedUserData._id;
  //     const filter = "approved";

  //     const response = await fetch(`/api/manageexams/get-exam-reports/${userid}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'

  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch Data');
  //     }
  //     const data = await response.json();
  //     //Fetched  Data
  //     console.log("newdata fetched", data)
  //     const newData = data.examReports.map((reports, index) => ({
  //       _id: reports._id,
  //       groupNo: ++index,
  //       fypTitle: reports.groupId.topicData.topic,
  //       Program: reports.departmentId.departmentName,
  //       supervisor: reports.groupId.selectedOption.name,
  //       examDate: reports.dueDate,
  //       examType: reports.examTitle,
  //       term: reports.termId.sessionTerm,
  //       status: reports.reportStatus,
  //       submitBy: reports.submitBy.name,
  //       submitDate: reports.submitDate,
  //       submitPdf: reports.submitPdf,


  //     }))


  //     setApprovedReportsforExaminer(newData);
  //     console.log(data, 'fetched Reports');

  //   } catch (error) {
  //     console.error('Error fetching Data:', error.message);
  //   } finally {
  //     setLoadingSpinner(false);
  //   }
  // };







  const fetchExamGroupDetails = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userid = parsedUserData._id;

      const response = await fetch(`${baseUrl}/api/Exam-Assignments/fyp-Assigned-Exams/${userid}`, {
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
      console.log("fetchedexamsof", data);

      const SUPExams = data.asSupervisor;
      const ExeExams = data.asExaminer;

      const newExamDetailsAsSupervisor = SUPExams.map((reports, index) => ({
        _id: reports._id,
        groupNo: index + 1,
        fypTitle: reports.topicData?.topic || "N/A",
        members: reports.groupMembers || [],
        supervisor: reports.selectedOption?.name || "N/A",
        Program: reports.groupMembers?.[0]?.program?.programTitle || "N/A",
        programId: reports.groupMembers?.[0]?.program?._id || reports.groupMembers?.[0]?.program || null,
        term: reports.term?.sessionTerm || "N/A",
        termId: reports.term?._id,
        panelId: reports.assignedPanel?._id


      }));

      const newExamDetailsAsExaminer = ExeExams.map((reports, index) => ({
        _id: reports._id,
        groupNo: index + 1,
        fypTitle: reports.topicData?.topic || "N/A",
        members: reports.groupMembers || [],
        supervisor: reports.selectedOption?.name || "N/A",
        Program: reports.groupMembers?.[0]?.program?.programTitle || "N/A",
        programId: reports.groupMembers?.[0]?.program?._id || reports.groupMembers?.[0]?.program || null,
        term: reports.term?.sessionTerm || "N/A",
        termId: reports.term?._id,
        panelId: reports.assignedPanel?._id

      }));

      setExamDetailsAsSupervisor(SUPExams);
      setExamDataAsSup(newExamDetailsAsSupervisor)
      setExamDetailsAsExaminer(ExeExams);
      setApprovedReportsforExaminer(newExamDetailsAsExaminer)

      console.log(data, 'fetched Reports');

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };








  const settingExamWeightage = (weightage, exam) => {
    console.log("Weightage", weightage)
    console.log("EXAM DAAAAAAAAAAAAAAAA", exam)
    setExamData(exam);
    setExamWeightage(weightage)
    // Also update the ref synchronously so click handlers can read it immediately
    examDataRef.current = exam;
  }






  useEffect(() => {
    // fetchAssignedExams();
    fetchApprovedExamReports();
    // fetchApprovedExamReportsforExaminer();
    //fetchExamDetails();
    fetchExamGroupDetails();




    //fetchCreatedExamDetails();
  }, [])


  // useEffect(() => {}, [examWeightage])






  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupAssignedExam';
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
        <LoadingSpinner />) :
        (<div>
          <div className='bg-slate-100 w-full h-full'>
            <div className='mx-10 pt-12 flex flex-col gap-3 bg-' >
              <div>
                {showSupervisor && (
                  <div>
                    <ExamAssignmentAsSupervisor
                      accordionId={1}
                      groupData={examDataAsSup}
                      onReportClick={handleReportClickasSup}
                      onMarksClick={handleMarksClick}
                      onDetailsClick={handleDetailsClickAsSup}
                      settingExamWeightage={settingExamWeightage}
                    />
                  </div>
                )}
              </div>
              <div>
                {showExaminer && (
                  <ExamAssignmentAsExaminer
                    accordionId={2}
                    groupData={approvedReportsforExaminer}
                    onDetailsClick={handleDetailsClickAsExm}
                    onMarksClick={handleExamMarksClick}
                    onReportClick={handleReportClickasExm}
                    settingExamWeightage={settingExamWeightage}

                  />
                )}
              </div>
              <div>
                {showApproveReport && approvedExamReports && reportData && (
                  <div className='relative top-0 left-0 w-full h-full justify-center items-center '>
                    <SupReportInformation reportData={reportData} handleApprovalClick={handleApprovalClick} handleDenialClick={handleDenialClick} handledownloadClick={handleDownloadClickinSup} handleviewClick={handleViewClickinSup} approvedreportData={newExamReports} />
                    <div className='flex flex-row justify-end  mt-5'>
                      <ButbgPrimary text="Back" onClick={handleGoBack} />
                    </div>
                  </div>
                )}
                {showFYPReports && (
                  <div className='relative top-0 left-0 w-full h-full justify-center '>
                    <SupFYPReports reportData={reportData} handleViewClick={handleViewClickinExm} downloadClick={handleDownloadClickinExm} />
                    <div className='flex flex-row justify-end  mt-5'>
                      <ButbgPrimary text="Back" onClick={handleGoBack} />
                    </div>
                  </div>
                )}

                {showAddMarks && (
                  <div className='relative top-0 left-0 w-full h-full justify-center '>
                    <AddMarks selectedGroup={isSelectedGroup} onclose={handleAddMarksClose} onAddClick={AddMarksAsSup} examWeightage={examWeightage} examData={examData} existingMarksData={existingMarksData} isEditable={isMarksEditable} />
                  </div>
                )}
                {showDenialFeedback && (
                  <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                    <SupDenialFeedBack onclose={handleFeedbackClose} addFeedbackClick={handleFeedbackClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>)}
    </>
  );
};

export default AssignedExam;
