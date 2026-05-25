import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Simple from '../../../Components/Buttons/Simple';

import { departmentAndPrograms } from '../AdmStudentCreate/ProgramData';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import SuccessMessage from '../../../Components/ConfirmationMessages/SuccessMessage';

const AdmCreateStudent = ({ accordionId }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [gpa, setGpa] = useState('');
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loadingSpinner, setloadingSpinner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [ProgramOptions, setProgramOptions] = useState([]);
  const [TermOptions, setTermOptions] = useState([]);
  const [TermForAccor, setTermForAccor] = useState('');
  const [DepartmentOptions, setDepartmentOptions] = useState([]);
  const [SelectedProgramDepartmentId, setSelectedProgramDepartmentId] = useState('');
  const [SelectedProgramTermId, setSelectedProgramTermId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [Checking, setChecking] = useState('');

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    initFlowbite();
    // if(!localStorage.getItem('key')){
    //   Navigate('/login');
    // }

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AdmCreateStudent';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  console.log("Checking Filtered Studentsssssssssssss", filteredStudents);




  useEffect(() => {
    fetchStudentData();
  }, []);
  useEffect(() => {
    fetchProgramNames();
  }, []);
  useEffect(() => {
    fetchDepartmentData();
  }, []);
  useEffect(() => {
    fetchFYPTerms();
  }, []);


  const importStudent = async () => {
    // Create an input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx'; // Specify accepted file types if needed

    // Listen for changes in the input element
    input.addEventListener('change', async (event) => {
      try {
        const file = event.target.files[0];

        // Create FormData object to send file data
        const formData = new FormData();
        formData.append('excel', file);

        // Make API call to upload the file
        const response = await fetch('/api/excelUser/uploadSheet', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload file');
        }

        // Handle successful file upload
        const data = await response.json(); // Parse response JSON
        alert(data.message);
        setTimeout(() => {
          window.location.reload(); // Reload the page after a short delay
        }, 0);
      } catch (error) {
        // Handle errors
        console.error('Error uploading file:', error.message);
        alert('Error uploading file: ' + error.message); // Show error message in an alert box
      }
    });

    // Programmatically trigger the file selection dialog
    input.click();
  };



  const filterStudentsByTerm = () => {
    if (!selectedTerm) {
      setTermForAccor('All');
      setFilteredStudents([...students]); // If no term selected, show all faculties
    } else {
      const filtered = students.filter(student => {

        if (student.term?._id === selectedTerm) {
          setTermForAccor(student.term.sessionTerm);
        }
        return student.term?._id === selectedTerm;
      });
      console.log("Check filtered Students", filtered);
      setFilteredStudents(filtered);
    }
  };

  useEffect(() => {
    filterStudentsByTerm();
  }, [selectedTerm, students]);


  const fetchStudentData = async () => {
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/fetchStudentData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Students Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data.students);
        setStudents(data.students); // Update students state with fetched data
        // setloadingSpinner(false);
      } else {
        console.log('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setloadingSpinner(false);
    }
  };

  const fetchProgramOfSelDep = async (depId) => {
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/fetchProgramData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Filter programs based on departmentId
        const programs = data.programs
          .filter(program => program.department._id === depId)
          .map(program => ({
            value: program._id,
            label: program.programTitle,
            departmentId: program.department._id,
            // termId: program.term._id,
          }));
        console.log("Checking compared programs", programs);
        // Set the filtered programs in the state
        setProgramOptions(programs);
      } else {
        console.log('Failed to fetch programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setloadingSpinner(false);
    }
  };







  const fetchProgramNames = async () => {
    try {
      setloadingSpinner(true);
      console.log("Insideeeeeeeeeeeeeeeeeee");

      // Update API endpoint for fetching programs
      const apiUrl = '/api/auth/fetchProgramData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Request sent");
      // console.log("Checking Fetched Program  Names", response.data);

      if (response.ok) {
        console.log("Inside Fetch Program 1");
        const data = await response.json();
        console.log("Data Department id checkinng", data.programs[0].department._id);
        console.log("Data Department name checkinng", data.programs[0].department.departmentName);

        // Assuming data.programs is an array of program objects
        const programs = data.programs.map(program => ({
          value: program._id,
          label: program.programTitle,
          departmentId: program.department._id,
          // departmentName: program.department.departmentName,
          // termId: program.term._id, 
        }));
        console.log("Inside Fetch Program 2");
        // console.log("Program Options ", programs);
        // Set departmentOptions from the fetched programs
        // const departmentOptions = data.programs.map(program => ({
        //   value: program.department._id, // Assuming department has an _id field
        //   label: program.department.departmentName, // Assuming department has a departmentName field
        //   // termId: program.term._id,
        // }));

        // console.log("Checking Department Optionsssssssssssssssssssssssssssssssssssss", departmentOptions);

        console.log("Inside Fetch Program 3");

        // Set departmentData from the fetched programs
        // const departmentData = [...new Set(programs.map(program => program.departmentId))];

        // Set termData from the fetched programs
        // const termData = [...new Set(programs.map(program => program.termId))];

        // setProgramOptions(programs);
        // setDepartmentOptions(departmentOptions);
        // setDepartmentData(departmentData);
        // setTermData(termData);
      } else {
        console.log('Failed to fetch program names');
      }
    } catch (error) {
      console.error('Error fetching program names:', error);
    }
    finally {
      setloadingSpinner(false);
    }
  };


  const fetchDepartmentData = async () => {
    try {
      setloadingSpinner(true);
      console.log("Inside Departmentssssssssssssssssss");

      // Update API endpoint for fetching programs
      const apiUrl = '/api/auth/fetchDepartmentData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      console.log("Request Sentttttttt");

      if (response.ok) {
        console.log("Inside Fetch Department 1");
        const data = await response.json();
        console.log("Data program array", data.departments);
        // Assuming data.programs is an array of program objects
        const departmentOptions = data.departments.map(department => ({

          value: department._id,
          label: department.departmentName,

        }));

        console.log("Checking Fetched DepartmentOptionssssssssssssssss", departmentOptions);
        setDepartmentOptions(departmentOptions);
      } else {
        console.log('Failed to fetch program names');
      }
    } catch (error) {
      console.error('Error fetching program names:', error);
    }
    finally {
      setloadingSpinner(false);
    }
  };

  const fetchFYPTerms = async () => {
    try {
      // Update API endpoint for fetching FYP terms
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const apiUrl = '/api/auth/getTermdata';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Inside Fetch FYP Terms 1");
        const data = await response.json();

        // Assuming data.fypTerms is an array of FYP term objects
        const fypTerms = data.fypTerms.map(term => ({
          value: term._id,
          label: term.sessionTerm,
          startDate: term.startDate,
          endDate: term.endDate,
          status: term.status, // Capture the actual status string (e.g. 'activated')
        }));

        // Sort terms based on activation status (active terms first)
        fypTerms.sort((a, b) => {
          if (a.status === 'activated' && b.status !== 'activated') return -1;
          if (a.status !== 'activated' && b.status === 'activated') return 1;
          return 0; // no change in order if both are active or inactive
        });

        // Set fypTermOptions from the sorted FYP terms
        const fypTermOptions = fypTerms.map(term => ({
          value: term.value,
          label: term.label,
          startDate: term.startDate,
          endDate: term.endDate,
          status: term.status,
        }));

        console.log("Inside Fetch FYP Terms 3");

        // Set TermOptions with activated terms on top
        setTermOptions(fypTermOptions);
      } else {
        console.log('Failed to fetch FYP terms');
      }
    } catch (error) {
      console.error('Error fetching FYP terms:', error);
    }
  };



  const fetchActivatedTermsForChecks = async (selectedTermId) => {
    console.log("Function Calledddddddddddddddddddddddddddddddddddddddddd");
    try {
      console.log("Checking PAssed term Id in func", selectedTermId);
      console.log("Checking PAssed term Id in func", selectedTermId);
      console.log("Checking PAssed term Id in func", selectedTermId);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/auth//getActivatedTermForStudCreatCheck?selectedTermId=${selectedTermId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log("Checking Other Dataaaa Term", data.
            otherActivatedTermId);
          return data.otherActivatedTermId;
        } else {
          console.error('Response is not in JSON format:', await response.text());
        }
      } else {
        throw new Error('Failed to fetch activated terms.');
      }
    } catch (error) {
      console.error('Error fetching activated terms:', error);
      throw error;
    }
  };
  const checkStudExistInOtherTerm = async (registrationNumber) => {
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(`/api/auth/CheckStudExistInOtherActTerm?registrationNumber=${registrationNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse JSON response
        const exists = responseData.exists; // Access 'exists' property from response data
        console.log("Checking if student exists:", exists);
        return exists; // Return true or false
      } else {
        throw new Error('Failed to fetch student existence.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    console.log('Handle Submit Called in Student Creation');
    e.preventDefault();
    if (!validateForm()) {
      console.log('Form has validation errors. Please fix them.');
      return;
    }

    if (selectedStudent) {
      const studentId = selectedStudent;
      console.log("Student id inside selected student", studentId);
      updateStudent(studentId, registrationNumber, studentName, phoneNumber, creditHours, cgpa, gpa, email, secondaryEmail, password, selectedProgram, selectedDepartment, selectedTerm, cnic, address);

    } else {
      handleCreateStudent();
    }
  }
  const handleCreateStudent = async () => {
    // console.log("Inside create Student");
    try {
      setloadingSpinner(true);
      if (!validateForm()) {
        console.log('Form has validation errors. Please fix them.');
        return;
      }


      console.log("Before Function Calllingggggggggggggg");
      // const fetchT = await fetchActivatedTermsForChecks(selectedTerm.value);

      const StudExist = await checkStudExistInOtherTerm(registrationNumber);
      console.log("Checking Varrrrrrrrrrrrrr", StudExist);

      // console.log("Checking selectedTermmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", selectedTerm.value);
      console.log("Checking labeelllllllllll selectedTermmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", selectedTerm.label);
      // console.log("Checking Fetcheddddddddddddddd TTTTTTTTTTTTT", fetchT);
      // console.log("Checking Fetcheddddddddddddddd TTTTTTTTTTTTT", fetchT);

      if (StudExist === false) {
        const apiUrl = '/api/auth/usercreation'; // Update API endpoint
        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            registrationNumber,
            name: studentName,
            phoneNumber,
            creditHours,
            cgpa,
            gpa,
            email,
            secondaryEmail,
            password,
            program: selectedProgram.value, // Use value instead of label
            department: selectedDepartment.value, // Use value instead of label
            term: selectedTerm.value,
            cnic,
            address,
            role: 'Student', // Assuming this is a student registration
            // Other fields as needed based on your model
          }),
        });
        // console.log("Request send")
        // console.log("Request send")
        // console.log("Request send")
        console.log("Finally Req Sent");
        if (response.ok) {
          console.log('Student created successfully');
          clearForm();
          setShowModal(false);
          const responseData = await response.json();
          console.log("Checking response student id", responseData.user._id);
          const newStudentId = responseData.user._id;

          const newStudent = {
            _id: newStudentId, // Use actual ID returned by the server
            name: studentName,
            phoneNumber,
            email,
            secondaryEmail,
            password,
            department: {
              _id: selectedDepartment.value, // Assuming you have department ID
              departmentName: selectedDepartment.label, // Assuming you have department name
            },
            program: {
              _id: selectedProgram.value,
              programTitle: selectedProgram.label,
            },
            term: {
              _id: selectedTerm.value,
              sessionTerm: selectedTerm.label,
            },
            cnic, // Assuming cnic is available in your form
            address,
            role: 'student', // Assuming this is a student registration
            registrationNumber,
            creditHours,
            cgpa,
            gpa, // Assuming termId is available
          };
          //   newStudent.department = {
          //     ...newStudent.department,
          //     departmentName: newStudent.department.departmentName,
          // };
          clearForm();
          setStudents([newStudent, ...students]);
          setConfirmationMessage('Student Created Successfully');
          setShowConfirmation(true);

          // window.location.reload(true);
        } else {
          console.log('Failed to create student');
        }
      }
      else {
        window.alert('User is already registered in another activated term.');
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
    finally {
      setloadingSpinner(false);
    }
  };
  // studentId, registrationNumber, studentName, phoneNumber, creditHours, cgpa, gpa, email, password, selectedProgram, selectedDepartment, selectedTerm, cnic);

  console.log("Selected Termmmm", selectedTerm);
  const updateStudent = async (
    studentId,
    UpdregistrationNumber,
    UpdstudentName,
    UpdphoneNumber,
    UpdcreditHours,
    Updcgpa,
    Updgpa,
    Updemail,
    UpdsecEmail,
    Updpassword,
    UpdselectedProgram,
    UpdselectedDepartment,
    UpdselectedTerm,
    Updcnic,
    Updaddress,

  ) => {
    console.log("Inside handleUpdateProgram");
    console.log("StudentId", studentId);
    console.log("regNo", UpdregistrationNumber);
    console.log("studentName", UpdstudentName);
    console.log("phoneNumber", UpdphoneNumber);
    console.log("Ch", UpdcreditHours);
    console.log("Cgpa", Updcgpa);
    console.log("gpa", Updgpa);
    console.log("email", Updemail);
    console.log("email", UpdsecEmail);
    console.log("password", Updpassword);
    console.log("sel Prog", UpdselectedProgram);
    console.log("sel Dep", UpdselectedDepartment);
    console.log("sel Term", UpdselectedTerm);
    console.log("cnic", Updcnic);
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/updateStudentData';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      // studentId, registrationNumber, studentName, phoneNumber, creditHours, cgpa, gpa, email, password, selectedProgram, selectedDepartment, selectedTerm, cnic);
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: studentId,
          registrationNumber: UpdregistrationNumber,
          studentName: UpdstudentName,
          phoneNumber: UpdphoneNumber,
          creditHours: UpdcreditHours,
          cgpa: Updcgpa,
          gpa: Updgpa,
          email: Updemail,
          secondaryEmail: UpdsecEmail,
          password: Updpassword,
          program: UpdselectedProgram.value,
          department: UpdselectedDepartment.value,
          term: UpdselectedTerm.value,
          cnic: Updcnic,
          address: Updaddress,

        }),
      });

      if (response.ok) {
        // Handle successful update
        console.log('Program updated successfully');
        console.log("Stud Name Update check", studentName);
        clearForm(); // Clear selected Department if needed
        setShowModal(false);
        // window.location.reload(true);
        // studentId, registrationNumber, studentName, phoneNumber, creditHours, cgpa, gpa, email, password, selectedProgram, selectedDepartment, selectedTerm, cnic);
        // const updatedStudent = students.map((item) => {
        //   console.log("Inside UpdatedStudent")
        //   if (item._id === studentId) {

        //     return {
        //       ...item,
        //       registrationNumber: UpdregistrationNumber,
        //   studentName: UpdstudentName,
        //   phoneNumber: UpdphoneNumber,
        //   creditHours: UpdcreditHours,
        //   cgpa: Updcgpa,
        //   gpa: Updgpa,
        //   email: Updemail,
        //   password: Updpassword,
        //   program: UpdselectedProgram.value,
        //   department: UpdselectedDepartment.value,
        //   term: UpdselectedTerm.value,
        //   cnic: Updcnic,

        //     };
        //   }
        //   return item;
        // });
        // console.log("Checking state update updated Student", updatedStudent)
        // setStudents(updatedStudent);

        const updatedStudent = students.map((item) => {
          console.log("Inside updated state front end", studentId);
          if (item._id === studentId) {
            console.log("I am in")
            return {
              ...item,
              registrationNumber: UpdregistrationNumber,
              name: UpdstudentName,
              phoneNumber: UpdphoneNumber,
              creditHours: UpdcreditHours,
              cgpa: Updcgpa,
              gpa: Updgpa,
              email: Updemail,
              secondaryEmail: UpdsecEmail,
              password: Updpassword,
              program: UpdselectedProgram.value,
              department: UpdselectedDepartment.label,
              term: UpdselectedTerm.value,
              cnic: Updcnic,
              address: Updaddress,
            };
          }
          return item;
        });
        clearForm();
        console.log("Runtime updated", updatedStudent);
        setStudents(updatedStudent);
        setConfirmationMessage('Student Updated Successfully');
        setShowConfirmation(true);

        console.log("Check state updated or not", students);
        console.log("Called re-render");
      } else {
        // Handle update failure
        console.log('Failed to update program');
        // You may want to show an error message or perform other actions upon update failure
      }
    } catch (error) {
      console.error('Error updating program:', error);
      // Handle network errors or other errors
    } finally {
      setloadingSpinner(false);
    }
  };



  const clearForm = () => {
    setRegistrationNumber('');
    setStudentName('');
    setPhoneNumber('');
    setCreditHours('');
    setCgpa('');
    setGpa('');
    setEmail('');
    setSecondaryEmail('');
    setPassword('');
    setSelectedDepartment('');
    setSelectedProgram('');
    setCnic('');
    setAddress('');
    setSelectedTerm('');
    setSelectedStudent(null);

    setModalMode('create');
  };

  const handleEditStudent = (student) => {
    console.log("Inside edit student", student?._id);
    setSelectedStudent(student?._id);
    setRegistrationNumber(student?.registrationNumber || '');
    setStudentName(student?.name || '');
    setPhoneNumber(student?.phoneNumber || '');
    setCreditHours(student?.creditHours || '');
    setCgpa(student?.cgpa || '');
    setGpa(student?.gpa || '');
    setEmail(student?.email || '');
    setSecondaryEmail(student?.secondaryEmail || '');
    setPassword(student?.password || '');

    setSelectedProgram(student?.program ? { value: student.program._id, label: student.program.programTitle } : null);
    setSelectedDepartment(student?.department ? { value: student.department._id, label: student.department.departmentName } : null);
    setSelectedTerm(student?.term ? { value: student.term._id, label: student.term.sessionTerm } : null);

    setCnic(student?.cnic || '');
    setAddress(student?.address || '');
    setShowModal(true);
    setModalMode('edit');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);

    setRegistrationNumber(student?.registrationNumber || '');
    setStudentName(student?.name || '');
    setPhoneNumber(student?.phoneNumber || '');
    setCreditHours(student?.creditHours || '');
    setCgpa(student?.cgpa || '');
    setGpa(student?.gpa || '');
    setEmail(student?.email || '');
    setSecondaryEmail(student?.secondaryEmail || '');
    setPassword(student?.password || '');

    setSelectedProgram(student?.program ? { value: student.program._id, label: student.program.programTitle } : null);
    setSelectedDepartment(student?.department ? { value: student.department._id, label: student.department.departmentName } : null);
    setSelectedTerm(student?.term ? { value: student.term._id, label: student.term.sessionTerm } : null);

    setCnic(student?.cnic || '');
    setAddress(student?.address || '');
    setShowModal(true);
    setModalMode('view');
  };
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const deleteStudentData = async (studentId) => {
    console.log("Delete student ", studentId);
    console.log("Inside Delete Student ");
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/deleteStudent';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId }), // Pass studentId in the request body
      });

      if (response.ok) {
        // Handle successful deletion
        console.log('Student deleted successfully');
        console.log("Checking delete student id", studentId);

        // Filter out the deleted student from the students array
        const updatedStudents = students.filter(item => item._id !== studentId);
        console.log("Checking updated deleted", updatedStudents);


        // Update the students state with the filtered array
        setFilteredStudents(updatedStudents);
        setStudents(updatedStudents);

        // Show confirmation message
        setConfirmationMessage('Student Deleted Successfully');
        setShowConfirmation(true);

        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete student');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      // Handle network errors or other errors
    } finally {
      setloadingSpinner(false);
      console.log("Spinner", loadingSpinner);
      console.log("Finally of Delete Student");
    }
  };


  const handleDepartmentNameChange = async (selectedOption) => {
    console.log("Selected Department", selectedOption);
    setSelectedDepartment(selectedOption);
    await fetchProgramOfSelDep(selectedOption.value);
    // setProgramOptions(selectedOption.program);
    // console.log("Selected Department programs", selectedOption.program);
    // console.log("Selected Department of Student", selectedDepartment);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      selectedDepartment: '',

    }));
  };

  const handleTermChange = (selectedOption) => {

    setSelectedTerm(selectedOption);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      selectedTerm: '',

    }));

  };

  const handleInputChange = (e, setterFunction) => {
    const { name, value } = e.target;

    // Clear the error message for the field being edited
    const updatedFormErrors = { ...formErrors };
    updatedFormErrors[name] = '';

    // Set the updated form errors state
    setFormErrors(updatedFormErrors);

    // Update the state with the new value
    setterFunction(value);
  };

  // console.log("Department optionsssssssssssss", )


  const handleDepartmentChange = selectedOption => {
    setSelectedDepartment(selectedOption);
  };

  const handleProgramChange = selectedOption => {
    // console.log("Inside handle PRogram change", selectedOption)
    setSelectedProgram(selectedOption);
    // fetchDepartmentValueLabel(selectedOption.departmentId);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      selectedProgram: '',

    }));

    // setSelectedProgramDepartmentId(selectedOption.department._id);
    // setSelectedProgramTermId(selectedOption.department.program.term._id);
  };














  const [formErrors, setFormErrors] = useState({
    registrationNumber: '',
    studentName: '',
    phoneNumber: '',
    creditHours: '',
    cgpa: '',
    gpa: '',
    email: '',
    secondaryEmail: '',
    selectedDepartment: '',
    selectedProgram: '',
    selectedTerm: '',
    cnic: '',
    setAddress: '',
  });
  const validateForm = () => {
    let isValid = true;
    const errors = {
      registrationNumber: '',
      studentName: '',
      phoneNumber: '',
      creditHours: '',
      cgpa: '',
      gpa: '',
      email: '',
      secondaryEmail: '',
      selectedDepartment: '',
      selectedProgram: '',
      selectedTerm: '',
      cnic: '',
      setAddress: '',
    };



    // Perform your validation logic here
    if (!registrationNumber) {
      isValid = false;
      errors.registrationNumber = 'Please enter registration number.';
    }
    if (!studentName) {
      isValid = false;
      errors.studentName = 'Please enter student name.';
    }
    if (!phoneNumber) {
      isValid = false;
      errors.phoneNumber = 'Please enter phone Number.';
    }
    if (!phoneNumber) {
      isValid = false;
      errors.phoneNumber = 'Please enter phone Number.';
    }

    if (!creditHours) {
      isValid = false;
      errors.creditHours = 'Please enter creditHours.';
    }
    if (!cgpa) {
      isValid = false;
      errors.cgpa = 'Please enter cgpa.';
    } else {
      const cgpaNum = parseFloat(cgpa);
      if (isNaN(cgpaNum) || !/^\d+(\.\d+)?$/.test(cgpa)) {
        isValid = false;
        errors.cgpa = 'Only numeric values are allowed.';
      } else if (cgpaNum > 4) {
        isValid = false;
        errors.cgpa = 'Please enter a value of 4 or less than 4.';
      } else if (cgpaNum < 0) {
        isValid = false;
        errors.cgpa = 'CGPA cannot be less than 0.';
      }
    }
    if (!gpa) {
      isValid = false;
      errors.gpa = 'Please enter gpa.';
    } else {
      const gpaNum = parseFloat(gpa);
      if (isNaN(gpaNum) || !/^\d+(\.\d+)?$/.test(gpa)) {
        isValid = false;
        errors.gpa = 'Only numeric values are allowed.';
      } else if (gpaNum > 4) {
        isValid = false;
        errors.gpa = 'Please enter a value of 4 or less than 4.';
      } else if (gpaNum < 0) {
        isValid = false;
        errors.gpa = 'GPA cannot be less than 0.';
      }
    }
    if (!email) {
      isValid = false;
      errors.email = 'Please enter email.';
    }
    if (!secondaryEmail) {
      isValid = false;
      errors.secondaryEmail = 'Please enter secondary email.';
    }
    if (!selectedDepartment) {
      isValid = false;
      errors.selectedDepartment = 'Please select or enter Department.';
    }
    if (!selectedProgram) {
      isValid = false;
      errors.selectedProgram = 'Please select or enter Program.';
    }
    if (!selectedTerm) {
      isValid = false;
      errors.selectedTerm = 'Please select Term.';
    }

    if (!cnic) {
      isValid = false;
      errors.cnic = 'Please enter cnic.';
    }

    if (!address) {
      isValid = false;
      errors.address = 'Please enter addresss.';
    }



    setFormErrors(errors);
    return isValid;
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    // You may perform additional actions here like refetching data or resetting filters
    setFilteredStudents(students); // Reset filtered faculties to show all faculties
  };



  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='mx-16'>
          {showConfirmation && (
            <SuccessMessage
              message={confirmationMessage}
              onClose={handleCloseConfirmation}
            />

          )}
          <div className='bg-primary max-h-40 h-40 max-w-xs rounded-lg mb-6 mt-12'>
            <div className=''>
              <p className='font-semibold text-white text-xl ml-6 pt-4'>Student</p>
            </div>
            <div className='mt-12 ml-6'>
              <Simple text={'Create'} onClick={() => setShowModal(true)} />
            </div>
          </div>

          {showModal && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50'>
              <div className='bg-white p-4 rounded-lg w-[31.25rem]  relative'>
                <form onSubmit={handleSubmit}>
                  <button
                    className='absolute top-2 right-2 text-gray-600 focus:outline-none'
                    onClick={handleCloseModal}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                  <div className='font-bold text-xl flex flex-row justify-center'>
                    <p>{modalMode === 'edit' ? 'Edit Student' : modalMode === 'view' ? 'View Student' : 'Create Student'}</p>
                  </div>
                  {/* Form Fields */}
                  <div
                    className='mt-8 space-y-4 overflow-y-auto max-h-[540px] mx-6 relative'
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1', paddingRight: '10px' }}
                  >
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='registrationNumber' className='block mb-1 text-sm font-medium text-black'>
                        Registration Number
                      </label>
                      <input
                        type='text'
                        id='registrationNumber'
                        name='registrationNumber'
                        onChange={(e) => handleInputChange(e, setRegistrationNumber)}
                        value={registrationNumber}
                        pattern='[A-Za-z0-9]*' // Alphanumeric pattern
                        placeholder='BSE200000'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.registrationNumber && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.registrationNumber}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='studentName' className='block mb-1 text-sm font-medium text-black'>
                        Student Name
                      </label>
                      <input
                        type='text'
                        id='studentName'
                        name='studentName'
                        onChange={(e) => handleInputChange(e, setStudentName)}
                        value={studentName}
                        pattern='[A-Za-z\s]*' // Alphabetic pattern with space
                        placeholder='Enter Student Name'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.studentName && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.studentName}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='phoneNumber' className='block mb-1 text-sm font-medium text-black'>
                        Phone Number
                      </label>
                      <input
                        type='text'
                        id='phoneNumber'
                        name='phoneNumber'
                        onChange={(e) => handleInputChange(e, setPhoneNumber)}

                        value={phoneNumber}
                        placeholder='03XZ-YYYYYYY'
                        pattern='03[0-9]{2}-[0-9]{7}'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.phoneNumber && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='creditHours' className='block mb-1 text-sm font-medium text-black'>
                        Credit Hours
                      </label>
                      <input
                        type='text'
                        id='creditHours'
                        name='creditHours'
                        onChange={(e) => handleInputChange(e, setCreditHours)}
                        value={creditHours}
                        pattern='\d*' // Numeric pattern
                        placeholder='00'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.creditHours && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.creditHours}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='cgpa' className='block mb-1 text-sm font-medium text-black'>
                        CGPA
                      </label>
                      <input
                        type='text'
                        id='cgpa'
                        name='cgpa'
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d*$/.test(val)) {
                            handleInputChange(e, setCgpa);
                          }
                        }}
                        value={cgpa}
                        pattern='\d*\.?\d*' // Numeric with optional decimal pattern
                        placeholder='0.0'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.cgpa && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.cgpa}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='gpa' className='block mb-1 text-sm font-medium text-black'>
                        GPA
                      </label>
                      <input
                        type='text'
                        id='gpa'
                        name='gpa'
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d*$/.test(val)) {
                            handleInputChange(e, setGpa);
                          }
                        }}
                        value={gpa}
                        pattern='\d*\.?\d*' // Numeric with optional decimal pattern
                        placeholder='0.0'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.gpa && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.gpa}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        onChange={(e) => handleInputChange(e, setEmail)}
                        value={email}
                        placeholder='abc@cust.edu.pk'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.email && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.email}</p>
                      )}

                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='secondaryEmail' className='block mb-1 text-sm font-medium text-black'>
                        Secondary Email
                      </label>
                      <input
                        type='email'
                        id='secondaryEmail'
                        name='secondaryEmail'
                        onChange={(e) => handleInputChange(e, setSecondaryEmail)}
                        value={secondaryEmail}
                        placeholder='abc@gmail.com'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.secondaryEmail && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.secondaryEmail}</p>
                      )}

                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='passowrd' className='block mb-1 text-sm font-medium text-black'>
                        Password
                      </label>
                      <input
                        type='password'
                        id='password'
                        name='password'
                        onChange={(e) => handleInputChange(e, setPassword)}
                        value={password}
                        pattern='(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}' // Alphanumeric with minimum 6 characters pattern
                        placeholder='abc123'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.email && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.email}</p>
                      )}
                    </div>


                    <div className='mb-4 mt-4 relative'>
                      <label htmlFor='departmentDropdown' className=" mb-1 text-sm font-medium text-black">
                        Department
                      </label>
                      <Select
                        id='departmentDropdown'
                        name='departmentDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={DepartmentOptions}
                        isSearchable
                        onChange={handleDepartmentNameChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
                        value={selectedDepartment}
                        placeholder='Select or type a Department'
                        maxMenuHeight={100}
                        isDisabled={modalMode === 'view'}
                      />
                      {formErrors.selectedDepartment && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedDepartment}</p>
                      )}
                    </div>


                    <div className='mb-4 mt-4 relative'>
                      <label htmlFor='programDropdown' className="mb-1 text-sm font-medium text-black">
                        Program
                      </label>
                      <Select
                        id='programDropdown'
                        name='programDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={ProgramOptions}
                        isSearchable
                        onChange={handleProgramChange}
                        value={selectedProgram}
                        placeholder='Select or type a Program'
                        maxMenuHeight={100}
                        isDisabled={modalMode === 'view'}
                      />
                      {formErrors.selectedProgram && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedProgram}</p>
                      )}
                    </div>

                    <div className='mb-4 mt-4 relative'>
                      <label htmlFor='departmentDropdown' className=" mb-1 text-sm font-medium text-black">
                        Term
                      </label>
                      <Select
                        id='termDropdown'
                        name='termDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={modalMode === 'create' ? TermOptions.filter(term => term.status === 'activated') : TermOptions}
                        isSearchable
                        onChange={handleTermChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
                        value={selectedTerm}
                        placeholder='Select or type term'
                        maxMenuHeight={100}
                        isDisabled={modalMode === 'view'}
                      />
                      {formErrors.selectedTerm && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTerm}</p>
                      )}
                    </div>



                    <div className='flex flex-col mt-1'>
                      <label htmlFor='cnic' className='block mb-1 text-sm font-medium text-black'>
                        CNIC
                      </label>
                      <input
                        type='text'
                        id='cnic'
                        name='cnic'
                        onChange={(e) => handleInputChange(e, setCnic)}
                        value={cnic}
                        placeholder='XXXXX-XXXXXXX-X'
                        pattern='\d{5}-\d{7}-\d'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.cnic && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.cnic}</p>
                      )}
                    </div>

                    <div className='flex flex-col mt-1'>
                      <label htmlFor='address' className='block mb-1 text-sm font-medium text-black'>
                        Address
                      </label>
                      <input
                        type='text'
                        id='address'
                        name='address'
                        onChange={(e) => handleInputChange(e, setAddress)}
                        value={address}
                        placeholder='City--House#----'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.address && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.address}</p>
                      )}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-center mt-9">
                    {modalMode === 'view' ? (
                      null // Do not render any button when modalMode is 'view'
                    ) : selectedStudent ? (
                      <button type="submit" className="bg-primary hover:bg-slate-700 text-white font-bold py-2 px-12 mt-2 rounded">
                        Update
                      </button>
                    ) : (
                      <button type="submit" className="bg-primary hover:bg-secondary text-white font-bold py-2 px-12 mt-2 rounded">
                        Create
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}


          <div className='flex flex-row justify-end'>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">All Terms</option>
              {/* Render options based on term data */}
              {TermOptions.map(term => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>

          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className={`mt-1 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text="Created Students" accordionId={accordionId} />
            </h2>

            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`${showModal ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative h-72 overflow-y-auto">
                  <div className='bg-white text-sm'>
                    {/* <p className='text-base font-semibold ml-7 mb-4 sticky top-0'>Term: {TermForAccor}</p> */}
                    <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                      <thead className="text-xs text-indigo-900 uppercase bg-white     sticky top-0">
                        <tr className='border-b text-center'>
                          <th className='px-6 py-3'>Sr. No</th>
                          <th className='px-6 py-3'>Name</th>
                          <th className='px-6 py-3'>Email</th>
                          <th className='px-6 py-3'>Reg No</th>
                          <th className='px-6 py-3'>Department</th>
                          <th className='px-6 py-3'>Program</th>
                          <th className='px-6 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
                          filteredStudents.map((student, index) => {
                            console.log('Current Student:', student._id);
                            return (
                              <tr key={student._id} className='text-center font-normal'>
                                <td className='px-6 py-4'>{index + 1}</td>
                                <td className='px-6 py-4'>{student.name}</td>
                                <td className='px-6 py-4'>{student.email}</td>
                                <td className='px-6 py-4'>{student.registrationNumber}</td>
                                <td className='px-6 py-4'>
                                  {student.department && student.department.departmentName ? (
                                    student.department.departmentName
                                  ) : (
                                    student.department ? student.department : 'Hello'
                                  )}
                                </td>
                                <td className='px-6 py-4'>{student?.program?.programTitle}</td>
                                <td className='px-6 py-4'>
                                  <button className='underline mx-2' onClick={() => handleEditStudent(student)}>Edit</button>
                                  <button className='underline mx-2' onClick={() => handleViewStudent(student)}>View</button>
                                  <button className='underline mx-2' onClick={() => deleteStudentData(student?._id)}>Dismiss</button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan='6' className='text-center py-4'>No Student Found</td>
                          </tr>
                        )}





                        {/* {filteredStudents.map((student, index) => {
    console.log('Current Student:', student._id); 
    
    return (
      <tr key={student._id} className='text-center font-normal'>
        <td className='px-6 py-4'>{index + 1}</td>
        <td className='px-6 py-4'>{student.name}</td>
        <td className='px-6 py-4'>{student.email}</td>
        <td className='px-6 py-4'>{student.registrationNumber}</td>
        <td className='px-6 py-4'>{student.phoneNumber}</td>
        
         <td className='px-6 py-4'>
  {student.department && student.department.departmentName ? (
    
    student.department.departmentName
  ) : (
    student.department ? student.department: 'Hello'
    
  )}
</td>
        <td className='px-6 py-4'>
          <button className='underline mx-2' onClick={() => handleEditStudent(student)}>Edit</button>
          <button className='underline mx-2' onClick={() => handleViewStudent(student)}>View</button>
          <button className='underline mx-2' onClick={() => deleteStudentData(student._id)}>Dismiss</button>
        </td>
      </tr>
    );
  })} */}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 mb-2 ml-6 flex flex-row justify-end'>
            <Simple text={'Import'} onClick={importStudent} />
          </div>

        </div>
      )}
    </>
  );
};

export default AdmCreateStudent;
