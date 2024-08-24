import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import '../assets/css/style.css';
import Logo from '../assets/img/logo/dashboard-logo.png';
import { useNavigate } from "react-router-dom";
const Register = () => {

    const navigate = useNavigate();

    const [InputDetails, setInputDetails] = useState({status: 1, role: "vendor"})
    const [ErrMob, setErrMob] = useState("");
    
    let name, value;
    const OnChangeFunction = (event) => {
        name = event.target.name;
        value = event.target.value;

        if(name === "MobNumber"){
            if(value.length > 10 || value.length < 10){
                setErrMob("mobile number should be in 10 digits")
            }else{
                setErrMob("")
            }
        }

        setInputDetails({
            ...InputDetails,
            [name]: value
        })
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

    const ClickSubmit = async (e) => {
        e.preventDefault();
        try {
            if(InputDetails?.username && InputDetails?.password){
            if (validateEmail(InputDetails.email)){
                if(!ErrMob){
                    console.log("Input", InputDetails)
            const response = await fetch('https://pms.corpteamsolution.com/api/users/registration' , {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                body: JSON.stringify(InputDetails),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.status === true) {
                // localStorage.setItem('Details', JSON.stringify(result));
                alert("Profile Registered Successfully");
                navigate('/login')
            }else if(result.status === false){
                alert("Profile Already Exists")
            }else{
                alert("Profile Update Again")
            }
        }else{
            alert("Please enter valid mobile number")
        }
        }else{
            alert("Please enter valid email")
        }
    }else{
        alert("Please enter all fields")
    }

        } catch (error) {
            console.error('Error uploading files:', error);
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
                <div className="col-xl-12">
                                <div className="auth-form">
                                    <div className="text-center mb-3">
                                        <a href="index.html" className="brand-logo">
                                        <img src={Logo} width="150px" alt="Logo" /> 
                                        </a>
                                    </div>
                                    <h4 className="text-center mb-4">Sign up your account</h4>
                                    <form action="index.html">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="mb-1"><strong>Username </strong><span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="username" placeholder='Enter Username' onChange={OnChangeFunction} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="mb-1"><strong>Phone Number </strong><span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" name="MobNumber" placeholder='Enter Mobile Number' onChange={OnChangeFunction} required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="mb-1"><strong>Email </strong><span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="email" onChange={OnChangeFunction} placeholder='Enter Email' required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label className="mb-1"><strong>Password </strong><span className="text-danger">*</span></label>
                                                    <input type="password" className="form-control" name="password" placeholder='Enter Password' onChange={OnChangeFunction} required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="text-center mt-4">
                                                    <button type="submit" onClick={ClickSubmit} className="btn btnColor text-white btn-block">Sign me</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="new-account mt-3">
                                        <p>Already have an account? <a className="colorText" href="/login">Sign in</a></p>
                                    </div>
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

export default Register;