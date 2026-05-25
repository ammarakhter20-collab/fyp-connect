import React, { useEffect, useState } from 'react';
import { Tabs } from 'flowbite-react';
import { initFlowbite } from 'flowbite';
import Group_details from "./PartOneDetails/Stdgroup_details";
import Attendence_table from './Stdattendence';
import Panel_details from './PartOneDetails/Stdpanel_details';
import Evaluation from './Stdevaluation';
import * as Data from './StdProjData/Stddata';
import { useNavigate } from 'react-router-dom';
import ProjectInfo from './StdProjectInfo';
import OrientationEvaluation from './PartOneDetails/StdOrientationEvaluation';
import ProposalEvaluation from './PartOneDetails/StdProposalEvaluation';
import TaskIEvaluation from './PartOneDetails/StdTaskIEvaluation';
import MidEvaluation from './StdMidEvaluation';
import FinalEvaluation from './StdFinalEvaluation';
import OverallEvaluationI from './StdOverallEvaluationI';
import OverallEvaluationII from './StdOverallEvaluationII';
import OverAll from './StdOverAll';
import StdOverAllReport from './StdOverAllReport';
import StudentProjectDetails from './StdStudentProjectDetails';
import ButbgPrimary from '../../Components/Buttons/ButbgPrimary';
import ReportSubmissionComponent from './ReportSubmissionComponent'; // Import the new component
import axios from 'axios';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';

const ProjectDetails = ({ data }) => {
  const navigate = useNavigate(); 
  const [ReportClick, setReportClick] = useState(false);
  const [DetailsViewClick, setDetailsViewClick] = useState(false);
  const [UploadReport, setUploadReport] = useState(true);
  const [isPart2Disabled, setIsPart2Disabled] = useState(false);
  const [createdExam, setCreatedExam] = useState('');
  const [showReportInstance, setShowReportInstance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [FetchedGroupReports, setFetchedGroupReports] = useState([]);
  const [ReportDeadline, setReportDeadline] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isReportRejected, setIsReportRejected] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
  }, []);

  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'ProjectDetails';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) { // Ensure selectedTab is not null
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  }, []);

  useEffect(() => {
    const fypData = JSON.parse(localStorage.getItem("FYPData") || localStorage.getItem("FypData"));
    if (fypData && fypData.partStatus === "part-II") {
      setIsPart2Disabled(false); // Do not disable Part-2 if they are in Part-II
    } else {
      setIsPart2Disabled(true);  // Disable Part-2 if they are in Part-I
    }
  }, []);

  useEffect(() => {
    fetchCreatedExamReport();
  }, [])
  useEffect(() => {
    CheckReportExist();
  }, [createdExam])
  useEffect(() => {
    fetchUploadedReports();
  }, [])

  // useEffect(() => {
  //   // Your logic here to compare ReportDeadline with the current date
  //   const currentDate = new Date(); // Current date

  //   if (ReportDeadline) {
  //     const ReportDeadlineDate = new Date(ReportDeadline); // Convert ReportDeadline to Date object
  //     console.log("First Checkign Report Deadline", ReportDeadlineDate);
  //     console.log("First Checking Current Date", currentDate);
  //     if (ReportDeadlineDate < currentDate) {
  //       console.log("Not running Report Deadline if statement");
  //       setShowReportInstance(false);
  //     }
  //   }
  // }, [ReportDeadline]);

  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (createdExam && createdExam.ReportDeadline) {
      const deadlineStr = createdExam.ReportDeadline.split('T')[0];

      if (deadlineStr < todayStr) {
        // Only hide the form if the report is NOT in rejected state
        if (!isReportRejected) {
          console.log("Deadline passed and not rejected — hiding form");
          setShowReportInstance(false);
        } else {
          console.log("Deadline passed but report rejected — keeping form open");
        }
      }
    }
  }, [createdExam, isReportRejected]);


  console.log("Checking is Part 2 status enabled", isPart2Disabled);

  const handleOptSelect = (val) => {
    setDetailsViewClick(val);
  };

  console.log("CHecking Reporttttttt Deaddddddddddddlineeeeeeeee", ReportDeadline && ReportDeadline);

  const handleRepInstance = () => {
    console.log("Hanlde SUccess Responseeeeeeeeeeee Calleddddddddddddddddddddd");
    setShowReportInstance(false);
  };

  // const fetchAssignedPanelId = async () => {
  //   const key = JSON.parse(localStorage.getItem("key"));
  //   try {
      
  //     const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
  //     console.log("Request Sent");
  //     const response = await axios.get(`/api/ScheduleExamRoutes/scheduled/specific/${termId}?role=${user.role}`, config);
  //     if(response.status === 200) {

  //     }else{

  //     }
  //   } catch (error) {
  //     console.error('Error fetching Exam data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const convertToDDMMYYYY = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

  const fetchCreatedExamReport = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const FYPData = JSON.parse(localStorage.getItem("FYPData"));
      console.log("User FYPData:", FYPData);
      
      if (!FYPData || !FYPData.assignedPanel) {
        console.log("No panel assigned to this group yet.");
        setShowReportInstance(false);
        return;
      }
      
      const panelId = FYPData.assignedPanel;
      console.log("PanelId:", panelId);
      console.log("Checking User Role", user.role);
      
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      
      // Fetch already submitted reports for the group
      let reports = [];
      try {
        const reportsResponse = await axios.get(`/api/StudentReport/gettingGroupReports/${FYPData._id}`, config);
        if (reportsResponse.status === 200) {
          reports = reportsResponse.data.reports || [];
        }
      } catch (err) {
        console.log("No reports found or error fetching reports:", err.message);
      }
      
      console.log("Requesting scheduled exams...");
      const response = await axios.get(`/api/ScheduleExamRoutes/scheduled/specific/${panelId}?role=${user.role}`, config);
  
      if (response.status === 200 && response.data && response.data.exams) {
        console.log("Fetched scheduled exams:", response.data.exams);
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        let activeExam = null;
        let activeReportStatus = null;
        let activeFeedback = '';

        for (const exam of response.data.exams) {
          const examEntry = exam.CreatedExam;
          if (!examEntry || !examEntry.ExamType) continue;

          const examId = examEntry.ExamType._id;
          const matchingReport = reports.find(r => r.Exam?._id === examId || r.Exam === examId);
          const reportStatus = matchingReport ? matchingReport.status : null;

          const announcedDateRaw = examEntry.AnnouncedDate;
          const reportDeadlineRaw = examEntry.ReportDeadline;
          
          let isWindowOpen = false;
          if (announcedDateRaw && reportDeadlineRaw) {
            const announcedStr = announcedDateRaw.split('T')[0];
            const deadlineStr = reportDeadlineRaw.split('T')[0];
            isWindowOpen = announcedStr <= todayStr && todayStr <= deadlineStr;
          } else {
            isWindowOpen = true; 
          }

          console.log(`Exam: ${examEntry.ExamType.examName}, status: ${reportStatus}, window: ${isWindowOpen}`);

          // Trigger report submission if:
          // 1. Report is rejected (requires resubmission)
          // 2. No report exists yet and the submission window is active
          if (reportStatus === 'rejected') {
            activeExam = examEntry;
            activeReportStatus = 'rejected';
            activeFeedback = matchingReport.supervisorFeedback || 'Your report was denied. Please fix the issues and resubmit.';
            break;
          } else if (!reportStatus && isWindowOpen) {
            activeExam = examEntry;
            activeReportStatus = null;
            break;
          }
        }

        if (activeExam) {
          console.log("Setting active exam for report submission:", activeExam.ExamType.examName);
          setCreatedExam(activeExam);
          
          const reportDeadlineRaw = activeExam.ReportDeadline;
          if (reportDeadlineRaw) {
            const formattedReportDeadline = convertToDDMMYYYY(reportDeadlineRaw.split('T')[0]);
            setReportDeadline(formattedReportDeadline);
          }

          if (activeReportStatus === 'rejected') {
            setRejectionFeedback(activeFeedback);
            setIsReportRejected(true);
          } else {
            setRejectionFeedback('');
            setIsReportRejected(false);
          }
          setShowReportInstance(true);
        } else {
          console.log("No active exam requires report submission.");
          const defaultExam = response.data.exams[0]?.CreatedExam || '';
          setCreatedExam(defaultExam);
          if (defaultExam && defaultExam.ReportDeadline) {
            const formattedReportDeadline = convertToDDMMYYYY(defaultExam.ReportDeadline.split('T')[0]);
            setReportDeadline(formattedReportDeadline);
          }
          setRejectionFeedback('');
          setIsReportRejected(false);
          setShowReportInstance(false);
        }
      } else {
        console.log('No exams returned or error fetching exam data');
        setShowReportInstance(false);
      }
    } catch (error) {
      console.error('Error fetching Exam data:', error);
      setShowReportInstance(false);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Reporrrrt Instance Showing ", showReportInstance);

  const CheckReportExist = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const fyp = JSON.parse(localStorage.getItem("FYPData"));
      if (!fyp || !createdExam || !createdExam.ExamType) return;
      const groupId = fyp._id;
      const examId = createdExam.ExamType._id;
      console.log("Checking Exam", examId);
      console.log("Checking Group ID", groupId);

      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Fetch full report to check its status (not just existence)
      const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);

      if (response.status === 200) {
        const reports = response.data.reports || [];
        const matchingReport = reports.find(r => r.Exam?._id === examId || r.Exam === examId);

        if (matchingReport) {
          if (matchingReport.status === 'rejected') {
            console.log("Report REJECTED — re-opening submission form");
            setRejectionFeedback(matchingReport.supervisorFeedback || 'Your report was denied. Please fix the issues and resubmit.');
            setIsReportRejected(true);
            setShowReportInstance(true);
          } else {
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUploadedReports = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReportClick = (val) => {
    setReportClick(val);
    setShowReportInstance(true); // Set showReportInstance to true when the report icon is clicked
  };

  const handleGoBack = () => {
    setDetailsViewClick(false);
    setShowReportInstance(false); // Reset showReportInstance to false when going back
  };

  
  console.log("Check Click Report icon", ReportClick);

  return (
    <>
    {isLoading ? (
      <LoadingSpinner />
    ) : (
    <div className='mx-16'>
      {DetailsViewClick ? (
        <Tabs aria-label="Tabs with underline" style="underline" className='flex justify-around border-b-4 border-gray-300 '>
          <Tabs.Item active title="Part-1" className='border-b-2 border-white w-full px-2 hover:border-gray-200 '>
            <div className="partOneDetails flex flex-col gap-3">
              <ProjectInfo accordionId={71} data={Data.projectInfoData} />
              <Group_details accordionId={1} data={Data.testData} />
              <Panel_details accordionId={3} data={Data.panelData} />
              <OrientationEvaluation accordionId={4} data={Data.OrientationEvaluationData} />
              <ProposalEvaluation accordionId={5} data={Data.proposalEvaluationData} remarksData={Data.proposalRemarksData} />
              <TaskIEvaluation accordionId={6} data={Data.TaskIData} />
              <MidEvaluation accordionId={7} data={Data.midEvaluationData} remarksData={Data.proposalRemarksData} accordText="Mid I Evaluation" perc="(20)" />
              <FinalEvaluation accordionId={8} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText="Final I Evaluation" />
              <OverallEvaluationI accordionId={9} data={Data.overallEvaluationDataP1} />
              <div className='flex flex-row justify-end mr-5 mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBack} />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Part-2" className='border-b-2 border-transparent' disabled={isPart2Disabled}>
            <div className="partTwoDetails flex flex-col gap-3">
              <MidEvaluation accordionId={11} data={Data.midIIEvaluationData} remarksData={Data.proposalRemarksData} accordText="Mid II Evaluation" perc="(30)" />
              <FinalEvaluation accordionId={12} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText="Final II Evaluation" />
              <OverallEvaluationII accordionId={13} data={Data.overallEvaluationDataP2} />
              <div className='flex flex-row justify-end mr-5 mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBack} />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Overall" className='border-b-2 border-transparent'>
            <div className="OverallEvaluationDetails flex flex-col gap-3">
              <StdOverAllReport />
            </div>
            <div className='flex flex-row justify-end mr-5 mt-5'>
              <ButbgPrimary text="Back" onClick={handleGoBack} />
            </div>
          </Tabs.Item>
        </Tabs>
      ) : showReportInstance ? (
        <ReportSubmissionComponent accordionId={202} onGoBack={handleGoBack} createdExam={createdExam} ReportInst={handleRepInstance} rejectionFeedback={rejectionFeedback} />
      ) : (
        <StudentProjectDetails accordionId={15} data={Data.StudentProjectDetailsData} onOptSelect={handleOptSelect} onReportSelect={handleReportClick} FetchedGroupReports={FetchedGroupReports}/>
      )}
    </div>
    )}
    </>
  );
};

export default ProjectDetails;
