
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary' 
import axios from 'axios';
import { CiEdit } from "react-icons/ci";
import bcrypt from 'bcryptjs'; 
import { initFlowbite } from 'flowbite';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
const StudProfile = ({isFYPRegistered}) => {
const [editable, setEditable] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  secondaryEmail: '',
  phoneNumber: '',
  address: '',
});

const [passwordData, setPasswordData] = useState({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const [OldPassword, setOldPassword] = useState(null);
const [NewPassword, setNewPassword] = useState(null);
const [ConfirmPassword, setConfirmPassword] = useState(null);
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [loadingSpinner, setLoadingSpinner] = useState(false);
const [StudData, setStudData] = useState('');
const [confirmationMessage, setConfirmationMessage] = useState('');
const [ShowConMsg, setShowConMsg] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const fetchStudData = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    setLoadingSpinner(true);
   
    setStudData(user);

  } catch (error) {
    console.error('Error fetching student data:', error);
  } finally {
    setLoadingSpinner(false);
  }
};

const fetchUserData = async () => {
  const key = JSON.parse(localStorage.getItem("key"));
  // console.log(key);
  try {
    setLoadingSpinner(true);
    const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

    const response = await axios.get('/api/auth/GenUserData', config);


    if (response.status !== 497) {
      if (!response.data || !response.data.user) {

        return;
      }

    }
    else {
      navigate('/login');
    }

    setStudData(response.data.user);
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    setLoadingSpinner(false);
  }
};

const handleUploadPicture = async () => {
  console.log("inside handleuploadPicture");
  try {
    setLoadingSpinner(true);

    if (!file) {
      alert('Please select a file.');
      return;
    }

    // Get user ID from localStorage
    const userDataString = localStorage.getItem('user');
    const userData = JSON.parse(userDataString);

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('user', userData._id);

    let response;

    // Check if the user already has an image
    if (StudData.image) {
      console.log("Inside Updated image api");
      console.log("Inside Updated image api");
      console.log("Inside Updated image api");

      // Use PATCH request to update the user's image
      response = await axios.patch(
        `/api/auth/updateProfilePicture/${userData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('key')}`,
          },
        }
      );
      console.log("Checking updated response", response);
      console.log("Checking updated response", response.message);
      console.log("Checking updated response", response.data);
    } else {
      console.log("Inside Upload image api");
      console.log("Inside Upload image api");
      console.log("Inside Upload image api");
      // Use POST request to upload the user's image
      response = await axios.post(
        '/api/auth/uploadProfilePicture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('key')}`,
          },
        }
      );
    }

    // Log the response for debugging
    console.log('Profile picture uploaded:', response.data);

    // Update the state with the updated user data from the response
    setStudData(prevData => ({
      ...prevData,
      image: response.data.user.image // Assuming the response contains updated user data
    }));

    // Clear the file state after successful upload
    setFile(null);

    // You can update the user data or display a success message here
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    // Display an error message to the user
  } finally {
    setLoadingSpinner(false);
  }
};

useEffect (()=>{
  // fetchStudData();
  fetchUserData();
}, [])

const handleChangePicture = () => {
  console.log('Button clicked');
};

const UpdateProfile = () => {
  setEditable(false);
}

const handleEditClick = () => {
  setEditable(true);
};

const handleUpdateProfileData = async () => {
  setEditable(false); 
  try {
    setLoadingSpinner(true);
    const userId = JSON.parse(localStorage.getItem('user'));
    const user = userId._id;
console.log("Checking user id", user);
    const updatedFormData = {
      user, 
      name: formData.name,
      email: formData.email,
      secondaryEmail: formData.secondaryEmail,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    const key = JSON.parse(localStorage.getItem('key'));
    const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
    const response = await axios.patch('/api/auth/updateUserProfile', updatedFormData, config);

    console.log('Profile updated:', response.data);
    setConfirmationMessage('Profile Updated successfully');
    setShowConMsg(true);
    setTimeout(() => {
      setShowConMsg(false);
    }, 3000);

  } catch (error) {
    console.error('Error updating profile:', error);

  } finally {
    setLoadingSpinner(false);
  }
};




const handleUploadClick = () => {
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.click();
  }
};

const handleCancel = () => {
  setFile(null);
};


useEffect(() => {

  if(!localStorage.getItem('key')){
    navigate('/login');
  }
 
}, []);




// console.log("Admin Data", StudData.password);
const  hashedPassword  = StudData.password;
// console.log("Checking hashed password", hashedPassword);
// console.log("Checking hashed password", hashedPassword);
const handleUpdatePassword = async () => {
try {
  setLoadingSpinner(true);
  const key = JSON.parse(localStorage.getItem('key'));
  const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

  const { oldPassword, newPassword, confirmPassword } = passwordData;
  // console.log("Old password", oldPassword);
  // console.log("New password", newPassword);
  // console.log("Confirm password", confirmPassword);
 

  // Check if new password matches confirm password
  if (newPassword !== confirmPassword) {
    alert('New password and confirm password must match.');
    return;
  }

  // Verify old password using bcrypt
  const passwordMatch = await bcrypt.compare(oldPassword, hashedPassword);

  if (!passwordMatch) {
    alert('Old password is incorrect.');
    return;
  }

  console.log("Here ");

  // Hash the new password before sending to the backend
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  // console.log("hashed New password", hashedNewPassword);
  const password = hashedNewPassword;

  // Send a PATCH request to update the password
  const userDataString= localStorage.getItem('user'); // Adjust the key based on how it's stored
    // console.log("Rough Id",  userDataString);

    // // Parse the JSON string to get the user data object
    const userData = JSON.parse(userDataString);
    
    // // Extract the userId from the userData
    const user = userData._id;
    console.log("Checking id", user);

  // Send a PATCH request to update the password with userId and newPassword
  const response = await axios.patch(
    '/api/auth/updateUserProfile',
    { user, password },
    config
  );


  console.log('Password updated:', response.data);
  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  setConfirmationMessage('Password Update successfully');
  setShowConMsg(true);

  // Hide the confirmation message after 3 seconds
  setTimeout(() => {
    setShowConMsg(false);
  }, 3000);
  // Optionally update state or show a success message
} catch (error) {
  console.error('Error updating password:', error);
  // Display an error message to the user
} finally {

  setLoadingSpinner(false);
}
};
console.log("CHeck show con message", ShowConMsg);
console.log("CHeck show con message text", confirmationMessage);

const handleCloseConfirmation = () => {
setConfirmationMessage(''); // Clear confirmation message
};


const handlePassInputChange = (e) => {
const { name, value } = e.target;
setPasswordData({ ...passwordData, [name]: value });
};

useEffect(() => {
// Initialize formData when StudData changes
setFormData({
  name: StudData.name || '',
  email: StudData.email || '',
  secondaryEmail: StudData.secondaryEmail || '',
  phoneNumber: StudData.phoneNumber || '',
  address: StudData.address || '',
});
}, [StudData]);






const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

// const handleUpdateProfileData = async () => {
//   try {
//     setLoadingSpinner(true);
//     const key = JSON.parse(localStorage.getItem('key'));
//     const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
//     const response = await axios.patch('/api/auth/updateProfile', formData, config);
//     console.log('Profile updated:', response.data);
//     // Optionally update state or show a success message
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     // Display an error message to the user
//   } finally {
//     setLoadingSpinner(false);
//   }
// };


console.log("Checking admin data", StudData);
const [file, setFile] = useState(null);
const navigate = useNavigate();

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};

// Function to upload profile picture




  useEffect(() => {
    initFlowbite();
    if(!localStorage.getItem('key')){
      navigate('/login');
    }
    
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'Profile';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  // const [formData, setFormData] = useState({
  //   Name: StudData.name,
  //   PrimaryEmail: StudData.email,
  //   secondaryEmail: StudData.secondaryEmail,
  //   ContactNumber: StudData.phoneNumber,
  //   Address: StudData.address,
  // });

  console.log("formData Name checking", StudData.name);

  console.log("Checking admin data", StudData.image);
  console.log('Image URL:', `/assets/images/${StudData.image}`);
  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div>
          {ShowConMsg && (
        <div className={`top-5 right-5 bg-green-400 text-white p-3 rounded-md opacity-0 transition-opacity duration-500 ${ShowConMsg ? 'opacity-100' : ''}`}>
        {confirmationMessage}
      </div>
          )}
            <div className='relative'>
              <img src='/assets/images/DashboardBanner.png' alt='Dashboard Banner' className='w-full object-cover h-72' />
  
              <div>
                <div className='max-w-md bg-white border border-gray-200 rounded-lg shadow absolute inset-0 mx-auto h-60 mt-14 '>
  
                  <div className='h-[5.625rem] mt-[-3.3125rem] rounded-full '>
                    <img
                      className='rounded-full w-24 h-24 object-fill mx-auto border-white border-2'
                      src={`/uploads/${StudData.image}`}
                      alt='Card Image'
                    />
                  </div>
                  <div className='p-5 pt-2'>
                    <div className='AdminName'>
                      <p className='font-light text-sm text-center'>{StudData ? StudData.role : 'Loading...'}</p>
                      <h1 className='font-bold text-center'>{StudData ? StudData.name : 'Loading...'}</h1>
                    </div>
                    <div className='regCgpa flex flex-col justify-center space-y-2 text-xs ml-1 mt-2'>
                      <div className='text-center flex flex-row justify-center space-x-2'>
                        <h1 className='font-semibold'>Email:</h1>
                        <p className='font-light'>{StudData ? StudData.email : 'Loading...'}</p>
                      </div>
                      <div className='text-center  flex flex-row justify-center space-x-2'>
                        <h1 className='font-semibold'>Extension:</h1>
                        <p className='font-light'>{StudData ? StudData.extension : 'Loading...'}</p>
                      </div>
                      <div className='text-center  flex flex-row justify-center space-x-2'>
                        <h1 className='font-semibold'>CNIC:</h1>
                        <p className='font-light'>{StudData ? StudData.cnic : 'Loading...'}</p>
                      </div>
                      <div className='text-center'>
                        {file ? (
                          <div>
                            <div className='flex flex-row gap-4 justify-center -mt-1'>
                              <p>Selected File: {file.name}</p>
                              <button className='underline font-semibold' onClick={handleCancel}>Cancel</button>
                            </div>
                            <div className='mt-2'>
                              {/* <ButbgPrimary text="Upload" onClick={handleUploadPicture} /> */}
                              <div className='mt-2'>
  {StudData.image ? (
    <ButbgPrimary text="Change" onClick={handleUploadPicture} />
  ) : (
    <ButbgPrimary text="Upload" onClick={handleUploadPicture} />
  )}
</div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="fileInput"
                              accept="image/*"
                              onChange={handleFileChange}
                              style={{ display: 'none' }} // Hide the file input initially
                            />
                            {/* <ButbgPrimary text="Upload Picture" onClick={handleUploadClick} className="px-2 py-1" /> */}
                            <div>
                              {StudData.image ? (
                            <ButbgPrimary text="Change Picture" onClick={handleUploadClick} className="px-2 py-1" />
                              ): (

                            <ButbgPrimary text="Upload Picture" onClick={handleUploadClick} className="px-2 py-1" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
  
              </div>
  
            </div>
          
        
          <div className='ProfileForm bg-white border border-gray-200 mx-40 mt-14 rounded-lg'>
  
            <div className='flex flex-row justify-around mx-[-36.25rem]'>
              <p className='font-bold text-2xl ml-5 mt-2'>Profile</p>
  
              <CiEdit className='h-9 w-9 text-right cursor-pointer mr-5' onClick={handleEditClick} />
  
            </div>
            <form class="max-w-5xl  mx-auto mt-4">
  
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="Name"
                    value={formData.name}
                    className={`block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 border-dotted focus:outline-none focus:border-primary appearance-none ${
                      editable ? '' : 'disabled'
                      }`}
                    placeholder=" "
                    onChange={handleInputChange}
                    disabled
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="PrimaryEmail"
                    className={`block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 border-dotted focus:border-primary focus:outline-none appearance-none ${
                      editable ? "" : ""
                      }`}
                    placeholder=" "
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Primary Email Address
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6 mt-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="secondaryEmail"
                    value={formData.secondaryEmail}
                    className={`block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none ${
                      editable ? "" : ""
                      }`}
                    placeholder=" "
                    onChange={handleInputChange}
                    disabled={!editable}
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Secondary Email Address
                  </label>
                </div>
  
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="phoneNumber"
                    className={`block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none ${
                      editable ? "" : ""
                      }`}
                    placeholder=" "
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!editable}
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Contact Number
                  </label>
                </div>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="address"
                  className={`block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none ${
                    editable ? "" : ""
                    }`}
                  placeholder=" "
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
                <label
                  htmlFor="floating_phone"
                  className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Address
                </label>
              </div>
  
              <div className="text-right">
                <ButbgPrimary
                  text="Update Profile"
                  onClick={handleUpdateProfileData}
                  className={`${
                    editable ? "" : "hidden" // Hide when editable is false
                    }`}
                />
              </div>
            </form>
  
          </div>
  
  
          <div className='ChnagePassword bg-white border border-gray-200 mx-40 mt-14 rounded-lg'>
  
            <p className='font-bold text-2xl ml-5 mt-2'>Change Password</p>
  
            <form class="max-w-5xl  mx-auto mt-6">
  
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  className="block py-2.5 px-0 w-[31.25rem] text-base font-normal text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none"
                  placeholder=""
                  value={passwordData.oldPassword}
                  onChange={handlePassInputChange}
  
                />
                <label
                  htmlFor="floating_phone"
                  className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Old Password
                </label>
                <span
                  className="absolute top-3 ml-[29.6875rem] cursor-pointer text-2xl"
                  onMouseDown={() => setShowOldPassword(true)}
                  onMouseUp={() => setShowOldPassword(false)}
                  onMouseLeave={() => setShowOldPassword(false)}
                >
                  👁️
                </span>
              </div>
  
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="block py-2.5 px-0 w-[31.25rem] text-base font-normal text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none"
                  placeholder=""
                  value={passwordData.newPassword}
                  onChange={handlePassInputChange}
                  // disabled={!showNewPassword} 
                />
                <label
                  htmlFor="floating_phone"
                  className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  New Password
                </label>
                <span
                  className="absolute top-3 ml-[29.6875rem] cursor-pointer text-2xl"
                  onMouseDown={() => setShowNewPassword(true)}
                  onMouseUp={() => setShowNewPassword(false)}
                  onMouseLeave={() => setShowNewPassword(false)}
                >
                  👁️
                </span>
              </div>
  
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="block py-2.5 px-0 w-[31.25rem] text-base font-normal text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none appearance-none"
                  placeholder=""
                  value={passwordData.confirmPassword}
                  onChange={handlePassInputChange}
                  // disabled={!showConfirmPassword} 
                />
                <label
                  htmlFor="floating_phone"
                  className="peer-focus:font-medium absolute text-xl font-light text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confirm Password
                </label>
                <span
                  className="absolute top-3 ml-[29.6875rem] cursor-pointer text-2xl"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                >
                  👁️
                </span>
              </div>
  
              <div className="text-right">
                <ButbgPrimary
                  text="Change"
                  onClick={handleUpdatePassword}
  
                />
              </div>
            </form>
  
          </div>
  
        </div>
      )}
    </>
  );
                  }  

export default StudProfile
