import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const LoginComp = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  emailError,
  passwordError,
  messages,
  loadingSpinner,
}) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Navigate to the Sign-Up page
    console.log("in function");
    navigate('/signup');
  };
console.log("Loading Spinner", loadingSpinner);
  
  return (
    <>
    {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
    ):(
    <div className="min-h-screen bg-cover bg-center py-20 flex flex-col justify-center" style={{ backgroundImage: `url(/assets/images/LoginBackground.png)` }}>
      <div className="max-w-[110rem] mx-auto px- lg:px-12">
        <div className="bg-primary p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-11 px-10">
            <div className="col">
              <img src="/assets/images/logoText.png" alt="logoText" className="h-28 w-full object-contain" />
              <p className="text-gray-500 text-lg font-medium mt-7 mb-2 text-center lg:text-left">Welcome to C.U.S.T FYP management portal</p>
              <h1 className="text-gray-800 text-5xl font-bold text-center lg:text-left">Login</h1>
              <div className="Inputfields py-4 w-3/4 flex flex-col gap-2">
                <form onSubmit={handleLogin}>
                  <div className="Inputfields py-4 w-3/4 flex flex-col gap-2">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 ">Email Address</label>
                      <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`bg-slate-50 border border-gray-100 text-gray-800 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5  ${emailError && 'border-red-500'}`}
                        placeholder="Enter your email"
                        required
                      />
                      {emailError && (
                        <p className="text-sm text-red-500 mt-1">{emailError}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 ">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`bg-slate-50 border border-gray-100 text-gray-800 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 ${passwordError && 'border-red-500'}`}
                        placeholder="Enter your password"
                        required
                      />
                      {passwordError && (
                        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                      )}
                    </div>
                  <div className="buttons flex flex-row gap-2 justify-center mt-2">
                    <button
                      type="button"
                      className="py-2 px-10 me-2 mb-2 text-white bg-primary hover:bg-white hover:text-black focus:ring-4 border-gray-200 focus:ring-blue-300 font-medium rounded-lg text-sm     focus:outline-none  "
                    onClick={handleSignUp}
                    >
                      Sign-Up
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-12 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-secondary rounded-lg border border-gray-200 hover:bg-primary hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
                    >
                      Login
                    </button>
                  </div>
                  </div>
                  {messages && (
                    <p className="text-sm text-red-500 mt-2">{messages}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
}

export default LoginComp;
