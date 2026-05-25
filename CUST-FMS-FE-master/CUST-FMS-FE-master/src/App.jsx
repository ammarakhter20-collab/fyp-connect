

import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/StdLogin";
import Dashboard from "./pages/Student/StdDashFolder/StdDashboard";
import Layout from "./Components/StdLayouts/StdLayout";
import StdViewProject from "./pages/Student/StdViewProject/StdViewProject"
import AssignedTasks from "./pages/Student/StdAssignedTask/StdAssignedTasks";
import ChatCall from "./pages/Student/StdChatAndCall/StdChatCall";
import Request from "./pages/Student/StdchangRequest/StdRequest";
// import Request from "./pages/StdchangRequest/StdRequest";
import FYPRegistration from "./pages/Student/StdFYPRegister/StdFYPRegistration";
import Timetable from "./pages/Student/StdTimetable/StdTimetable";
import CourseCatalog from "./pages/Student/StdCourseCat/StdCourseCatalog";
import Profile from "./pages/Student/StudProfile/StdStudProfile"
import Announcement from "./pages/Student/StdAnnouncement/StdAnnouncement";
import SupDashboard from "./pages/Supervisor/SupDashboard/SupDashboard";
import SupLayout from "./Components/SupLayouts/SupLayout";
// import SupProjectDetails from "./pages/SupProjectDetails/SupProjectDetails";
import SupAssignedTasks from "./pages/Supervisor/SupAssignedTask/SupAssignedTasks";
import SupChatAndCall from "./pages/Supervisor/SupChatAndCall/SupChatCall";
import SupRequest from "./pages/Supervisor/SupRequest/SupRequest";
import SupTimetable from "./pages/Supervisor/SupTimetable/SupTimetable";
import SupCourseCatalog from "./pages/Supervisor/SupCourseCat/SupCourseCatalog";
import SignUp from "./pages/SignUp";
import SupUploadFYPtopic from "./pages/Supervisor/SupUploadFYPTopic/SupUploadFYPTopic";
import SupAttendance from "./pages/Supervisor/SupAttendance/SupAttendance";
import SupAssignedExam from "./pages/Supervisor/SupAssignedExams/SupAssignedExams";
import SupAnnouncements from "./pages/Supervisor/SupAnnouncement/SupAnnouncements";
import SupProfile from './pages/Supervisor/SupProfile/SupProfile';
import RootLayout from "./RootLayout";

import Loggout from './StdLogout'
import { useEffect, useState } from "react";
import axios from "axios";
import AdmDashboard from "./pages/Admin/AdmDashboard/AdmDashboard";
import AdmLayout from './Components/AdmLayouts/AdmLayout'
import AdmProfile from "./pages/Admin/AdmProfile/AdmProfile";

import AdmFYPSessionTerm from "./pages/Admin/AdmFYPSessionTerm/AdmFYPSessionTerm";
import AdmCreateDepartment from "./pages/Admin/AdmCreateDepartment/AdmCreateDepartment";
import AdmProgramCreate from "./pages/Admin/AdmProgramCreate/AdmProgramCreate";
import AdmCreateStudent from "./pages/Admin/AdmStudentCreate/AdmCreateStudent";
import AdmFacultyCreate from "./pages/Admin/AdmFacultyCreate/AdmFacultyCreate";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner";
import SupPrevSupervisedProj from "./pages/Supervisor/SupProjectThesis/SupPrevSupervisedProj";
import SupPanelDetails from "./pages/Supervisor/SupPanelDetails/SupPanelDetails";
import CoodDashboard from "./pages/Coordinator/CoodDashboard/CoodDashboard";
import CoodProfile from "./pages/Coordinator/CoordinatorProfile/CoodProfile";
import CoodLayout from "./Components/CoordinatorLayouts/CoodLayout";
import HoDLayout from "./Components/HoDLayouts/HoDLayout";
import CoodFypRegistration from "./pages/Coordinator/CoodFypRegistration/CoodFypRegistration";
import CoodFeedback from "./pages/Coordinator/CoodFeedback/CoodFeedback";
import CoodExaminerPanel from "./pages/Coordinator/CoodExaminerPanel/CoodExaminerPanel";
import CoodStudentList from "./pages/Coordinator/CoodReports/CoodStudentLists/CoodStudentList";
import CoodProjectsLists from "./pages/Coordinator/CoodReports/CoodProjectsLists/CoodProjectsLists";
import CoodCreateProject from "./pages/Coordinator/CoodManageProjects/CoodCreateProject/CoodCreateProject";
import CoodCategory from "./pages/Coordinator/CoodManageProjects/CoodCategory/CoodCategory";
import CoodPlatForm from "./pages/Coordinator/CoodManageProjects/CoodPlatForm/CoodPlatForm";
import CoodTechnology from "./pages/Coordinator/CoodManageProjects/CoodTechnology/CoodTechnology";
import CoodCreateExamType from "./pages/Coordinator/CoodManageExams/CoodCreateExamType/CoodCreateExamType";
import CoodCreateExam from "./pages/Coordinator/CoodManageExams/CoodCreateExam/CoodCreateExam";
import CoodManageExamClo from "./pages/Coordinator/CoodManageExams/CoodManageClo/CoodManageExamClo/CoodManageExamClo";
import CoodManagePercentage from "./pages/Coordinator/CoodManageExams/CoodManagePercentage/CoodManagePercentage";
import CoodManageQuestions from "./pages/Coordinator/CoodManageExams/CoodManageClo/CoodManageQuestions/CoodManageQuestions";
import CoodManageClos from "./pages/Coordinator/CoodManageExams/CoodManageClo/CoodManageClos/CoodManageClos";
import CoodAssignedExam from "./pages/Coordinator/CoodAssignedExams/CoodAssignedExam";
import CoodAssignPanel from "./pages/Coordinator/CoodAssignPanel/CoodAssignPanel";
import CoodResults from "./pages/Coordinator/CoodResults/CoodResults";
import HoDProfile from "./pages/HoD/HoDProfile/HoDProfile";
import HoDDashboard from "./pages/HoD/HoDDashboard/HoDDashboard";
import HoDAnnouncement from "./pages/HoD/HoDAnnouncement/HoDAnnouncement";
import HoDCourseCatalog from "./pages/HoD/HoDCourseCatalog/HoDCourseCatalog";
import HoDTechnology from "./pages/HoD/HoDTechnology/HoDTechnology";
import HoDStudentList from "./pages/HoD/HoDStudentList/HoDStudentList";
import HoDCategories from "./pages/HoD/HoDCategories/HoDCategories";
import HoDProjectList from "./pages/HoD/HoDProjectList/HoDProjectList";
import HoDExamTypes from "./pages/HoD/HoDExamTypes/HoDExamTypes";
import HoDClos from "./pages/HoD/HoDClos/HoDClos";
import HoDResults from "./pages/HoD/HoDResults/HoDResults";
import HoDFeedback from "./pages/HoD/HoDFeedback/HoDFeedback";
import HoDPlatform from "./pages/HoD/HoDPlatform/HoDPlatform";
import HoDExaminerPanel from "./pages/HoD/HoDExaminerPanel/HoDExaminerPanel";
import HoDExamlist from "./pages/HoD/HoDExamlist/HoDExamlist";
import HoDViewProjectDetails from "./pages/HoD/HoDViewProjectDetails/HoDViewProjectDetails";
import CoodCourseCat from "./pages/Coordinator/CoodCourseCat/CoodCourseCat";
import CoordAddAnnouncement from "./pages/Coordinator/CoordAnnouncement/CoordAddAnnouncement";
import CoodEvaluationStatuses from "./pages/Coordinator/CoodEvaluationStatuses/CoodEvaluationStatuses";
import CoodViewProjectDetails from "./pages/Coordinator/CoodViewProjectDetails/CoodViewProjectDetails";

// Suppress harmless ResizeObserver errors from causing the full-screen error overlay in dev mode
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  originalError.call(console, ...args);
};

window.addEventListener('error', function(e) {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || e.message === 'ResizeObserver loop limit exceeded') {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErr) resizeObserverErr.setAttribute('style', 'display: none');
    if (resizeObserverErrDiv) resizeObserverErrDiv.setAttribute('style', 'display: none');
  }
});

function App() {
  const [isFYPRegistered, setIsFYPRegistered] = useState(false); // Default to true
  const [isLoading, setIsLoading] = useState(false);
  const [AdmData] = useState('');

  // Initialize UserRole from localStorage to avoid white screen race condition
  const [UserRole, setUserRole] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.role : '';
    } catch (e) {
      console.error('Error parsing user from local storage:', e);
      return '';
    }
  });
  // Simulating fetching user data from the database
  useEffect(() => {
    // Your API call or database query to check if FYP data exists for the user
    const fetchFypDetails = async () => {
      try {
        setIsLoading(true);
        const key = JSON.parse(localStorage.getItem("key"));
        console.log("Token:", key);
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
          console.log("No user logged in");
          setIsLoading(false);
          return;
        }

        console.log("User role:", currentUser.role);
        setUserRole(currentUser.role);

        // Only fetch FYP data for students (faculty/supervisors don't have registrationNumber)
        if (currentUser.role !== 'Student') {
          console.log("Not a student, skipping FYP data fetch");
          setIsLoading(false);
          return;
        }

        const currentUserRegNum = currentUser.registrationNumber;
        console.log("Checking current logged in user data", currentUserRegNum);

        if (!key) {
          console.error('Bearer token is missing.');
          return;
        }

        const config = {
          headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
        };

        // const requestBody = {
        //   currentUserRegNum: currentUserRegNum // Include currentUserRegNum in the request body
        // };

        const url = `/api/fyp/getfypregistrationsforStudent/${currentUser._id}`;

        console.log("Before fetching FYP data using ID:", currentUser._id);
        const response = await axios.get(url, config);
        
        const userFypRegistration = response.data.FYPDatas?.[0];

        if (response.status === 200 && userFypRegistration) {
          if (userFypRegistration.reqStatus === 'approved') {

            setIsFYPRegistered(true);
          }
          else {
            setIsFYPRegistered(false);
          }
          //           // Check if the current logged-in user's registration number exists in the groupMembers array
          //           const currentUser = JSON.parse(localStorage.getItem('user'));
          //           const currentUserRegistrationNumber = currentUser.registrationNumber;

          //           let isUserRegistered = false;

          // userFypRegistration.groupMembers.forEach(member => {
          //   if (member.registrationNumber === currentUserRegistrationNumber) {
          //     isUserRegistered = true;
          //     return; // Exit the loop early if match found
          //   }
          // });

          console.log("Checking user is registered or not");

          // console.log("Checking user registered in App.jsx", isUserRegistered);



          localStorage.setItem("FYPData", JSON.stringify(userFypRegistration));
        } else {
          console.error('Error fetching user fyp data:', response.statusText);
        }

      } catch (error) {
        console.error('Error during fetchFypDetails:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 497)) {
          localStorage.clear();
          setUserRole('');
          window.location.href = '/login'; 
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFypDetails();
  }, []);



  return (
    <>
      {isLoading ? (

        <LoadingSpinner />
      ) : (

        <Routes>
          {/* Admin Routes  */}




          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/" element={<RootLayout />} >

            {/* Student Routes */}
            {(UserRole === 'Student' || UserRole === 'student') && (
              <>
                <Route
                  path="Profile"
                  element={

                    <Layout isFYPRegistered={isFYPRegistered}>
                      <Profile isFYPRegistered={isFYPRegistered} />
                    </Layout>

                  }
                />
                <Route
                  path="Dashboard"
                  element={

                    <Layout isFYPRegistered={isFYPRegistered}>
                      <Dashboard isFYPRegistered={isFYPRegistered} accordionId={234} />
                    </Layout>

                  }
                />

                <Route
                  path="FYPRegistration"
                  element={
                    <Layout isFYPRegistered={isFYPRegistered}>
                      <FYPRegistration isFYPRegistered={isFYPRegistered} accordionId={36} />
                    </Layout>
                  }
                />


                {isFYPRegistered && ( // Reverse the condition
                  <>
                    <Route
                      path="StudentProjectDetails"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered} >
                          <StdViewProject />
                        </Layout>
                      }
                    />
                    <Route
                      path="Request"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered}>
                          <Request />
                        </Layout>
                      }
                    />
                    <Route
                      path="AssignedTasks"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered}>
                          <AssignedTasks accordionId={21} />
                        </Layout>
                      }
                    />
                    <Route
                      path="ChatCall"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered}>
                          <ChatCall />
                        </Layout>
                      }
                    />
                    <Route
                      path="Timetable"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered}>
                          <Timetable />
                        </Layout>
                      }
                    />
                    <Route
                      path="CourseCatalog"
                      element={
                        <Layout isFYPRegistered={isFYPRegistered}>
                          <CourseCatalog accordionId={20} />
                        </Layout>
                      }
                    />
                  </>
                )}

                <Route path="Announcement" element={
                  <Layout isFYPRegistered={isFYPRegistered}>
                    <Announcement accordionId={61} />
                  </Layout>
                } />
              </>

            )}

            {/* Student Routes */}


            {/* Supervisor Routes */}
            {UserRole === 'faculty' && (
              <>

                <Route
                  path="SupProfile"
                  element={

                    <SupLayout>
                      <SupProfile />
                    </SupLayout>
                  }
                />
                <Route path="SupDashboard" element={
                  <SupLayout>
                    <SupDashboard />
                  </SupLayout>
                } />

                <Route path="SupuploadFYPtopic" element={
                  <SupLayout>
                    <SupUploadFYPtopic />
                  </SupLayout>
                } />


                {/* <Route path="/SupProjectDetails" element={
        <SupLayout>
          <SupProjectDetails/>
        </SupLayout>
      }/> */}

                <Route path="SupRequest" element={
                  <SupLayout>
                    <SupRequest />
                  </SupLayout>
                } />

                <Route path="SupPrevSupProj" element={
                  <SupLayout>
                    <SupPrevSupervisedProj />
                  </SupLayout>
                } />

                <Route path="SupAssignedTasks" element={
                  <SupLayout>
                    <SupAssignedTasks accordionId={21} />
                  </SupLayout>
                } />

                <Route path="SupChatCall" element={
                  <SupLayout>
                    <SupChatAndCall />
                  </SupLayout>
                } />

                <Route path="SupTimetable" element={
                  <SupLayout>
                    <SupTimetable />
                  </SupLayout>
                } />

                <Route path="SupAttendance" element={
                  <SupLayout>
                    <SupAttendance />
                  </SupLayout>
                } />
                <Route path="SupAssignedExam" element={
                  <SupLayout>
                    <SupAssignedExam />
                  </SupLayout>
                } />
                <Route path="SupPanelDetails" element={
                  <SupLayout>
                    <SupPanelDetails />
                  </SupLayout>
                } />

                <Route path="SupAnnouncements" element={
                  <SupLayout>
                    <SupAnnouncements />
                  </SupLayout>
                } />

                <Route path="SupCourseCatalog" element={
                  <SupLayout>
                    <SupCourseCatalog accordionId={20} />
                  </SupLayout>
                } />

              </>
            )}


            {/* Supervisor Routes */}

            {/* Coordinator Routes */}

            {(UserRole === 'coordinator' || UserRole === 'Coordinator') && (
              <>
                <Route path="/CoodProfile" element={
                  <CoodLayout>
                    <CoodProfile />
                  </CoodLayout>
                } />

                <Route path="/CoodDashboard" element={
                  <CoodLayout>
                    <CoodDashboard />
                  </CoodLayout>
                } />

                <Route path="/CoodAnnouncement" element={
                  <CoodLayout>
                    <CoordAddAnnouncement accordionId={380} />
                  </CoodLayout>
                } />

                <Route path="/CoodFypRegistration" element={
                  <CoodLayout>
                    <CoodFypRegistration accordionId={402} />
                  </CoodLayout>
                } />
                <Route path="/CoodFeedback" element={
                  <CoodLayout>
                    <CoodFeedback accordionId={370} />
                  </CoodLayout>
                } />
                <Route path="/CoodExaminerPanel" element={
                  <CoodLayout>
                    <CoodExaminerPanel />
                  </CoodLayout>
                } />
                <Route path="/CoodCourseCat" element={
                  <CoodLayout>
                    <CoodCourseCat accordionId={379} />
                  </CoodLayout>
                } />
                <Route path="/CoodStudentList" element={
                  <CoodLayout>
                    <CoodStudentList accordionId={371} />
                  </CoodLayout>
                } />
                <Route path="/CoodProjectsLists" element={
                  <CoodLayout>
                    <CoodProjectsLists accordionId={372} />
                  </CoodLayout>
                } />

                <Route path="/CoodCreateProject" element={
                  <CoodLayout>
                    <CoodCreateProject accordionId={369} />
                  </CoodLayout>
                } />





                <Route path="/CoodCreateTechnology" element={
                  <CoodLayout>
                    <CoodTechnology accordionId={367} />
                  </CoodLayout>
                } />
                <Route path="/CoodCreatePlatform" element={
                  <CoodLayout>
                    <CoodPlatForm accordionId={368} />
                  </CoodLayout>
                } />
                <Route path="/CoodCreateCategories" element={
                  <CoodLayout>
                    <CoodCategory />
                  </CoodLayout>
                } />


                <Route path="/CoodViewProjectDetails" element={
                  <CoodLayout>
                    <CoodViewProjectDetails />
                  </CoodLayout>
                } />


                <Route path="/CoodCreateExamType" element={
                  <CoodLayout>
                    <CoodCreateExamType />
                  </CoodLayout>
                } />
                <Route path="/CoodCreateExam" element={
                  <CoodLayout>
                    <CoodCreateExam />
                  </CoodLayout>
                } />
                <Route path="/CoodManageExamClo" element={
                  <CoodLayout>
                    <CoodManageExamClo />
                  </CoodLayout>
                } />
                <Route path="/CoodManageClos" element={
                  <CoodLayout>
                    <CoodManageClos />
                  </CoodLayout>
                } />
                <Route path="/CoodManageQuestions" element={
                  <CoodLayout>
                    <CoodManageQuestions />
                  </CoodLayout>
                } />
                <Route path="/CoodManagePercentage" element={
                  <CoodLayout>
                    <CoodManagePercentage />
                  </CoodLayout>
                } />
                <Route path="/CoodAssignedExam" element={
                  <CoodLayout>
                    <CoodAssignedExam />
                  </CoodLayout>
                } />
                <Route path="/CoodAssignPanel" element={
                  <CoodLayout>
                    <CoodAssignPanel />
                  </CoodLayout>
                } />
                <Route path="/CoodResults" element={
                  <CoodLayout>
                    <CoodResults />
                  </CoodLayout>
                } />
                <Route path="/CoodEvaluationStatuses" element={
                  <CoodLayout>
                    <CoodEvaluationStatuses accordionId={403} />
                  </CoodLayout>
                } />

              </>

            )}


            {/* HoD Routes */}

            {UserRole === 'hod' && (
              <>

                <Route path="/HoDProfile" element={
                  <HoDLayout>
                    <HoDProfile />
                  </HoDLayout>
                } />

                <Route path="/HoDDashboard" element={
                  <HoDLayout>
                    <HoDDashboard />
                  </HoDLayout>
                } />
                <Route path="/HoDAnnouncement" element={
                  <HoDLayout>
                    <HoDAnnouncement />
                  </HoDLayout>
                } />
                <Route path="/HoDCourseCatalog" element={
                  <HoDLayout>
                    <HoDCourseCatalog />
                  </HoDLayout>
                } />
                <Route path="/HoDTechnology" element={
                  <HoDLayout>
                    <HoDTechnology accordionId={375} />
                  </HoDLayout>
                } />
                <Route path="/HoDPlatform" element={
                  <HoDLayout>
                    <HoDPlatform />
                  </HoDLayout>
                } />
                <Route path="/HoDCategories" element={
                  <HoDLayout>
                    <HoDCategories />
                  </HoDLayout>
                } />

                <Route path="/HoDStudentList" element={
                  <HoDLayout>
                    <HoDStudentList accordionId={375} />
                  </HoDLayout>
                } />
                <Route path="/HoDExamlist" element={
                  <HoDLayout>
                    <HoDExamlist accordionId={377} />
                  </HoDLayout>
                } />

                <Route path="/HoDExaminerPanel" element={
                  <HoDLayout>
                    <HoDExaminerPanel accordionId={373} />
                  </HoDLayout>
                } />


                <Route path="/HoDProjectList" element={
                  <HoDLayout>
                    <HoDProjectList accordionId={374} />
                  </HoDLayout>
                } />
                <Route path="/HoDExamTypes" element={
                  <HoDLayout>
                    <HoDExamTypes accordionId={376} />
                  </HoDLayout>
                } />
                <Route path="/HoDClos" element={
                  <HoDLayout>
                    <HoDClos />
                  </HoDLayout>
                } />


                <Route path="/HoDResults" element={
                  <HoDLayout>
                    <HoDResults />
                  </HoDLayout>
                } />

                <Route path="/HoDFeedback" element={
                  <HoDLayout>
                    <HoDFeedback accordionId={373} />
                  </HoDLayout>
                } />

                <Route path="/HoDViewProjectDetails" element={
                  <HoDLayout>
                    <HoDViewProjectDetails />
                  </HoDLayout>
                } />

              </>

            )}


            {UserRole === 'admin' && (
              <>
                <Route
                  path="/AdmDashboard"
                  element={

                    <AdmLayout AdmData={AdmData}>
                      <AdmDashboard AdmData={AdmData} />
                    </AdmLayout>

                  }
                />
                <Route
                  path="/AdmProfile"
                  element={

                    <AdmLayout>
                      <AdmProfile AdmData={AdmData} />
                    </AdmLayout>

                  }
                />

                <Route
                  path="/AdmFYPSessionTerm"
                  element={

                    <AdmLayout>
                      <AdmFYPSessionTerm accordionId={107} />
                    </AdmLayout>

                  }
                />

                <Route
                  path="/AdmCreateDepartment"
                  element={

                    <AdmLayout>
                      <AdmCreateDepartment accordionId={106} />
                    </AdmLayout>

                  }
                />

                <Route
                  path="/AdmProgramCreate"
                  element={

                    <AdmLayout>
                      <AdmProgramCreate accordionId={109} />
                    </AdmLayout>

                  }
                />

                <Route
                  path="/AdmCreateStudent"
                  element={

                    <AdmLayout>
                      <AdmCreateStudent accordionId={111} />
                    </AdmLayout>

                  }
                />

                <Route
                  path="/AdmFacultyCreate"
                  element={

                    <AdmLayout>
                      <AdmFacultyCreate accordionId={112} />
                    </AdmLayout>

                  }
                />
              </>
            )}


            <Route path="Logout" element={
              <Layout isFYPRegistered={isFYPRegistered}>
                <Loggout />
              </Layout>
            } />

          </Route>

        </Routes>

      )}
    </>
  );
}

export default App;
