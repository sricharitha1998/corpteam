import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/dashboard.css';

export default () => {
    const navigate = useNavigate();
    const [inputDetails, setInputDetails] = useState({});
    const date = new Date();
    const [details, setDetails] = useState()
    const [VendorDetails, setVendorDetails] = useState()
    const [ApprovalStatus, setApprovalStatus] = useState()

    useEffect(() => {
        async function fetchData() {
            const getDetails = localStorage.getItem('Details');
            setDetails(JSON.parse(getDetails))
            const userInfo = await fetch(`http://localhost:4000/vendor/getDetails/${JSON.parse(getDetails)?._id}`);
            const res = await userInfo.json();
            setVendorDetails(res?.details)
            const allApproved = res?.details?.approvals.every(approval => approval.status !== "Approved");
            setApprovalStatus(allApproved)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const RandomCode = "CTS" + month + year + Math.floor(10 + Math.random() * 90);
            setInputDetails({ ...inputDetails, code: RandomCode });
        }
        fetchData();
    }, []);

    const CommonFunction = async () => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(inputDetails)) {
            if (value instanceof File) {
                const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
                formData.append(key, newFile);
            } else {
                formData.append(key, value);
            }
        }

        formData.append('dateTime', date.toISOString());
        formData.append("vendor_id", details?._id)

        const response = await fetch('http://localhost:4000/vendor/register', {
            method: 'POST',
            headers: {
                "Accept": "application/json, text/plain, */*"
            },
            body: formData,
        });

        const data = await response.json();

        if (data) {
            alert("Vendor registered successfully");
            navigate("/login", { state: { role: "vendor" } });
        }
    }
    const onChangeFunction = (e) => {
        const { name, type, files, value } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    
    return (
        <>
            {/* <Navbar /> */}
            <article className="px-5">
                <div class="card p-5 my-5">
                    <form encType='multipart/form-data'>
                        <div className='row col-md-12'>
                            <h5 className="text-center">Update Profile</h5>

                            {VendorDetails ?
                                !ApprovalStatus ?
                                
                                        <p className="text-center text-danger">**Approval Rejected**</p>
                                        
                                    :
                                    <>
                                        <p className="text-center text-warning">**Approval Pending**</p>
                                        <p className="text-center"><b className="text-danger">Note:</b> Kindly wait for approval</p>
                                    </>
                                :
                                <>
                                    <p className="text-center"><b className="text-danger">Note:</b> Kindly update your profile</p>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <div className='row mt-2'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Vendor Code</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='text'
                                                        name='vendorCode'
                                                        className='form-control mt-1'
                                                        disabled={true}
                                                        value={inputDetails.code || ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>GST No</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='text'
                                                        name='gst'
                                                        className='form-control mt-1'
                                                        required
                                                        placeholder='Enter GST Number'
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Photo</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='file'
                                                        name='photo'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Company Pancard</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='file'
                                                        name='pancard'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Company Address</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <textarea
                                                        name='address'
                                                        className='form-control mt-1'
                                                        placeholder='Enter Company Address'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Others</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <textarea
                                                        name='companyDetails'
                                                        className='form-control mt-1'
                                                        placeholder='Enter Others'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className='row mt-2'>
                                                <div className='col-md-8'>
                                                    <button type="button" onClick={CommonFunction} className="btn btn-primary">Submit</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='form-group'>
                                            <div className='row mt-2'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Financial Document</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='file'
                                                        name='financialDetails'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>ROC</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='file'
                                                        name='roc'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className='mt-3'>Partnership Lead / AOE / MOA</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <input
                                                        type='file'
                                                        name='partnerShip'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <label className=''>Company Team</label>
                                                </div>
                                                <div className='col-md-8'>
                                                    <textarea
                                                        name='companyTeam'
                                                        className='form-control mt-1'
                                                        placeholder='Enter Company Team'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                    </form>
                </div>
            </article>
        </>
    );
};
