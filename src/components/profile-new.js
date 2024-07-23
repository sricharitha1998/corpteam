import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import '../assets/css/dashboard.css'
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default () => {

    const [InputDetails, setInputDetails] = useState({})
    const [UserDetails, setUserDetails] = useState({})

    useEffect(() => {

        async function provInfo() {
            const details = localStorage.getItem('Details');
            if(details){
                const userInfo = await fetch(`http://localhost:4000/vendor/getDetails/${details?._id}`);
                const res = await userInfo.json();
                setInputDetails(res?.details);
            setUserDetails(JSON.parse(details))
            }
        }
        provInfo();
    }, [])

    const ClickSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(InputDetails)) {
                if (value instanceof File) {
                    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                    const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
                    formData.append(key, newFile);
                } else {
                    formData.append(key, value);
                }
            }
            const response = await fetch('http://localhost:4000/vendor/updateProfile/' + UserDetails?._id, {
                method: 'POST',
                headers: {
                "Accept": "application/json, text/plain, */*"
            },
            body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result) {
                localStorage.setItem('Details', JSON.stringify(result));
                alert("Profile Updated Successfully");
                window.location.reload();
            }

        } catch (error) {
            console.error('Error uploading files:', error);
        }

    }

    console.log("UserDetails", UserDetails)
    console.log("InputDetails", InputDetails)

    const onChangeFunction = (e) => {
        const { name, type, files, value } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

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
                                    <div className='form-group'>
                                        <label className='mt-3'>Financial Document</label>
                                        <input
                                            type='file'
                                            name='financialDetails'
                                            className='form-control my-1'
                                            required
                                            onChange={onChangeFunction}
                                        />
                                        <span className='existFile'>{InputDetails?.financialDetails}<FontAwesomeIcon icon={faTimesCircle} className='mx-2' onClick={() => setInputDetails({ ...InputDetails, financialDetails: '' })}/></span>
                                        <br />
                                        <label className='mt-3'>GST No</label>
                                        <input
                                            type='text'
                                            name='gst'
                                            className='form-control mt-1'
                                            required
                                            placeholder='Enter GST Number'
                                            onChange={onChangeFunction}
                                        />
                                        <label className='mt-3'>ROC</label>
                                        <input
                                            type='file'
                                            name='roc'
                                            className='form-control mt-1'
                                            required
                                            onChange={onChangeFunction}
                                        />
                                        <label className='mt-3'>Photo</label>
                                        <input
                                            type='file'
                                            name='photo'
                                            className='form-control mt-1'
                                            required
                                            onChange={onChangeFunction}
                                        />
                                        <label className='mt-3'>Partnership Lead / AOE / MOA</label>
                                        <input
                                            type='file'
                                            name='partnerShip'
                                            className='form-control mt-1'
                                            required
                                            onChange={onChangeFunction}
                                        />
                                        <label className='mt-3'>Company Pancard</label>
                                        <input
                                            type='file'
                                            name='pancard'
                                            className='form-control mt-1'
                                            required
                                            onChange={onChangeFunction}
                                        />
                                        <label className='mt-3'>Address</label>
                                        <textarea
                                            name='address'
                                            className='form-control mt-1'
                                            placeholder='Enter Address'
                                            required
                                            onChange={onChangeFunction}
                                        ></textarea>
                                        <label className='mt-3'>Others</label>
                                        <textarea
                                            name='companyDetails'
                                            className='form-control mt-1'
                                            placeholder='Enter Others'
                                            required
                                            onChange={onChangeFunction}
                                        ></textarea>
                                        <br />
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
            </main>
        </>
    );
};
