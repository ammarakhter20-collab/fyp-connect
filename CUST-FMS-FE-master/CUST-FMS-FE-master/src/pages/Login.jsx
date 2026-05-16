// import React, { useState } from 'react'

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   // State to manage form errors
//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   // Function to handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate username and password
//     if (!username) {
//       setUsernameError('Username is required.');
//     } else {
//       setUsernameError('');
//     }

//     if (!password) {
//       setPasswordError('Password is required.');
//     } else if (password.length < 6) {
//       setPasswordError('Password must be at least 6 characters long.');
//     } else {
//       setPasswordError('');
//     }

//     // Perform form submission logic if no errors
//     if (username && password && password.length >= 6) {
//       // Your form submission logic here
//       console.log('Form submitted successfully!');
//     }
//   };


//   return (
//     <div className=' min-h-screen bg-cover bg-center py-20 flex flex-col justify-center' style={{backgroundImage: `url(/assets/images/LoginBackground.png)`}}>
       
//    <div className='max-w-[110rem] mx-auto px- lg:px-12'>
       
// <div className='bg-cover bg-center p-10 rounded-3xl' style={{backgroundImage: `url(/assets/images/update.jpg)`}}>


//    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 py-11 px-10'>
//     <div className='col'>
//       <img src="/assets/images/logoText.png" alt="logoText" className='h-28 w-full object-contain' />
//       <p className='text-white text-lg font-semibold mt-7 mb-4'>Welcome to C.U.S.T FYP management portal</p>
//       <h1 className='text-white text-5xl font-semibold'>Login</h1>
     
//       <div className="Inputfields py-4 w-3/4 flex flex-col gap-2">
        
//       <form onSubmit={handleSubmit}>
//                 {/* ... Other components ... */}
//                 <div className="Inputfields py-4 w-3/4 flex flex-col gap-2">
//                   <div>
//                     <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
//                     <input
//                       type="text"
//                       id="username"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className={`bg-primary border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${usernameError && 'border-red-500'}`}
//                       placeholder="John"
//                       required
//                     />
//                     {usernameError && (
//                       <p className="text-sm text-red-500 mt-1">{usernameError}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
//                     <input
//                       type="password"
//                       id="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className={`bg-primary border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${passwordError && 'border-red-500'}`}
//                       placeholder="Doe"
//                       required
//                     />
//                     {passwordError && (
//                       <p className="text-sm text-red-500 mt-1">{passwordError}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="buttons">
//                   <button
//                     type="button"
//                     className="text-white bg-primary hover:bg-primary focus:ring-4 border-gray-200 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
//                   >
//                     Login with Outlook
//                   </button>
//                   <button
//                     type="submit"
//                     className="py-2.5 px-20 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-secondary rounded-lg border border-gray-200 hover:bg-primary hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
//                   >
//                     Login
//                   </button>
//                 </div>
//               </form>
       
//     </div>
//     </div>
//     <div className='col hidden lg:block '>
//    <div className='mx-auto max-w-[400px]'>
//    <img src="/assets/images/custLogo.png" alt="Cust Logo" className="block h-full w-full" />
//    </div>
//    </div>
//    </div>
// </div>
// </div> 

// </div>

  
//   )
// }

// export default Login;
