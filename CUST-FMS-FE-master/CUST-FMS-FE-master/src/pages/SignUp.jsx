import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';  // Import Redirect from react-router-dom

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regno, setRegNo] = useState('');
  const [program, setProgram] = useState('');
  const [cgpa, setCGPA] = useState('');
const [image, setImage] = useState('');

  // State to manage form errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [regError, setRegError] = useState('');
  const [programError, setProgramError] = useState('');
  const [cgpaError, setCGPAError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Redirect state
  const [redirect, setRedirect] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!email) {
      setEmailError('Email is required.');
    } else {
      setEmailError('');
    }

    if (!name) {
      setNameError('Name is required.');
    } else {
      setNameError('');
    }

    if (!regno) {
      setRegError('Reg-no is required.');
    } else {
      setRegError('');
    }
    if (!program) {
      setProgramError('Program is required.');
    } else {
      setProgramError('');
    }
    if (!cgpa) {
      setCGPAError('Program is required.');
    } else {
      setCGPAError('');
    }
    if (!image) {
      setProfileError('Profile is required.');
    } else {
      setProfileError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }

    // Perform form submission logic if no errors
    if (!emailError && !nameError && !regError && !passwordError) {
      try {
        const apiUrl = 'http://127.0.0.1:5000/api/auth/signup';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            regno,
            program,
            cgpa,
            image,
            email,
            password,

          }),
        });

        if (response.ok) {
          // Handle successful response
          setEmail('');
          setName('');
          setRegNo('');
          setPassword('');
          setProgram('');
          setCGPA('');
          setImage('');
          
          
          setSubmissionStatus('Form submitted successfully!');
          // Set redirect to true after successful submission
          setRedirect(true);
        } else {
          // Handle unsuccessful response
          const data = await response.json().catch(() => ({}));
          setSubmissionStatus(data.error || 'Failed to submit form. Please try again.');
        }
      } catch (error) {
        // Handle network errors
        console.error('Network error:', error);
        setSubmissionStatus('Server is not responding. Please make sure the backend is running at http://127.0.0.1:5000');
      }
    }
  };


  const handleProfilePictureChange = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result)
    };
    reader.onerror = error => {
      console.log("Error", error)
    };
    }
  
  
  useEffect(() => {
    if (submissionStatus) {
      console.log(submissionStatus);
    }
  }, [submissionStatus]);

  // Redirect to the login page after successful submission
  if (redirect) {
    return <Navigate to="/Login" />;
  }

  return (
    <div className='min-h-screen bg-cover bg-center py-20 flex flex-col justify-center' style={{ backgroundImage: `url(/assets/images/LoginBackground.png)` }}>
      <div className='max-w-[110rem] mx-auto px- lg:px-12'>
        <div className='bg-cover bg-center p-10 rounded-3xl' style={{ backgroundImage: `url(/assets/images/update.jpg)` }}>
          <div className='grid grid-cols-1 lg:grid-cols-3 py-4 px-4'>
            <div className=' col-start-1 col-end-3'>
              <img src="/assets/images/logoText.png" alt="logoText" className='h-20 w-2/3 object-fill' />
              <p className='text-white text-lg font-semibold mt-7 mb-4'>Welcome to C.U.S.T FYP management portal</p>
             
              <div className="Inputfields py-2 w-3/4 flex flex-col gap-2">
                <form onSubmit={handleSubmit}>
                  <div className='max-w-7xl'>
              <h1 className='text-white text-4xl font-semibold flex flex-row justify-center'>Sign-Up</h1>
                  <div className="Inputfields grid grid-cols-2 gap-12">
                    <div className='col leftCols py-4 max-w-4xl'>
                  <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-white ">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${nameError && 'border-red-500'}`}
                        placeholder="John"
                        required
                      />
                      {nameError && (
                        <p className="text-sm text-red-500 mt-1">{nameError}</p>
                      )}
                    </div>
                  <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Reg-no</label>
                    <input
                      type="text"
                      id="regno"
                      value={regno}
                      onChange={(e) => setRegNo(e.target.value)}
                      className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${nameError && 'border-red-500'}`}
                      placeholder="BSE0000"
                      required
                    />
                    {regError && (
                      <p className="text-sm text-red-500 mt-1">{regError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="Program" className="block mb-2 text-sm font-medium text-white ">Program</label>
                    <input
                      type="text"
                      id="program"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${programError && 'border-red-500'}`}
                      placeholder="BSE0000"
                      required
                    />
                    {programError && (
                      <p className="text-sm text-red-500 mt-1">{programError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="CGPA" className="block mb-2 text-sm font-medium text-white ">CGPA</label>
                    <input
                      type="text"
                      id="cgpa"
                      value={cgpa}
                      onChange={(e) => setCGPA(e.target.value)}
                      className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${cgpaError && 'border-red-500'}`}
                      placeholder="BSE0000"
                      required
                    />
                    {cgpaError && (
                      <p className="text-sm text-red-500 mt-1">{cgpaError}</p>
                    )}
                  </div>
                  </div>
                  <div className='col rightCols py-4 max-w-4xl '>
                  
          <label htmlFor="profilePicture" className="block mb-2 text-sm font-medium text-white">
            Upload Profile Picture
          </label>
          <input
            type="file"
            id="image"
          
            accept="image/*" // Allow only image files
            onChange={handleProfilePictureChange}
            className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${profileError && 'border-red-500'}`}
            required
          />
           {profileError && (
                        <p className="text-sm text-red-500 mt-1">{profileError}</p>
                      )}
        

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                    <input
                      type="email"
                      id="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${nameError && 'border-red-500'}`}
                      placeholder="BSE000000@cust.edu.pk"
                      required
                    />
                    {emailError && (
                      <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5             ${passwordError && 'border-red-500'}`}
                      placeholder="password"
                      required
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                  </div>
                </div>
                <div className='flex justify-center'>
                <div className="buttons">
                    <button
                      type="submit"
                      className="py-2.5 px-12 me-2 mb-2 mt-2 ml-11 text-sm font-medium text-white focus:outline-none bg-primary rounded-lg border border-gray-200 hover:bg-slate-700 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200            "
                      >
                      Sign-Up
                    </button>
                </div>
                </div>
                      </div>
                
              </form>
       
    </div>
    </div>
    <div className='col hidden lg:block '>
   <div className='max-w-[400px]  mt-24'>
   <img src="/assets/images/SignUpCustLogo.png" alt="Cust Logo" className="block h-full w-full" />
   </div>
   </div>
   </div>
</div>
</div> 

</div>

  
  )
}

export default SignUp;
