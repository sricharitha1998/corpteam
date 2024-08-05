import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';

function ProfileDocs() {

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
            const userInfo = await fetch(` https://93.127.185.34:4000/vendor/getDetails/${JSON.parse(getDetails)?._id}`);
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
        if(inputDetails?.vendorCode && inputDetails?.financialDetails && inputDetails?.gst && inputDetails?.roc && inputDetails?.partnerShip && inputDetails?.companyTeam && inputDetails?.photo && inputDetails?.pancard && inputDetails?.address && inputDetails?.companyDetails){

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

        const response = await fetch(' https://93.127.185.34:4000/vendor/register', {
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
    }else{
        alert("Fill All The Fields")
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
        <div className="fontSetting">
            <div className="row">
                <div className="col-md-1"></div>
                <div className="col-md-10">
                <div className="container-fluid">
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Vendor Profile Documents</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">
                            <div className="card-body">
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
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Vendor Code  <span className="text-danger">*</span>
                                                        
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='text'
                                                        name='vendorCode'
                                                        className='form-control'
                                                        disabled={true}
                                                        value={inputDetails.code || ''}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">GST No <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='text'
                                                        name='gst'
                                                        className='form-control '
                                                        required
                                                        placeholder='Enter GST Number'
                                                        onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Financial Document<span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                         type='file'
                                                         name='financialDetails'
                                                         className='form-control mt-1'
                                                         required
                                                         onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">ROC<span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='file'
                                                        name='roc'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Partnership Lead / AOE / MOA <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='file'
                                                        name='partnerShip'
                                                        className='form-control mt-1'
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Company Team <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <textarea
                                                        name='companyTeam'
                                                        className='form-control mt-1'
                                                        placeholder='Enter Company Team'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Photo  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='file'
                                                        name='photo'
                                                        className='form-control '
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Company Pancard  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input
                                                        type='file'
                                                        name='pancard'
                                                        className='form-control '
                                                        required
                                                        onChange={onChangeFunction}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Company Address  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <textarea
                                                        name='address'
                                                        className='form-control '
                                                        placeholder='Enter Company Address'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Others  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <textarea
                                                        name='companyDetails'
                                                        className='form-control '
                                                        placeholder='Enter Others'
                                                        required
                                                        onChange={onChangeFunction}
                                                    ></textarea>
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="row mt-4 align-items-center">
                                    <div className="col-sm-6 text-sm-right text-start">
                                        <button type="submit" onClick={CommonFunction} className="btn  btnColor text-white mb-2">Submit</button>
                                    </div>
                                </div>
                                </>
                            }
                            </div>
                        </div>

                    </div>
                </div>
           
           
            </div>
            </div>
        </div>
    );
}

export default ProfileDocs;
