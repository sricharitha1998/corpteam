import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default () => {

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
            const response = await fetch('http://localhost:4000/users/registration' , {
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
                navigate('/vendorsList')
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
        <>

            <Sidebar />
            
            <main className="content">
                <Navbar />
                { userDetails?.role === "admin" ? 
                <article>
                    <div className="card p-5">
                        <div className="card-header">
                            Add Vendor
                        </div>
                        <form>
                            <div className="form-group mt-4">
                                <div className='row col-md-12'>
                                    <div className='col-md-4 mt-3'>
                                        <label>Username* :</label>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="text" className="inputFiled form-control" name="username" placeholder='Enter Username' onChange={OnChangeFunction} required />
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <label>Email* :</label>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="text" className="inputFiled form-control" name="email" onChange={OnChangeFunction} placeholder='Enter Email' required />
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <label>Mobile Number* :</label>
                                        <p className='getFontSize text-danger'>{ErrMob}</p>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="number" className="inputFiled form-control" name="MobNumber" placeholder='Enter Mobile Number' onChange={OnChangeFunction} required />
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <label>Password* :</label>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="password" className="inputFiled form-control" name="password" placeholder='Enter Password' onChange={OnChangeFunction} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <button type="submit" onClick={ClickSubmit} className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
                : <h5 className='text-center text-danger'>You do not have permission to view this page.</h5>
                }
            </main>

        </>
    );
};
