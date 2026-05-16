import React from 'react'
import { useState, useEffect } from 'react';
import Select from 'react-select';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Simple from '../../../Components/Buttons/Simple';

import { departmentAndPrograms } from '../AdmStudentCreate/ProgramData';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import SuccessMessage from '../../../Components/ConfirmationMessages/SuccessMessage';



const AdmFacultyCreate = ({ accordionId }) => {

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [faculties, setFaculties] = useState('create');
  const [facultyId, setFacultyId] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  // const [selectedTerm, setSelectedTerm] = useState(null);
  const [extension, setExtension] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [password, setPassword] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  // const [TermForAccor, setTermForAccor] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [ProgramOptions, setProgramOptions] = useState([]);
  // const [TermOptions, setTermOptions] = useState([]);
  const [DepartmentOptions, setDepartmentOptions] = useState([]);
  const [loadingSpinner, setloadingSpinner] = useState(false);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  // const [selectedTerm, setSelectedTerm] = useState('');

  const DesignationOptions = [
    { value: 'Professor', label: 'Professor' },
    { value: 'Assistant Professor', label: 'Assistant Professor' },
    { value: 'Senior Lecturer', label: 'Senior Lecturer' },
    { value: 'Lecturer', label: 'Lecturer' },
    { value: 'Associate Lecturer', label: 'Associate Lecturer' },
  ];

  const RoleOptions = [
    { value: 'hod', label: 'hod' },
    { value: 'coordinator', label: 'coordinator' },
    { value: 'faculty', label: 'faculty' },
  ];


  // console.log("Checking filtered faculties", filteredFaculties[1].term.session);

  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      Navigate('/login');
    }

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'AdmFacultyCreate';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);


  useEffect(() => {
    fetchProgramNames();
  }, []);
  useEffect(() => {
    fetchDepartmentData();
  }, []);

  // useEffect(() => {
  //   fetchFYPTerms();
  // }, []); 

  useEffect(() => {
    fetchFacultyData();
  }, []);

  // console.log("selected Term check", selectedTerm);

  // console.log("Checking Faculty Data ", faculties)

  const handleNumericInput = (e, fieldName) => {
    const value = e.target.value;
    if (/[^0-9-]/.test(value)) {
      e.target.value = value.replace(/[^0-9-]/g, '');
      alert(`Please enter only numeric values and dashes for ${fieldName}`);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };


  const handleSelectChange = (selectedOption, setter, name) => {
    setter(selectedOption);
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };


  const importFaculty = () => {
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
        const response = await fetch('/api/excelUser/uploadFacultySheet', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse response JSON
          let errorMessage = errorData.message || 'Failed to upload file';

          if (errorData.errors) {
            for (const [field, message] of Object.entries(errorData.errors)) {
              errorMessage += `\n${field}: ${message}`;
            }
          }

          throw new Error(errorMessage);
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


  // const filterFacultiesByTerm = () => {
  //   if (!selectedTerm) {
  //     setTermForAccor('All');
  //     setFilteredFaculties([...faculties]); // If no term selected, show all faculties
  //     console.log("Checking filtered faculties". filteredFaculties);
  //   } else {
  //     const filtered = faculties.filter(faculty => {

  //       if (faculty.term._id === selectedTerm) {
  //         setTermForAccor(faculty.term.sessionTerm);
  //       }
  //       return faculty.term._id === selectedTerm;
  //     });
  //     console.log("Check filtered faculties", filtered);
  //     setFilteredFaculties(filtered);
  //   }
  // };

  // useEffect(() => {
  //   filterFacultiesByTerm();
  // }, [selectedTerm, faculties]);

  // {filteredFaculties && (
  //  console.log("Faculty after updation ", filteredFaculties)
  // )}
  const fetchProgramOfSelDep = async (depId) => {
    try {
      setloadingSpinner(true);
      console.log("DepartiDdddddddddddddddddddd", depId);
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
      console.log("Inside Programssssssssssssssssssssss");

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



      console.log("Request Sentttttttt");

      if (response.ok) {
        console.log("Inside Fetch Program 1");
        const data = await response.json();
        console.log("Data program array", data.programs);
        console.log("Data program array checking id", data.programs[0]._id);
        console.log("Data Department array checking id", data.programs[0].department._id);

        // Assuming data.programs is an array of program objects
        const programs = data.programs.map(program => ({

          value: program._id,
          label: program.programTitle,
          departmentId: program.department._id,
          // departmentName: program.department.departmentName,
          // termId: program.term._id,
        }));


        console.log("Checking Fetched Program Namesssssssssssssssssss", programs);
        // console.log("Program Options ", programs);
        // Set departmentOptions from the fetched programs
        // const departmentOptions = data.programs.map(program => ({
        //   value: program.department._id, // Assuming department has an _id field
        //   label: program.department.departmentName, // Assuming department has a departmentName field
        //   // termId: program.term._id,
        // }));

        // console.log("Checking Fetched DepartmentOptions", departmentOptions );

        // Set departmentData from the fetched programs
        const departmentData = [...new Set(programs.map(program => program.departmentId))];

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


  // const fetchFYPTerms = async () => {
  //   try {
  //     // Update API endpoint for fetching FYP terms
  //     const nkey = localStorage.getItem('key');
  //     const token = JSON.parse(nkey);
  //     const apiUrl = '/api/auth/getTermdata';

  //     const response = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       console.log("Inside Fetch FYP Terms 1");
  //       const data = await response.json();
  //       console.log("Fetch FYP terms data", data);


  //       // Assuming data.fypTerms is an array of FYP term objects
  //       const fypTerms = data.fypTerms.map(term => ({
  //         value: term._id,
  //         label: term.sessionTerm,
  //         startDate: term.startDate,
  //         endDate: term.endDate,
  //         isActive: term.isActive, // Assuming each term object has an isActive boolean property
  //       }));

  //       // Sort terms based on activation status (active terms first)
  //       fypTerms.sort((a, b) => {
  //         if (a.isActive && !b.isActive) return -1; // 'a' comes before 'b' if 'a' is active and 'b' is inactive
  //         if (!a.isActive && b.isActive) return 1; // 'b' comes before 'a' if 'b' is active and 'a' is inactive
  //         return 0; // no change in order if both are active or inactive
  //       });

  //       // Set fypTermOptions from the sorted FYP terms
  //       const fypTermOptions = fypTerms.map(term => ({
  //         value: term.value,
  //         label: term.label,
  //         startDate: term.startDate,
  //         endDate: term.endDate,
  //       }));

  //       console.log("Inside Fetch FYP Terms 3", fypTermOptions);

  //       // Set TermOptions with activated terms on top
  //       setTermOptions(fypTermOptions);
  //       console.log("Checking term options in create faculty", TermOptions);
  //     } else {
  //       console.log('Failed to fetch FYP terms');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching FYP terms:', error);
  //   }
  // };

  // console.log("FYP terms", fypTerms);

  const handleCreateFaculty = async () => {

    console.log("Handle Create Faculty Called");
    // setFormErrors('');
    formErrors.facultyId = '';
    formErrors.facultyName = '';
    try {

      setloadingSpinner(true);
      if (!validateForm()) {
        console.log('Form has validation errors. Please fix them.');
        alert('Please fill in all required fields correctly.');
        return;
      }
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userExistsResponse = await fetch('/api/auth/checkUserExistence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email, // Assuming email is unique for users
          role: selectedRole.label,
        }),
      });
      console.log("emaillllllll", email);
      console.log("roleeeeeeeeeeeeeeeeeeeee", selectedRole.label);
      console.log("userExistssssResponse", userExistsResponse);

      if (!userExistsResponse.ok) {
        console.log('Failed to check user existence');
        alert('Failed to check user existence. Please try again.');
        return;
      }

      const { exists } = await userExistsResponse.json();

      if (exists) {
        // User already exists, show alert
        alert('User with this email already exists!');
        // Show alert to the user that the user already exists
        // Example: setShowAlert(true);
        return;
      }
      console.log("Else Part Called before Sendinggggg Req");

      const apiUrl = '/api/auth/usercreation'; // Update API endpoint for faculty
      // const nkey = localStorage.getItem('key');
      // const token = JSON.parse(nkey);

      console.log('Sending faculty creation request with the following data:');
      // console.log('Faculty ID:', facultyId);
      // console.log('Name:', facultyName);
      // console.log('Phone Number:', phoneNumber);
      // console.log('Designation:', selectedDesignation.label);
      // console.log('Department ID:', selectedDepartment.value);
      // console.log('Email:', email);
      // console.log('Secondary Email:', secondaryEmail);
      // console.log('Role:', selectedRole.label);
      // console.log('Password:', password);
      // console.log('Program ID:', selectedProgram.value);
      // console.log('Extension:', extension);
      // console.log('Date of Birth:', dob);
      // console.log('Joining Date:', joiningDate);
      // console.log('CNIC:', cnic);
      // console.log('Address:', address);



      const requestBody = {

        name: facultyName,
        role: selectedRole.label,
      };

      console.log("Selectedddddddddddd Roleeeeeeeeeeeeeeeee", selectedRole.label);

      // Add additional fields that are always included
      requestBody.phoneNumber = phoneNumber;
      requestBody.designation = selectedDesignation.label;
      requestBody.department = selectedDepartment.value;
      requestBody.program = selectedProgram ? selectedProgram.value : undefined;
      requestBody.email = email;
      requestBody.password = password;
      requestBody.extension = extension;
      requestBody.dateOfBirth = dob;
      requestBody.secondaryEmail = secondaryEmail;
      requestBody.joiningDate = joiningDate;
      requestBody.cnic = cnic;
      requestBody.address = address;
      requestBody.facultyId = facultyId;

      console.log("Request Bodydyyyyy", requestBody);

      // Send the request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Request Sentttttttttttttttt for Cereation of CS COordinaotr");

      if (response.ok) {
        console.log('Faculty created successfully');
        clearForm(); // Clear the form fields after successful creation
        setShowModal(false); // Close the modal after successful creation
        const responseData = await response.json();
        console.log('Checking response faculty id', responseData.user._id);
        const newFacultyId = responseData.user._id;

        const newFaculty = {
          _id: newFacultyId, // Use actual ID returned by the server
          facultyId, // Assuming facultyId is used for registration number
          name: facultyName,
          phoneNumber,
          designation: selectedDesignation.label,
          department: {
            _id: selectedDepartment.value, // Assuming you have department ID
            departmentName: selectedDepartment.label, // Assuming you have department name
          },
          program: selectedProgram ? {
            _id: selectedProgram.value,
            programTitle: selectedProgram.label,
          } : undefined,
          // term: {
          //   _id: selectedTerm.value,
          //   sessionTerm: selectedTerm.label,
          // },
          extension,
          dateOfBirth: dob,
          email,
          secondaryEmail,
          password,
          joiningDate,
          cnic,
          address,
          role: selectedRole.label // Assuming this is a faculty registration
          // Other fields as needed based on your model
        };
        // setFaculties([newFaculty, ...faculties]); 
        setFilteredFaculties([newFaculty, ...faculties]);
        setConfirmationMessage('Faculty Created Successfully');
        setShowConfirmation(true);
        window.location.reload();
        console.log("Faculty", faculties)

      } else {
        console.log('Failed to create faculty');
        const errorData = await response.json();
        alert(`Failed to create faculty: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating faculty:', error);
      alert(`Error creating faculty: ${error.message}`);
    } finally {
      setloadingSpinner(false);
    }
  };

  const fetchFacultyData = async () => {
    try {
      setloadingSpinner(true);

      const apiUrl = '/api/auth/fetchFacultyData'; // Update API endpoint for fetching faculties
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Fetched faculties:', responseData.faculties);
        // Assuming the response contains an array of faculties
        setFaculties(responseData.faculties); // Update the faculties state with fetched data
        console.log("Checking faculties data in create faculty", responseData);
      } else {
        console.log('Failed to fetch faculties');
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setloadingSpinner(false);
    }
  };


  const updateFaculty = async (
    facId,
    facultyId,
    updFacultyName,
    updRole,
    updPhoneNumber,
    updDesignation,
    updSelectedProgram,
    updSelectedDepartment,
    // updSelectedTerm,
    updExtension,
    updDateOfBirth,
    updEmail,
    updsecondaryEmail,
    updPassword,
    updJoiningDate,
    updCnic,
    updAddress,


  ) => {
    try {

      console.log('Faculty extracted ID:', facId);
      console.log('Faculty ID:', facultyId);
      console.log('Faculty Name:', updFacultyName);
      console.log('Faculty Role:', updRole);
      console.log('Phone Number:', updPhoneNumber);
      console.log('Designation:', updDesignation);
      console.log('Department:', updSelectedProgram);
      console.log('Program:', updSelectedDepartment);
      // console.log('Term:', updSelectedTerm);
      console.log('Extension:', updExtension);
      console.log('Date of Birth:', updDateOfBirth);
      console.log('Email:', updEmail);
      console.log('Secondary Email:', updsecondaryEmail);
      console.log('pass:', updPassword);
      console.log('Joining Date:', updJoiningDate);
      console.log('CNIC:', updCnic);

      setloadingSpinner(true);
      const apiUrl = '/api/auth/updateFacultyData'; // Update API endpoint for faculty update
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facId,
          facultyId: facultyId,
          name: updFacultyName,
          role: updRole.value,
          phoneNumber: updPhoneNumber,
          designation: updDesignation.value,
          department: updSelectedDepartment ? updSelectedDepartment.value : null, // Ensure null check
          program: updSelectedProgram ? updSelectedProgram.value : null,
          // term: updSelectedTerm.value,
          extension: updExtension,
          dateOfBirth: updDateOfBirth,
          joiningDate: updJoiningDate,
          email: updEmail,
          secondaryEmail: updsecondaryEmail,
          password: updPassword,
          cnic: updCnic,
          address: updAddress,
        }),
      });
      console.log("Request Senttttttttttttttttttttttt for Updationnnnnnnn");

      if (response.ok) {
        // Handle successful update
        console.log('Faculty updated successfully');
        clearForm(); // Clear form fields after update if needed
        setShowModal(false);
        window.location.reload();
        // Perform any other actions upon successful update


        const updatedFaculty = faculties.map((item) => {
          if (item._id === facId) {
            console.log("yes i am inside updated faculty if condition");
            return {
              ...item,
              facultyId: facultyId,
              name: updFacultyName,
              role: updRole.label,
              phoneNumber: updPhoneNumber,
              designation: updDesignation.value,
              program: updSelectedProgram.value,
              department: updSelectedDepartment.label,
              // term: updSelectedTerm.value,
              extension: updExtension,
              dateOfBirth: updDateOfBirth,
              joiningDate: updJoiningDate,
              email: updEmail,
              secondaryEmail: updsecondaryEmail,
              password: updPassword,
              cnic: updCnic,
              address: updAddress,
            };
          }
          return item;
        });

        console.log("Runtime updated", updatedFaculty);
        setFaculties(updatedFaculty);
        // setFilteredFaculties(updatedFaculty);
        setConfirmationMessage('Faculty Updated Successfully');
        setShowConfirmation(true);
        window.location.reload();

      } else {
        // Handle update failure
        console.log('Failed to update faculty');
        // You may want to show an error message or perform other actions upon update failure
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      // Handle network errors or other errors
    } finally {
      setloadingSpinner(false);
    }
  };

  const handleEditFaculty = (faculty) => {
    console.log("Checking faculty program._id", faculty);

    // Set common fields
    setSelectedFaculty(faculty._id); // Assuming setSelectedFaculty is a state setter for faculty ID
    setFacultyName(faculty.name);
    setPhoneNumber(faculty.phoneNumber);
    setDesignation(faculty.designation); // Assuming designation is a state variable for faculty designation
    if (faculty.program && faculty.program._id) {
      setSelectedProgram({ value: faculty.program._id, label: faculty.program.programTitle });
    }
    if (faculty.department && faculty.department._id) {
      setSelectedDepartment({ value: faculty.department._id, label: faculty.department.departmentName });
    }
    setSelectedRole({ value: faculty.role, label: faculty.role });
    setSelectedDesignation({ value: faculty.designation, label: faculty.designation });
    setExtension(faculty.extension);
    setEmail(faculty.email);
    setCnic(faculty.cnic);
    setAddress(faculty.address);

    // Check role and conditionally set fields
    const isHodOrCoordinator = faculty.role === 'hod' || faculty.role === 'coordinator';

    if (!isHodOrCoordinator) {
      setFacultyId(faculty.facultyId); // Assuming facultyId is a state variable for faculty ID
      const dobDate = faculty.dateOfBirth ? faculty.dateOfBirth.substring(0, 10) : '';
      setDob(dobDate);
      setSecondaryEmail(faculty.secondaryEmail);
      const joining = faculty.joiningDate ? faculty.joiningDate.substring(0, 10) : '';
      setJoiningDate(joining);
    } else {
      // Clear the fields not required for hod or coordinator
      setFacultyId('');
      setDob('');
      setSecondaryEmail('');
      setJoiningDate('');
    }

    setShowModal(true);
    setModalMode('edit');
  };


  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty); // Assuming setSelectedFaculty is a state setter for faculty ID
    setFacultyId(faculty.facultyId); // Assuming facultyId is a state variable for faculty ID
    setFacultyName(faculty.name);
    setPhoneNumber(faculty.phoneNumber);

    setSelectedProgram({ value: faculty.program._id, label: faculty.program.programTitle });
    setSelectedDepartment({ value: faculty.department._id, label: faculty.department.departmentName });
    // setSelectedTerm({ value: faculty.term._id, label: faculty.term.sessionTerm });
    setSelectedRole({ value: faculty.role, label: faculty.role });
    setSelectedDesignation({ value: faculty.designation, label: faculty.designation });
    console.log("Check role id", faculty.role);
    console.log("Check role label", faculty.role);
    setExtension(faculty.extension);
    const dobDate = faculty.dateOfBirth.substring(0, 10);
    setDob(dobDate);
    setEmail(faculty.email);
    setSecondaryEmail(faculty.secondaryEmail);
    setPassword(faculty.password);
    const joining = faculty.joiningDate.substring(0, 10);

    setJoiningDate(joining);
    setCnic(faculty.cnic);
    setAddress(faculty.address);
    setShowModal(true);
    setModalMode('view');
  }

  // const handleViewFaculty = (faculty) => {
  //   setSelectedFaculty(faculty); // Set selected faculty in state
  //   setShowModal(true); // Show the modal
  //   setModalMode('view'); // Set the mode to 'view' to display data without editing
  // };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };


  const deleteFaculty = async (facId) => {
    console.log("Delete faculty ", facId);
    console.log("Inside Delete Faculty ");
    try {
      setloadingSpinner(true);
      const apiUrl = '/api/auth/deleteFacultyData'; // Update API endpoint for deleting faculty
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ facId }), // Pass facultyId in the request body
      });

      if (response.ok) {
        // Handle successful deletion
        console.log('Faculty deleted successfully');
        const updatedFaculties = faculties.filter(item => item._id !== facId);
        console.log("Checking updated deleted", updatedFaculties);
        setFilteredFaculties(updatedFaculties);
        setFaculties(updatedFaculties);
        setConfirmationMessage('Faculty Deleted Successfully');
        setShowConfirmation(true);

        // Perform any other actions you need after successful deletion
      } else {
        // Handle delete failure
        console.log('Failed to delete faculty');
        // You may want to show an error message or perform other actions upon deletion failure
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      // Handle network errors or other errors
    } finally {
      setloadingSpinner(false);
      console.log("Spinner", loadingSpinner);
      console.log("Finally of Delete Faculty");
    }
  };

  const clearForm = () => {
    setFacultyId(''); // Assuming facultyId is a state variable for faculty ID
    setFacultyName('');
    setPhoneNumber('');
    setSelectedDesignation('');
    setSelectedDepartment('');
    setSelectedProgram('');
    // setSelectedTerm('');
    setExtension('');
    setDob('');
    setEmail('');
    setSecondaryEmail('');
    setPassword('');
    setJoiningDate('');
    setCnic('');
    setSelectedRole('');
    setAddress('');
    setModalMode('create');
  };


  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState(value);

    // Clear the corresponding error when the user types
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // const handleInputChange = (e, setter) => {
  //   setter(e.target.value);
  // };

  const handleDepartmentChange = async (selectedOption) => {
    setSelectedDepartment(selectedOption);
    await fetchProgramOfSelDep(selectedOption.value);

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      selectedDepartment: '',

    }));

  };

  const handleProgramChange = (selectedOption) => {
    setSelectedProgram(selectedOption);
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleDesignationChange = (selectedOption) => {
    console.log("Inside handle Designation change", selectedOption)
    setSelectedDesignation(selectedOption);
  };

  // const handleTermChange = (selectedOption) => {

  //   setSelectedTerm(selectedOption);
  // };

  const [formErrors, setFormErrors] = useState({
    facultyId: '',
    facultyName: '',
    selectedRole: '',
    phoneNumber: '',
    selectedDesignation: '',
    selectedDepartment: '',
    selectedProgram: '',
    term: '',
    extension: '',
    dob: '',
    email: '',
    secondaryEmail: '',
    password: '',
    joiningDate: '',
    cnic: '',
    address: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      facultyId: '',
      facultyName: '',
      selectedRole: '',
      phoneNumber: '',
      selectedDesignation: '',
      selectedDepartment: '',
      selectedProgram: '',
      term: '',
      extension: '',
      dob: '',
      email: '',
      secondaryEmail: '',
      password: '',
      joiningDate: '',
      cnic: '',
      address: '',
    };

    console.log("Checking Selected Roleeeeeeeeeeeeeeeeeeee", selectedRole);
    // Check if role is hod or coordinator
    const isHodOrCoordinator = selectedRole.label === 'hod' || selectedRole.label === 'coordinator' || selectedRole.label === 'Coordinator' || selectedRole.label === 'HoD';
    console.log("isHoDCoordinator", isHodOrCoordinator);
    // Perform your validation logic here
    // Faculty ID is not required for hod or coordinator
    if (!isHodOrCoordinator && !facultyId) {
      isValid = false;
      errors.facultyId = 'Please enter faculty ID.';
    }
    // Faculty name is required for all roles
    if (!facultyName) {
      isValid = false;
      errors.facultyName = 'Please enter faculty name.';
    }
    // Role is required for all roles
    if (!selectedRole) {
      isValid = false;
      errors.selectedRole = 'Please enter or select Role.';
    }
    // Phone number is required for all roles
    if (!phoneNumber) {
      isValid = false;
      errors.phoneNumber = 'Please enter phone number.';
    }
    // Designation is required for all roles
    if (!selectedDesignation) {
      isValid = false;
      errors.selectedDesignation = 'Please enter designation.';
    }
    // Program is not required for hod or coordinator
    if (!isHodOrCoordinator && !selectedProgram) {
      isValid = false;
      errors.selectedProgram = 'Please select or enter program.';
    }
    // Department is required for all roles
    if (!selectedDepartment) {
      isValid = false;
      errors.selectedDepartment = 'Please select or enter department.';
    }
    // Extension is required for all roles
    // if (!extension) {
    //     isValid = false;
    //     errors.extension = 'Please enter extension.';
    // }
    // Date of birth is not required for hod or coordinator
    // if (!isHodOrCoordinator && !dob) {
    //     isValid = false;
    //     errors.dob = 'Please enter date of birth.';
    // }
    // Email is required for all roles
    if (!email) {
      isValid = false;
      errors.email = 'Please enter email.';
    }
    // Secondary email is not required for hod or coordinator
    if (!isHodOrCoordinator && !secondaryEmail) {
      isValid = false;
      errors.secondaryEmail = 'Please enter secondary email.';
    }
    // Password is required for all roles
    if (!password) {
      isValid = false;
      errors.password = 'Please enter password.';
    }
    // Joining date is not required for hod or coordinator
    // if (!isHodOrCoordinator && !joiningDate) {
    //     isValid = false;
    //     errors.joiningDate = 'Please enter joining date.';
    // }
    // CNIC is required for all roles
    // if (!cnic) {
    //     isValid = false;
    //     errors.cnic = 'Please enter CNIC.';
    // }
    // Address is required for all roles
    // if (!address) {
    //     isValid = false;
    //     errors.address = 'Please enter address.';
    // }

    // Set form errors and return the validation status
    setFormErrors(errors);

    return isValid;
  };


  const handleSubmit = (e) => {
    console.log('Handle Submit Called in Faculty Creation');
    e.preventDefault();
    setFormErrors({
      facultyId: '',
      facultyName: '',
      selectedRole: '',
      phoneNumber: '',
      selectedDesignation: '',
      selectedDepartment: '',
      selectedProgram: '',
      term: '',
      extension: '',
      dob: '',
      email: '',
      secondaryEmail: '',
      password: '',
      joiningDate: '',
      cnic: '',
      address: '',
    });
    // console.log('Faculty ID:', facultyId); // Assuming registrationNumber is used for faculty ID
    // console.log('Faculty Name:', facultyName); // Assuming facultyName is the name of the faculty member
    // console.log('Faculty Role:', selectedRole.label); 
    // console.log('Phone Number:', phoneNumber);
    // console.log('Designation:', selectedDesignation.value);
    // console.log('Department:', selectedDepartment.value);
    // console.log('Program:', selectedProgram.value);
    // console.log('Term:', selectedTerm.value);
    // console.log('Extension:', extension);
    // console.log('Date of Birth:', dob);
    // console.log('Email:', email);
    // console.log('Joining Date:', joiningDate);
    // console.log('CNIC:', cnic);

    if (selectedFaculty) {
      setFormErrors({
        facultyId: '',
        facultyName: '',
        selectedRole: '',
        phoneNumber: '',
        selectedDesignation: '',
        selectedDepartment: '',
        selectedProgram: '',
        term: '',
        extension: '',
        dob: '',
        email: '',
        secondaryEmail: '',
        password: '',
        joiningDate: '',
        cnic: '',
        address: '',
      });
      const facId = selectedFaculty; // Assuming selectedFaculty holds the faculty ID
      console.log('Faculty id inside selected faculty:', facId);
      updateFaculty(
        facId,
        facultyId,
        facultyName,
        selectedRole,
        phoneNumber,
        selectedDesignation,
        selectedProgram,
        selectedDepartment,
        // selectedTerm,
        extension,
        dob,
        email,
        secondaryEmail,
        password,
        joiningDate,
        cnic,
        address
      );
    } else {
      setFormErrors({
        facultyId: '',
        facultyName: '',
        selectedRole: '',
        phoneNumber: '',
        selectedDesignation: '',
        selectedDepartment: '',
        selectedProgram: '',
        term: '',
        extension: '',
        dob: '',
        email: '',
        secondaryEmail: '',
        password: '',
        joiningDate: '',
        cnic: '',
        address: '',
      });
      console.log('Handle submit else part called');
      handleCreateFaculty();
    }
  };

  const handleCloseModal = () => {
    console.log('This function called hanlde close modal');
    setShowModal(false); // Close the modal
    // You may perform additional actions here like refetching data or resetting filters
    setFilteredFaculties(faculties); // Reset filtered faculties to show all faculties
  };





  return (
    <>
      {loadingSpinner ? (
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
              <p className='font-semibold text-white text-xl ml-6 pt-4'>Faculty</p>
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
                    <p>{modalMode === 'edit' ? 'Edit Faculty' : modalMode === 'view' ? 'View Faculty' : 'Create Faculty'}</p>
                  </div>
                  {/* Form Fields */}
                  <div
                    className='mt-8 space-y-4 overflow-y-auto max-h-[540px] mx-6 relative'
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1', paddingRight: '10px' }}
                  >
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='facultyId' className='block mb-1 text-sm font-medium text-black'>
                        Faculty ID
                      </label>
                      <input
                        type='text'
                        id='facultyId'
                        name='facultyId'
                        placeholder='Enter Faculty ID'
                        pattern='\d*'
                        onChange={(e) => handleInputChange(e, setFacultyId)}
                        onInput={(e) => handleNumericInput(e, 'Faculty ID')}
                        value={facultyId}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.facultyId && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.facultyId}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='facultyName' className='block mb-1 text-sm font-medium text-black'>
                        Faculty Name
                      </label>
                      <input
                        type='text'
                        id='facultyName'
                        name='facultyName'
                        placeholder='Enter Faculty Name'
                        onChange={(e) => handleInputChange(e, setFacultyName)}
                        value={facultyName}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.facultyName && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.facultyName}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='roleDropdown' className='mb-1 text-sm font-medium text-black'>
                        Role
                      </label>
                      <Select
                        id='roleDropdown'
                        name='roleDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={RoleOptions}
                        isSearchable
                        // onChange={handleRoleChange}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, setSelectedRole, 'selectedRole')}
                        value={selectedRole} // Use selectedRole directly as the value
                        placeholder='Select or type Role'
                        maxMenuHeight={100}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.selectedRole && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedRole}</p>
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
                        placeholder='03XZ-YYYYYYY'
                        pattern='03[0-9]{2}-[0-9]{7}'
                        onChange={(e) => handleInputChange(e, setPhoneNumber)}
                        onInput={(e) => handleNumericInput(e, 'Phone Number')}
                        value={phoneNumber}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.phoneNumber && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.phoneNumber}</p>
                      )}
                    </div>

                    <div className='flex flex-col mt-1'>
                      <label htmlFor='designationDropdown' className='mb-1 text-sm font-medium text-black'>
                        Designation
                      </label>
                      <Select
                        id='designationDropdown'
                        name='designationDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={DesignationOptions}
                        isSearchable
                        // onChange={handleDesignationChange}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, setSelectedDesignation, 'selectedDesignation')}
                        value={selectedDesignation} // Use selectedDesignation directly as the value
                        placeholder='Select or type a Designation'
                        maxMenuHeight={100}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.selectedDesignation && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedDesignation}</p>
                      )}
                    </div>

                    <div className='flex flex-col mt-1'>
                      <label htmlFor='departmentDropdown' className='mb-1 text-sm font-medium text-black'>
                        Department
                      </label>
                      <Select
                        id='departmentDropdown'
                        name='departmentDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={DepartmentOptions}
                        isSearchable
                        onChange={handleDepartmentChange}
                        // onChange={(selectedOption) => handleSelectChange(selectedOption, setSelectedDepartment, 'selectedDepartment')}
                        value={selectedDepartment}
                        placeholder='Select or type a Department'
                        maxMenuHeight={100}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.selectedDepartment && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedDepartment}</p>
                      )}
                    </div>

                    <div className='flex flex-col mt-1'>
                      <label htmlFor='programDropdown' className='mb-1 text-sm font-medium text-black'>
                        Program
                      </label>
                      <Select
                        id='programDropdown'
                        name='programDropdown'
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        options={ProgramOptions}
                        isSearchable
                        // onChange={handleProgramChange}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, setSelectedProgram, 'selectedProgram')}
                        value={selectedProgram}
                        placeholder='Select or type a Program'
                        maxMenuHeight={100}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.selectedProgram && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedProgram}</p>
                      )}
                    </div>

                    {/* <div className='flex flex-col mt-1'>
      <label htmlFor='termDropdown' className='mb-1 text-sm font-medium text-black'>
        Term
      </label>
      <Select
        id='termDropdown'
        name='termDropdown'
        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
        options={TermOptions}
        isSearchable
        onChange={handleTermChange}
        // value={selectedTerm}
        placeholder='Select or type term'
        maxMenuHeight={100}
        isDisabled={modalMode === 'view'}
      />
      {formErrors.selectedTerm && (
        <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTerm}</p>
      )}
    </div> */}
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='extension' className='block mb-1 text-sm font-medium text-black'>
                        Extension
                      </label>
                      <input
                        type='text'
                        id='extension'
                        name='extension'
                        placeholder='Enter Extension'
                        pattern='\d*'
                        onChange={(e) => handleInputChange(e, setExtension)}
                        onInput={(e) => handleNumericInput(e, 'Extension')}
                        value={extension}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.extension && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.extension}</p>
                      )}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='dob' className='block mb-1 text-sm font-medium text-black'>
                        Date of Birth
                      </label>
                      <input
                        type='date'
                        id='dob'
                        name='dob'
                        max={getCurrentDate()} // Set maximum date to current date
                        onChange={(e) => handleInputChange(e, setDob)}
                        value={dob}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.dob && <p className='text-red-500 text-sm mt-1'>{formErrors.dob}</p>}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='email' className='block mb-1 text-sm font-medium text-black'>
                        Email
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter Email'
                        onChange={(e) => handleInputChange(e, setEmail)}
                        value={email}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.email && <p className='text-red-500 text-sm mt-1'>{formErrors.email}</p>}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='secondaryEmail' className='block mb-1 text-sm font-medium text-black'>
                        Secondary Email
                      </label>
                      <input
                        type='email'
                        id='secondaryEmail'
                        name='secondaryEmail'
                        placeholder='Enter Secondary Email'
                        onChange={(e) => handleInputChange(e, setSecondaryEmail)}
                        value={secondaryEmail}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.secondaryEmail && <p className='text-red-500 text-sm mt-1'>{formErrors.secondaryEmail}</p>}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='password' className='block mb-1 text-sm font-medium text-black'>
                        Password
                      </label>
                      <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        pattern='(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}'
                        onChange={(e) => handleInputChange(e, setPassword)}
                        value={password}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.password && <p className='text-red-500 text-sm mt-1'>{formErrors.password}</p>}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='joiningDate' className='block mb-1 text-sm font-medium text-black'>
                        Joining Date
                      </label>
                      <input
                        type='date'
                        id='joiningDate'
                        name='joiningDate'
                        max={getCurrentDate()} // Set maximum date to current date
                        onChange={(e) => handleInputChange(e, setJoiningDate)}
                        value={joiningDate}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.joiningDate && (
                        <p className='text-red-500 text-sm mt-1'>{formErrors.joiningDate}</p>
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
                        placeholder='XXXXX-XXXXXXX-X'
                        pattern='\d{5}-\d{7}-\d'
                        onChange={(e) => handleInputChange(e, setCnic)}
                        onInput={(e) => handleNumericInput(e, 'CNIC')}
                        value={cnic}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.cnic && <p className='text-red-500 text-sm mt-1'>{formErrors.cnic}</p>}
                    </div>
                    <div className='flex flex-col mt-1'>
                      <label htmlFor='address' className='block mb-1 text-sm font-medium text-black'>
                        Address
                      </label>
                      <input
                        type='text'
                        id='address'
                        name='address'
                        placeholder='Enter Address'
                        onChange={(e) => handleInputChange(e, setAddress)}
                        value={address}
                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                        disabled={modalMode === 'view'}
                      />
                      {formErrors.address && <p className='text-red-500 text-sm mt-1'>{formErrors.address}</p>}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className='flex justify-center mt-9'>
                    {modalMode === 'edit' ? (
                      <button
                        type='submit'
                        className='bg-primary hover:bg-slate-700 text-white font-bold py-2 px-12 mt-2 rounded'
                      >
                        Update
                      </button>
                    ) : modalMode !== 'view' && (
                      <button
                        type='submit'
                        className='bg-primary hover:bg-secondary text-white font-bold py-2 px-12 mt-2 rounded'
                      >
                        Create
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 
<div className='flex flex-row justify-end'>
                      <select
        value={selectedTerm}
        onChange={e => setSelectedTerm(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 "
      >
        <option value="">All Terms</option>
  
        {TermOptions.map(term => (
          <option key={term.value} value={term.value}>
            {term.label}
          </option>
        ))}
      </select>
                      </div> */}





          <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-1 ${showModal ? 'pointer-events-none opacity-0' : ''}`}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text='Created Faculties' accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`${showModal ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                {/* Faculty Table */}
                <div className='table-container overflow-x-auto relative h-72 overflow-y-auto'>
                  <div className='bg-white text-sm'>
                    {/* <p className='text-base font-semibold ml-7 mb-4'>Term: {TermForAccor}</p> */}
                    <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                      <thead className='text-xs text-indigo-900 uppercase bg-white     sticky top-0'>
                        <tr className='border-b text-center'>
                          <th className='px-6 py-3'>Sr. No</th>
                          <th className='px-6 py-3'>Name</th>
                          <th className='px-6 py-3'>Email</th>
                          <th className='px-6 py-3'>Role</th>
                          <th className='px-6 py-3'>CNIC</th>
                          <th className='px-6 py-3'>Designation</th>
                          <th className='px-6 py-3'>Department</th>
                          <th className='px-6 py-3'>Program</th>
                          <th className='px-6 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {faculties.map((faculty, index) => (
                        <tr key={faculty._id} className='text-center font-normal'>
                          <td className='px-6 py-4'>{index + 1}</td>
                          <td className='px-6 py-4'>{faculty.name}</td>
                          <td className='px-6 py-4'>{faculty.email}</td>
                          <td className='px-6 py-4'>{faculty.phoneNumber}</td>
                          <td className='px-6 py-4'>{faculty.role}</td>
                         
                          <td className='px-6 py-4'>{faculty.cnic}</td>
                          <td className='px-6 py-4'>{faculty.designation}</td>
                          <td className='px-6 py-4'>{faculty.department.departmentName}</td>
                          <td className='px-6 py-4'>
                            <button className='underline mx-2' onClick={() => handleEditFaculty(faculty)}>
                              Edit
                            </button>
                            <button className='underline' onClick={() => deleteFaculty(faculty._id)}>
                              Dismiss
                            </button>
                          </td>
                        </tr>
                      ))} */}




                        {Array.isArray(faculties) && faculties.length > 0 ? (
                          faculties.map((faculty, index) => (
                            <tr key={faculty._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{faculty.name ? faculty.name : 'N/A'}</td>
                              <td className='px-6 py-4'>{faculty.email}</td>
                              <td className='px-6 py-4'>{faculty.role ? faculty.role : 'N/A'}</td>
                              <td className='px-6 py-4'>{faculty.cnic ? faculty.cnic : 'N/A'}</td>
                              <td className='px-6 py-4'>{faculty.designation ? faculty.designation : 'N/A'}</td>
                              {/* <td className='px-6 py-4'>{faculty.department.departmentName}</td> */}
                              <td className='px-6 py-4'>
                                {faculty.department && faculty.department.departmentName ? (
                                  // Display departmentName if available in faculty.department
                                  faculty.department.departmentName
                                ) : (
                                  faculty.department ? faculty.department : 'Hello'
                                  // Display department.label if departmentName is not available
                                )}
                              </td>
                              <td className='px-6 py-4'>
                                {faculty.program && faculty.program.programTitle ? (
                                  // Display programTitle if available in faculty.program
                                  faculty.program.programTitle
                                ) : (
                                  // Handle case when program or programTitle is not available
                                  'N/A'
                                )}
                              </td>

                              <td className='px-6 py-4'>
                                <button className='underline mx-2' onClick={() => handleEditFaculty(faculty)}>
                                  Edit
                                </button>
                                <button className='underline' onClick={() => handleViewFaculty(faculty)}>
                                  View
                                </button>
                                <button className='underline ml-2' onClick={() => deleteFaculty(faculty._id)}>
                                  Dismiss
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='9' className='text-center py-4'>No faculties found</td>
                          </tr>
                        )}

                        {/* {filteredFaculties  ? (
 filteredFaculties.map((faculty, index) => (
    <tr key={faculty._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{faculty.name}</td>
      <td className='px-6 py-4'>{faculty.email}</td>
      <td className='px-6 py-4'>{faculty.phoneNumber}</td>
      <td className='px-6 py-4'>{faculty.role}</td>
      <td className='px-6 py-4'>{faculty.cnic}</td>
      <td className='px-6 py-4'>{faculty.designation}</td>
      
      <td className='px-6 py-4'>
  {faculty.department && faculty.department.departmentName ? (
    
    faculty.department.departmentName
  ) : (
    faculty.department ? faculty.department: 'Hello'
    
  )}
</td>

      <td className='px-6 py-4'>
        <button className='underline mx-2' onClick={() => handleEditFaculty(faculty)}>
          Edit
        </button>
        <button className='underline' onClick={() => handleViewFaculty(faculty)}>
          View
        </button>
        <button className='underline ml-2' onClick={() => deleteFaculty(faculty._id)}>
          Dismiss
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan='9' className='text-center py-4'>No faculties found</td>
  </tr>
)} */}


                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 mb-2 ml-6 flex flex-row justify-end'>
            <Simple text={'Import'} onClick={importFaculty} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdmFacultyCreate;
