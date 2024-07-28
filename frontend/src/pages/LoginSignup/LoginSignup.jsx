import React, { useState } from 'react';
import './LoginSignup.css';
import { assets } from '../../assets/assets';


const LoginSignup = () => {

  const url = 'http://localhost:4000';

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const login = async () => {
    console.log("Login function executed", formData);
    let responseData;
    
    await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      setError(responseData.errors);
    }
  }

  const signup = async () => {
    console.log("signup function executed", formData);
    let responseData;
    await fetch(`${url}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      setError(responseData.errors);
    }
  }

  const toggleState = () => {
    setState(state === "Login" ? "Sign Up" : "Login");
    setFormData({ username: "", password: "", email: "" });
    setError(null);
  }

  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>{state}</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="loginSignup-fields">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Username' /> : null}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='E-mail' />
          <div className="password-field">
            <input name='password' value={formData.password} onChange={changeHandler}
              type={passwordVisible ? 'text' : 'password'}
              placeholder='Password'
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <img src={assets.hide} alt="" /> : <img src={assets.show} alt="" />}
            </span>
          </div>
        </div>
        <button className='lsbutton' onClick={() => { state === "Login" ? login() : signup() }}>{state.toUpperCase()}</button>
        <p className='loginSignup-login'>
          {state === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={toggleState}>
            {state === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginSignup;
