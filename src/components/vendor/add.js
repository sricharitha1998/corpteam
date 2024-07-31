import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { useNavigate } from "react-router-dom";
import Footer from '../footer';

function AddVendor() {
    const navigate = useNavigate();

    const [InputDetails, setInputDetails] = useState({status: 1, role: "vendor"})
    const [ErrMob, setErrMob] = useState("");
    const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const details = localStorage.getItem('Details');
    if (!details) {
        navigate('/');
    } else {
        setUserDetails(JSON.parse(details));
    }
  }, []);

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
            const response = await fetch(' https://pmsapi.corpteamsolutions.net/users/registration' , {
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
            console.log("result", result)
            if (result.status === true) {
                // localStorage.setItem('Details', JSON.stringify(result));
                alert("Profile Registered Successfully");
                navigate('/vendorList')
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
        <div fontSetting>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                     
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active"> Add Vendor</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                            { userDetails?.role === "admin" ? 
                            <>
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Username    <span className="text-danger">*</span>
                                                        
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="text" className="form-control" name="username" placeholder='Enter Username' onChange={OnChangeFunction} required />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Email <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="text" className="form-control" name="email" onChange={OnChangeFunction} placeholder='Enter Email' required />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Mobile Number  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="number" className="form-control" name="MobNumber" placeholder='Enter Mobile Number' onChange={OnChangeFunction} required />
                                                       
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Password  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="password" className="form-control" name="password" placeholder='Enter Password' onChange={OnChangeFunction} required />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </form>
                                </div>
                                <div className="row mt-4 align-items-center">
                                    <div className="col-sm-6 text-sm-right text-start">
                                        <button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button>
                                    </div>
                                </div>
                                </>
                                :
                                <h5 className='text-center text-danger'>You do not have permission to view this page.</h5>
                            }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer /> 
        </div>
    );
}

export default AddVendor;
