import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import '../assets/css/style.css';
import Logo from '../assets/img/logo/dashboard-logo.png';
import { useLocation, useNavigate } from "react-router-dom";
const AdminLogin = () => {

   
  const [InputDetails, setInputDetails] = useState({
    email: "",
    password: "", role: "admin"
});
const navigate = useNavigate();
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

let name, value;
function LoginInput(event) {
  name = event.target.name;
  value = event.target.value;
  setInputDetails({
      ...InputDetails,
      [name]: value
  })
}

const Login = async (event) => {
  event.preventDefault();
  if (validateEmail(InputDetails.email) && InputDetails?.password){
//  const response = await fetch('https://93.127.185.34:4000/users/login', {
 //const response = await fetch('https://pms.corpteamsolution.com/users/login', {

const response = await fetch('https://pms.corpteamsolution.com/api/users/login', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*"
          },
          body: JSON.stringify(InputDetails)

  });
  if(response?.status === 200){
      const data = await response.json();
      localStorage.setItem('Details', JSON.stringify(data.details));
          navigate('/adminDashboard')      
  }else{
      alert("Enter correct credentials")
  }
}else{
  alert("Please enter a valid email and fill all fields")
}
 }
    
  return (
    <div className="vh-100">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12 boxCSSShadow">
                    <div className="auth-form">
                      <div className="text-center mb-3">
                        <a href="index.html" className="brand-logo">
                          <img src={Logo} width="150px" alt="Logo" /> 
                        </a>
                      </div>
                      <h4 className="mb-0 text-center">Sign in</h4>
                  <p className='text-center'>Please Enter Your User Credentials</p>
                      <form action="index.html">
                        <div className="form-group">
                          <label className="mb-1"><strong>Email</strong></label>
                          <input type="email" autoFocus required name="email" onChange={LoginInput} placeholder="example@company.com"  className="form-control" />
                        </div>
                        <div className="form-group">
                          <label className="mb-1"><strong>Password</strong></label>
                          <input type="password" className="form-control" required name="password" onChange={LoginInput} placeholder="Password" />
                        </div>
                        
                        <div className="text-center">
                          <button type="submit" onClick={Login} className="btn btnColor text-white btn-block">Sign In</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
