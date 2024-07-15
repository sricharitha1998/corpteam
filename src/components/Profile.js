import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import '../assets/css/dashboard.css'

export default () => {

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
            const response = await fetch('http://localhost:4000/users/changeProfile/'+InputDetails?._id, {
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
        <>
        
            <Sidebar />

            <main className="content">
                <Navbar />
                <article>

                    <div class="card p-5">
                    <div class="card-header sticky-header">
                            <h5>Change Profile</h5>
                        </div>
                        <form>
                    <div className="form-group mt-4">
                    <div className='row col-md-12'>
                        <div className='col-md-4 mt-3'>
                        <label>Username* :</label>
                        </div>
                        <div className='col-md-8 mt-3'>
                        <input type="text" className="inputFiled form-control" name="username" onChange={OnChangeFunction} defaultValue={InputDetails?.username} required />
                        </div>
                        {/* <div className='col-md-4 mt-3'>
                        <label>Email* :</label>
                        </div>
                        <div className='col-md-8 mt-3'>
                        <input type="text" className="inputFiled form-control" name="email" onChange={OnChangeFunction} defaultValue={InputDetails?.email} required />
                        </div>
                        <div className='col-md-4 mt-3'>
                        <label>Mobile Number* :</label>
                        </div> 
                        <div className='col-md-8 mt-3'>
                        <input type="number" className="inputFiled form-control" name="MobNumber" onChange={OnChangeFunction} defaultValue={InputDetails?.MobNumber} required />
                        </div>*/}
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

            </main>
        </>
    );
};
