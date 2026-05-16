import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useUser } from "../../src/Components/context/UserContext";
import LoginComp from '../Components/loginComp/LoginComp';
import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [messages, setMessages] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  // const { login, message } = useUser();

  const handleLogin = async (e) => {
    setLoadingSpinner(true);
    console.log('in handle login');
    e.preventDefault();

    // Validate username and password
    if (!email) {
      setEmailError('Email is required.');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
    if (email && password) {
      const body = {
        email, password
      }
      console.log("Hello");
      await axios.post('http://127.0.0.1:5000/api/auth/Genlogin', body)
        .then(res => {
          
          if (res.data.token) {
            setLoggedIn(true);
            console.log('i am in General Users response');
            // setUser(res.data.data)
            localStorage.setItem("key", JSON.stringify(res.data.token));
            localStorage.setItem("user", JSON.stringify(res.data.user))
            console.log("Checkinng roleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee = ", res.data.user.role)
if(res.data.user.role === 'Student' || res.data.user.role === 'student'){
            navigate('/Dashboard');
            window.location.reload(true);
            // setToken(res.data.token)
          }
          else if(res.data.user.role === 'admin')
          {
            navigate('/AdmDashboard');
            window.location.reload(true);
          }
          else if(res.data.user.role === 'faculty')
          {
            navigate('/SupDashboard');
            window.location.reload(true);
          }
          else if(res.data.user.role === 'coordinator' || res.data.user.role === 'Coordinator')
          {
            navigate('/CoodDashboard');
            window.location.reload(true);
          }
          else if(res.data.user.role === 'hod' || res.data.user.role === 'HoD')
          {
            navigate('/HoDDashboard');
            window.location.reload(true);
          }
          else{
            console.log("Condition is wrong");
          }
        }
        })
        .catch(err => {
          if (err.response) {
            // The request was made and the server responded with a status code
            const { status, data } = err.response;
            if (status === 401 && data.message === 'User not found') {
              setMessages('Incorrect email.');
            } else if (status === 401 && data.message === 'Invalid password') {
              setMessages('Incorrect password.');
            } else {
              setMessages('Both email and password are incorrect.');
            }
          } else {
            // The request was made but no response was received or another error occurred
            console.log('Error', err.message);
            setMessages('Server is not responding. Please make sure the backend is running at http://127.0.0.1:5000');
          }
        }).finally(() => {
          setLoadingSpinner(false);
        });
      } else {
        setMessages('Email and password are required!')
      }
    }

return (
    <div>
      
      {!isLoggedIn && (
        
      <LoginComp
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        emailError={emailError}
        passwordError={passwordError}
        messages={messages}
        loadingSpinner = {loadingSpinner}
      />
      )}
    </div>
  );
};

export default Login;
