import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';

function Profile() {
    const [InputDetails, setInputDetails] = useState({})
 
    useEffect(()=>{
        
            async function provInfo() {
                const details = localStorage.getItem('Details');
                setInputDetails(JSON.parse(details))
            }
        provInfo();
    },[])

    let name, value;
    const OnChangeFunction = (event) => {
        name = event.target.name;
        value = event.target.value;
        setInputDetails({
            ...InputDetails,
            [name]: value
        })
    };

    const ClickSubmit = async (e) => {
        e.preventDefault();
       
        try {
            const response = await fetch(' https://93.127.185.34:4000/users/changeProfile/'+InputDetails?._id, {
                method: 'POST',
                headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*"
            },
                body: JSON.stringify({username: InputDetails?.username}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("result", result)
            if(result){
                localStorage.setItem('Details', JSON.stringify(result));
                alert("Profile Updated Successfully");
                window.location.reload();
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
                            <li className="breadcrumb-item active">Profile Details</li>
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
                                                    <input type="text" className="form-control" name="username" placeholder='Enter Username' onChange={OnChangeFunction} defaultValue={InputDetails?.username} required />
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
            <div className="footer">
                <div className="copyright">
                    <p>Copyright © Designed & Developed by <a href="" target="_blank">CorpTeam Solutions</a> <span className="current-year">2024</span></p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
