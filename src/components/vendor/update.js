import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../navbar';
import { useNavigate, useLocation } from "react-router-dom";
import Footer from '../footer';

function UpdateVendor() {
    const navigate = useNavigate();

    const [InputDetails, setInputDetails] = useState({status: 1, role: "vendor"})
    const [ErrMob, setErrMob] = useState("");
    const location = useLocation();

    useEffect(() => {
        const provInfo = async () => {
            if(location?.state?.id){
                const userInfo = await fetch(`/api/users/getById/${location?.state?.id}`);
      const res = await userInfo.json();
      setInputDetails(res)
            }
        }
        provInfo();
    },[location?.state])

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

    console.log("ErrMob", ErrMob)

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

    const ClickSubmit = async (e) => {
        e.preventDefault();
        try {
           
            if (validateEmail(InputDetails.email)){
                if(!ErrMob){
            const response = await fetch(`/api/users/changeProfile/${InputDetails?._id}` , {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                body: JSON.stringify({username: InputDetails?.username,email: InputDetails?.email, MobNumber: InputDetails?.MobNumber}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result) {
                alert("Profile Updated Successfully");
                navigate("/vendorList")
            }
        }else{
            alert("Please enter valid mobile number")
        }
        }else{
            alert("Please enter valid email")
        }

        } catch (error) {
            console.error('Error uploading files:', error);
        }

    }
    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                     
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Update Service Partners</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                           
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Username    <span className="text-danger">*</span>
                                                        
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="text" className="form-control" name="username" placeholder='Enter Username' onChange={OnChangeFunction} required  defaultValue={InputDetails?.username}/>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Email <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="text" className="form-control" name="email" onChange={OnChangeFunction}  defaultValue={InputDetails?.email} placeholder='Enter Email' required />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Mobile Number  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="number" className="form-control" name="MobNumber" placeholder='Enter Mobile Number' onChange={OnChangeFunction}  defaultValue={InputDetails?.MobNumber} required />
                                                       <p className='text-danger'>{ErrMob}</p>
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
                             
                               
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpdateVendor;
