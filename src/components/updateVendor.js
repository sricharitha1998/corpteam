import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default () => {

    const navigate = useNavigate();

    const [InputDetails, setInputDetails] = useState({status: 1, role: "vendor"})
    const [ErrMob, setErrMob] = useState("");
    const location = useLocation();

    useEffect(() => {
        const provInfo = async () => {
            if(location?.state?.id){
                const userInfo = await fetch(`http://localhost:4000/users/getById/${location?.state?.id}`);
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
            const response = await fetch(`http://localhost:4000/users/changeProfile/${InputDetails?._id}` , {
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
                navigate("/vendorsList")
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
        <>

            <Sidebar />

            <main className="content">
                <Navbar />
                <article>

                    <div className="card p-5">
                        <div className="card-header">
                            Update Vendor
                        </div>
                        <form>
                            <div className="form-group mt-4">
                                <div className='row col-md-12'>
                                    <div className='col-md-4 mt-3'>
                                        <label>Username :</label>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="text" className="inputFiled form-control" name="username" onChange={OnChangeFunction} defaultValue={InputDetails?.username} placeholder='Enter Username' required />
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <label>Email :</label>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="text" className="inputFiled form-control" name="email" onChange={OnChangeFunction} defaultValue={InputDetails?.email} placeholder='Enter Email' required />
                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <label>Mobile Number :</label>
                                        <p className='getFontSize text-danger'>{ErrMob}</p>
                                    </div>
                                    <div className='col-md-8 mt-3'>
                                        <input type="number" defaultValue={InputDetails?.MobNumber} className="inputFiled form-control" name="MobNumber" placeholder='Enter Mobile Number' onChange={OnChangeFunction} required />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <button type="submit" onClick={ClickSubmit} className="btn btn-primary">Update</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </article>

            </main>
        </>
    );
};
