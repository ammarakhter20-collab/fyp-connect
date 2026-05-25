import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/StdLogin";
import Dashboard from "./pages/Student/StdDashFolder/StdDashboard";
import Layout from "./Components/StdLayouts/StdLayout";
import ProjectDetails from "./pages/StdProjectDetails";
import AssignedTasks from "./pages/Student/StdAssignedTask/StdAssignedTasks";
import ChatCall from "./pages/Student/StdChatAndCall/StdChatCall";
import Request from "./pages/Student/StdchangRequest/StdRequest";
// import Request from "./pages/StdchangRequest/StdRequest";
import FYPRegistration from "./pages/Student/StdFYPRegister/StdFYPRegistration";
import Timetable from "./pages/Student/StdTimetable/StdTimetable";
import CourseCatalog from "./pages/Student/StdCourseCat/StdCourseCatalog";
import Profile from "./pages/Student/StudProfile/StdStudProfile"
import Announcement  from "./pages/Student/StdAnnouncement/StdAnnouncement";
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
import { Logout } from "@mui/icons-material";
import Loggout from './StdLogout'
import { useEffect, useState } from "react";
import axios from "axios";
import AdmDashboard from "./pages/Admin/AdmDashboard/AdmDashboard";
import AdmLayout from './Components/AdmLayouts/AdmLayout'
import AdmProfile from "./pages/Admin/AdmProfile/AdmProfile";
import FYPSessionTerm from "./pages/Admin/AdmFYPSessionTerm/AdmFYPSessionTerm";
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
import CoodCourseCat from "./pages/Coordinator/CoodCourseCat/CoodCourseCat";
import ProtectedRoute from "./Components/ProtectedRoute";



function MainRoutes({userRole}) {
    const [isFYPRegistered, setIsFYPRegistered] = useState(false); // Default to true
    const [isLoading, setIsLoading] = useState(false);
    const [AdmData,setAdmData] = useState('');
    const [authenticated, setAuthenticated] = useState(false); // Example state for authentication
   
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
            setIsLoading(false);
            return;
          }
          const currentUserRegNum = currentUser.registrationNumber;
          console.log("Checking current logged in user data", currentUserRegNum);
      
          if (!key) {
            console.error('Bearer token is missing.');
            setIsLoading(false);
            return;
          }
      
          const config = {
            headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
          };
  
          // const requestBody = {
          //   currentUserRegNum: currentUserRegNum // Include currentUserRegNum in the request body
          // };
  
          const url = `/api/fyp/fypdata?registrationNumber=${currentUserRegNum}`;
      
          console.log("Before fetching FYP data");
          const response = await axios.get(url, config);
          if (response.status === 404) {
            console.log("FYP Data not Found");
            setIsLoading(false);
            return;
          }
          const userFypRegistration = response.data.FYPDatas?.[0];
          
      
          console.log("Checking user Fyp Registrationnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", userFypRegistration);
      
          if (response.status === 200) {
            if(userFypRegistration.reqStatus === 'approved'){
  
              setIsFYPRegistered(true);
            }
            else{
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
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchFypDetails();
        }, []);
  
  
    
  
        return (
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/logout" element={<Logout />} />
        
              {/* Protected Route */}
              <ProtectedRoute path="/" element={<RootLayout />} userRole={userRole}>
                {/* Routes for each role */}
                {userRole === 'Student' && (
                  <>
                    <Route path="profile" element={<Layout />} />
                    <Route path="dashboard" element={<Layout />} />
                    {/* Add more student routes as needed */}
                  </>
                )}
        
                {userRole === 'faculty' && (
                  <>
                    <Route path="supProfile" element={<SupLayout />} />
                    <Route path="supDashboard" element={<SupLayout />} />
                    {/* Add more faculty routes as needed */}
                  </>
                )}
        
                {userRole === 'Coordinator' && (
                  <>
                    <Route path="coodProfile" element={<CoodLayout />} />
                    <Route path="coodDashboard" element={<CoodLayout />} />
                    {/* Add more coordinator routes as needed */}
                  </>
                )}
        
                {userRole === 'hod' && (
                  <>
                    <Route path="hodProfile" element={<HoDLayout />} />
                    <Route path="hodDashboard" element={<HoDLayout />} />
                    {/* Add more HoD routes as needed */}
                  </>
                )}
        
                {userRole === 'admin' && (
                  <>
                    <Route path="AdmDashboard" element={<AdmDashboard />} />
                    <Route path="AdmProfile" element={<AdmProfile />} />
                    {/* Add more admin routes as needed */}
                  </>
                )}
              </ProtectedRoute>
        
              {/* Default route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          );
        }
  
  export default MainRoutes;
  
