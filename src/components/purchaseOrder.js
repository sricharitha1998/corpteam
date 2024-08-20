import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Footer from './footer';
import { PDFfile } from './functions/pdfFile';

function PurchaseOrder() {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState({ status: null });
    const [services, setServices] = useState([{ code: '', uom: '', description: '', quantity: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [Address, setAddress] = useState("");
    const itemsPerPage = 10; // Adjust this value to set items per page
    const [vendors, setVendors] = useState()
    const [VendorName, setVendorName] = useState()
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const RandomCode = "CTS" + month + year + Math.floor(10 + Math.random() * 90);
            setData({ ...data, workOrderNumber: RandomCode });

            const userInfo = await fetch(` /api/users/getUsers/vendor`);
            const res = await userInfo.json();
            setVendors(res?.users)
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (location?.state?.data && location?.state?.services) {
                setServices(location?.state?.services)
                setData(location?.state?.data)
                const userInfo = await fetch(` /api/vendor/getDetails/${location?.state?.data?.vendorID}`);
                const res = await userInfo.json();
                setAddress(res?.details?.address)
                setVendorName(location?.state?.VendorName)
            }
        };

        fetchData();

    }, [location?.state])

    useEffect(() => {
        const details = localStorage.getItem('Details');
        if (!details) {
            navigate('/');
        } else {
            setUserDetails(JSON.parse(details));
        }
    }, []);

    const handleAddService = () => {
        setServices([...services, { code: '', uom: '', description: '', quantity: '' }]);
    };

    const handleServiceChange = (e, index) => {
        const { name, value } = e.target;
        const newServices = [...services];
        newServices[index][name] = value;
        setServices(newServices);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);

    const onChangeDetails = async (event) => {
        const { name, value } = event.target;

        if (name === "vendorID") {
            const SplitValue = value.split("-")
            setData({
                ...data,
                [name]: SplitValue[0]
            });
            const userInfo = await fetch(` /api/vendor/getDetails/${SplitValue[0]}`);
            const res = await userInfo.json();
            setAddress(res?.details?.address)
            setVendorName(SplitValue[1])
        } else {
            setData({
                ...data,
                [name]: value
            });
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            for (const service of services) {
                if (!service.code || !service.uom || !service.description || !service.quantity) {
                    alert('All service fields are required.');
                    return;
                }
            }

            if (!data?.routeLength || !data?.vendorID || !data?.buildingArea) {
                alert('All fields are required.');
                return;
            }

            // const formattedDate = new Date().toLocaleDateString();
            const payload = { ...data, services, date: new Date() };
            const response = await fetch(' /api/workOrder/insert', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("result", result)
            if (result) {
                window.location.reload();
            }

        } catch (error) {
            console.error('Error uploading files:', error);
        }
        const getAllData = { ...data, ...services }
        PDFfile(getAllData)

    };

    console.log("data", data)

    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Purchase Order</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-6">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Work Order No  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="text" className="form-control" id="" value="CTS072417" required="" disabled="true"/>
                                                        <div className="invalid-feedback">
                                                            CTS0724000
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Home Pass No
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="text" onChange={onChangeDetails} className="form-control" id="validationCustom02" placeholder="Enter Home Pass Number" required="" defaultValue={data?.homePass} name="homePass" />
                                                        
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Select Vendors  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <select className='form-control mx-2' name="vendorID" onChange={onChangeDetails}>
                                                            <option value="">Select Vendor</option>
                                                            {vendors && vendors.map((vendor) => (
                                                                <option key={vendor._id} selected={data?.vendorID === vendor._id} value={vendor._id + "-" + vendor.username}>{vendor.username}</option>
                                                            ))}
                                                        </select>
                                                        <div className="invalid-feedback">
                                                            Please select a one.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom06">Building Area <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="text" className="form-control" id="validationCustom06" onChange={onChangeDetails} placeholder="Building Area" required="" name="buildingArea" defaultValue={data?.buildingArea} />
                                                        <div className="invalid-feedback">
                                                            Please enter a Currency.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom07">Route Length  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="text" className="form-control" id="validationCustom07" onChange={onChangeDetails} name="routeLength" placeholder="Route Length" required="" defaultValue={data?.routeLength} />
                                                        <div className="invalid-feedback">
                                                            Please enter a url.
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.NO</th>
                                                <th scope="col">Services Description</th>
                                                <th scope="col">Service Code</th>
                                                <th scope="col">UOM</th>
                                                <th scope="col">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((service, index) => (
                                                <tr key={index}>
                                                    <td className="noBorder">{index + 1}</td>
                                                    <td className="noBorder">
                                                        <input className='form-control' name="description" type='text' onChange={(e) => handleServiceChange(e, index)} defaultValue={service?.description} />
                                                    </td>
                                                    <td className="noBorder">
                                                        <input className='form-control mx-2' name="code" type='text' defaultValue={service?.code} onChange={(e) => handleServiceChange(e, index)} />
                                                    </td>
                                                    <td className="noBorder">
                                                        <input className='form-control mx-2' name="uom" type='text' defaultValue={service?.uom} onChange={(e) => handleServiceChange(e, index)} />
                                                    </td>
                                                    <td className="noBorder">
                                                        <input className='form-control mx-2' name="quantity" type='text' defaultValue={service?.quantity} onChange={(e) => handleServiceChange(e, index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <a href="javascript:void(0);" className="btn btn-success text-white mb-2" onClick={handleAddService}>
                                            Add Services<svg className="ms-4 scale3" width="16" height="16" viewbox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9638 11.5104L16.9721 14.9391L3.78954 1.7565C3.22815 1.19511 2.31799 1.19511 1.75661 1.7565C1.19522 2.31789 1.19522 3.22805 1.75661 3.78943L14.9392 16.972L11.5105 16.9637L11.5105 16.9637C10.7166 16.9619 10.0715 17.6039 10.0696 18.3978C10.0677 19.1919 10.7099 19.8369 11.5036 19.8388L11.5049 19.3388L11.5036 19.8388L18.3976 19.8554L18.4146 19.8555L18.4159 19.8555C18.418 19.8555 18.42 19.8555 18.422 19.8555C19.2131 19.8533 19.8528 19.2114 19.8555 18.4231C19.8556 18.4196 19.8556 18.4158 19.8556 18.4117L19.8389 11.5035L19.8389 11.5035C19.8369 10.7097 19.1919 10.0676 18.3979 10.0695C17.604 10.0713 16.9619 10.7164 16.9638 11.5103L16.9638 11.5104Z" fill="white" stroke="white"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="row mt-4 align-items-center">

                                    <div className="col-sm-6 text-sm-right text-start">
                                        <a href="javascript:void(0);" className="btn btnColor text-white mb-2" onClick={handleSubmit}>
                                            Submit
                                        </a>
                                        <a href="javascript:void(0);" className="btn text-white btnColor2 ms-4 mb-2"  onClick={() => navigate("/printPurchase", {state: {data, services, VendorName }})}>
                                            Preview Print
                                        </a>
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

export default PurchaseOrder;