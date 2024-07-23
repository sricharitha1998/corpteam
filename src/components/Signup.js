import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import '../assets/css/dashboard.css'

export default () => {

    const navigate = useNavigate();
    const [inputDetails, setInputDetails] = useState({});
    const date = new Date();
    const [getModal, setModal] = useState(true);
    const [userType, setUserType] = useState();
    const [vendors, setVendors] = useState();
    const [VendorId, setVendorId] = useState();
    const [userdetails, setUserDetails] = useState({ role: 'vendor', status: 1 })

    useEffect(() => {
        const fetchData = async () => {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const RandomCode = "CTS" + month + year + Math.floor(10 + Math.random() * 90);
            setInputDetails({ ...inputDetails, code: RandomCode });
            const userInfo = await fetch(`http://localhost:4000/users/getUsers/vendor`);
            const res = await userInfo.json();
            console.log("res", res)
            setVendors(res?.users)
        }
        fetchData();
    }, []);

    const validateForm = () => {
        const requiredFields = ['email', 'roc', 'photo', 'registration', 'partnershipLead', 'pancard', 'aadhar', 'phone', 'companyDetails', 'financialDoc'];

        for (const field of requiredFields) {
            if (!inputDetails[field]) {
                alert(`Please fill in the ${field} field.`);
                return false;
            }
        }

        if (!/^\d{10}$/.test(inputDetails.phone)) {
            alert('Phone number must be exactly 10 digits.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        // if (!validateForm()) return;
        if (userType === "existing") {

            CommonFunction(VendorId)
        } else {

            const response = await fetch('http://localhost:4000/users/registration', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                body: JSON.stringify(userdetails),
            });

            const data = await response.json();
            console.log("data", data)

            if (data) {
                CommonFunction(data.user._id)
            }
        }
    };

    console.log("userdetails", userdetails)

    const CommonFunction = async (ID) => {
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
        formData.append("vendor_id", ID)

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

    const OnChangeDetails = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    return (

        <div className='row col-md-12 signupBg'>
            <div className='col-md-2'></div>
            <div className='col-md-8'>
                <div class="card p-5 my-5">
                    <div class="card-header sticky-header">
                        <h5>Registration</h5>
                    </div>
                    <form encType='multipart/form-data'>
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
                            <label className='mt-3'>Email</label>
                            </div>
                            <div className='col-md-8'>
                            <input
                                            type='email'
                                            name='email'
                                            className='form-control mt-1'
                                            placeholder='Enter Email'
                                            required
                                            onChange={OnChangeDetails}
                                        />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4'>
                            <label className='mt-3'>Password</label>
                            </div>
                            <div className='col-md-8'>
                            <input
                                            type='password'
                                            name='password'
                                            className='form-control mt-1'
                                            placeholder='Enter Password'
                                            required
                                            onChange={OnChangeDetails}
                                        />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4'>
                            <label className='mt-3'>Mobile Number</label>
                            </div>
                            <div className='col-md-8'>
                            <input
                                            type='number'
                                            name='MobNumber'
                                            className='form-control mt-1'
                                            placeholder='Enter Mobile Number'
                                            required
                                            onChange={OnChangeDetails}
                                        />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-4'>
                            <label className='mt-3'>Username</label>
                            </div>
                            <div className='col-md-8'>
                            <input
                                            type='text'
                                            name='username'
                                            className='form-control mt-1'
                                            placeholder='Enter Username'
                                            required
                                            onChange={OnChangeDetails}
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
                            <label className='mt-3'>Company Team</label>
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
                            <div className='col-md-4'></div>
                            <div className='col-md-8'>
                            <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit</button>
                        
                            </div>
                        </div>

                            </div>
                    </form>
                </div>
            </div>

            {/* <Modal
                isOpen={getModal}
                onRequestClose={() => setModal(false)}
                style={{
                    content: {
                        width: '50%',
                        margin: 'auto',
                        height: 'fit-content',
                        padding: '30px',
                    }
                }}
            >
                <h5 className='text-center'>Select User Type</h5>
                <br />
                <form>
                    <div className="row col-md-12">
                        <div className="col-md-6 text-center pointerCss" onClick={() => { setUserType("existing"); setModal(false) }}>
                            <p className='dashboard'>Existing User</p>
                        </div>
                        <div className="col-md-6 text-center pointerCss" onClick={() => { setUserType("new"); setModal(false) }}>
                            <p className='dashboard'>New User</p>
                        </div>
                    </div>
                </form>
            </Modal> */}
        </div>

    );
};
