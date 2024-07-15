import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Card, Table, Button } from '@themesberg/react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../assets/css/dashboard.css';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export const PurchaseOrder = () => {
      
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState({status: null});
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

        const userInfo = await fetch(`http://localhost:4000/users/getUsers/vendor`);
      const res = await userInfo.json();
      setVendors(res?.users)
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if(location?.state?.data && location?.state?.services){
                setServices(location?.state?.services)
                setData(location?.state?.data)
                const userInfo = await fetch(`http://localhost:4000/vendor/getDetails/${location?.state?.data?.vendorID}`);
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
        
        if(name === "vendorID"){
            const SplitValue = value.split("-")
            setData({
                ...data,
                [name]: SplitValue[0]
            });
            const userInfo = await fetch(`http://localhost:4000/vendor/getDetails/${SplitValue[0]}`);
            const res = await userInfo.json();
            console.log("res",res)
            setAddress(res?.details?.address)  
            setVendorName(SplitValue[1])          
        }else{
            setData({
                ...data,
                [name]: value
            });
        }
        
    };
    
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const payload = { ...data, services };
            const response = await fetch('http://localhost:4000/workOrder/insert', {
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
            if(result){
                window.location.reload();
            }
            
        } catch (error) {
            console.error('Error uploading files:', error);
        }

        const doc = new jsPDF();

        doc.text('Purchase Order', 20, 20);
        doc.text(`Work Order No: ${data.workOrderNumber}`, 20, 30);
        doc.text(`Building Name: ${data.buildingName || ''}`, 20, 40);

        const tableColumn = ["S.No", "Service Description", "Service Code", "UOM", "Quantity"];
        const tableRows = [];

        services.forEach((service, index) => {
            const serviceData = [
                index + 1,
                service.description,
                service.code,
                service.uom,
                service.quantity,
            ];
            tableRows.push(serviceData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 50 });

        doc.save('purchase_order.pdf');
    };

    return (
        <>
       <Sidebar />
      <main className="content">
        <Navbar />
        <article>
        {userDetails?.role === "admin" ? (
            <Card border="light" className="shadow-sm">
                <Card.Body className="pb-0">
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    
                                    <h7>Work Order No:</h7>
                                </div>
                                <div className='col-md-8'>
                                    <input className='form-control mx-2' value={data?.workOrderNumber} name="workOrderNumber" type='text' onChange={onChangeDetails} disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <h7>Building Name: </h7>
                                </div>
                                <div className='col-md-8'>
                                    <input className='form-control mx-2' name="buildingName" type='text' onChange={onChangeDetails} defaultValue={data?.buildingName}/>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                        <br />
                            <div className='row'>
                                <div className='col-md-4'>
                                    <h7>Select Vendor: </h7>
                                </div>
                                <div className='col-md-8'>
                                <select className='form-control mx-2' name="vendorID" onChange={onChangeDetails}>
                                    <option value="">Select Vendor</option>
                                    {vendors && vendors.map((vendor) => (
                                        <option key={vendor._id} selected={data?.vendorID === vendor._id } value={vendor._id+"-"+vendor.username}>{vendor.username}</option>
                                    ))}
                                </select> 
                                </div>
                            </div>
                        </div>
                        {Address &&
                        <div className='col-md-6'>
                        <br />
                        <div className='row'>
                        <div className='col-md-4'>
                                    <h7>Vendor Address: </h7>
                                </div>
                                <div className='col-md-8'>
                                    <p>{Address}</p>
                                </div>
                        </div>
                        </div>
                        }
                    </div>
                    <br />
                    <Table responsive className="table-centered table-nowrap rounded mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th className="border-0">S.No</th>
                                <th className="border-0">Service Description</th>
                                <th className="border-0">Service Code</th>
                                <th className="border-0">UOM</th>
                                <th className="border-0">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((service, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input className='form-control' name="description" type='text' onChange={(e) => handleServiceChange(e, index)} defaultValue={service?.description} />
                                    </td>
                                    <td>
                                        <input className='form-control mx-2' name="code" type='text' defaultValue={service?.code} onChange={(e) => handleServiceChange(e, index)} />
                                    </td>
                                    <td>
                                        <input className='form-control mx-2' name="uom" type='text' defaultValue={service?.uom} onChange={(e) => handleServiceChange(e, index)} />
                                    </td>
                                    <td>
                                        <input className='form-control mx-2' name="quantity" type='text' defaultValue={service?.quantity} onChange={(e) => handleServiceChange(e, index)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <br />
                    <div className='row'>
                        <div className='col-md-10'></div>
                        <div className='col-md-2'>
                        <Button variant="primary" onClick={handleAddService} className="print-hide">
                        <FontAwesomeIcon icon={faPlus} /> Add Service
                    </Button>
                        </div>
                    </div>
                    
                    <button type="button" onClick={handleSubmit} className="btn btn-primary m-2 print-hide">Submit</button>
                    <Button variant="secondary" onClick={() => navigate("/printPurchase", {state: {data, services, VendorName }})} className="ml-2 print-hide">Preview Print</Button>
                </Card.Body>
            </Card>
        )
        : <h5 className='text-center text-danger'>You do not have permission to view this page.</h5>
            
            }
           
            </article>
        </main>
        </>
    );
};
