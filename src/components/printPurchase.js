import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/img/logo/dashboard-logo.png';

function PrintPurchase() {
    const location = useLocation();
    const navigate = useNavigate();
   
    const [services, setServices] = useState()
    const [supplies, setSupplies] = useState()
    const [Details, setDetails] = useState()
    
    useEffect(() => {
        if(location?.state?.data && location?.state?.services){
            setServices(location?.state?.services)
            setDetails(location?.state?.data)
            setSupplies(location?.state?.supplies)
        }
    }, [location?.state])

    const handlePrint = () => {
        document.querySelectorAll('.print-hide').forEach(button => {
            button.classList.add('no-print');
        });
    
        // Print the page
        window.print();
    
        // Remove the no-print class after printing
        document.querySelectorAll('.print-hide').forEach(button => {
            button.classList.remove('no-print');
        });
    };

    return (
        <div className='fontSetting'>

            <div className="m-5">
                <div className="container-fluid">
                    <div className="">
                        <div className="col-lg-12">

                            <div className="card-body">
                                <div className="form-validation">
                                <div className='row col-md-12'>
                                <div className="text-center mb-4">
                                <img src={logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
                            </div>
              <h4 className='text-center'>Purchase Order</h4>
              <div className='col-md-4 mt-5'><h6>Work Order Number: {Details?.workOrderNumber}</h6></div>
              <div className='col-md-4 mt-5'><h6>Home Pass Number: {Details?.homePass}</h6></div>
              <div className='col-md-4 mt-5'><h6>Route Length: {Details?.routeLength}</h6></div>
              <div className='col-md-4'><h6>Service Partner Name: {location?.state?.VendorName}</h6></div>
              <div className='col-md-4'><h6>Building Area: {Details?.buildingArea}</h6></div>
            
              </div>
                                      
                                </div>
                                <h4 className='text-center'>Services</h4>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.NO</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Code</th>
                                                <th scope="col">UOM</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services?.map((service, index) => (
                                                <tr key={index}>
                                                    <td className="noBorder">{index + 1}</td>
                                                    <td className="noBorder table-cell" style={{ whiteSpace: 'normal', wordWrap: 'break-word', width:"60%" }}>
                                                    {service.description}
                                                    </td>
                                                    <td className="noBorder">
                                                        {service.code}
                                                    </td>
                                                    <td className="noBorder">
                                                       {service.uom}
                                                    </td>
                                                    <td className="noBorder" >
                                                        {service.quantity}
                                                    </td>
                                                    <td className="noBorder" >
                                                        {service.rate}
                                                    </td>
                                                </tr>
                                            ))}
                                             <tr>
    <td colSpan="5" className="text-end"><strong>Total</strong></td>
    <td className="noBorder">
    {location?.state?.serviceTotalRate}
    </td>
</tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h4 className='text-center'>Supplies</h4>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.NO</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Code</th>
                                                <th scope="col">UOM</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {supplies?.map((supply, index) => (
                                                <tr key={index}>
                                                    <td className="noBorder">{index + 1}</td>
                                                    <td className="noBorder" style={{ whiteSpace: 'normal', wordWrap: 'break-word', width:"60%" }}>
                                                    {supply.description}
                                                    </td>
                                                    <td className="noBorder">
                                                        {supply.code}
                                                    </td>
                                                    <td className="noBorder">
                                                       {supply.uom}
                                                    </td>
                                                    <td className="noBorder" >
                                                        {supply.quantity}
                                                    </td>
                                                    <td className="noBorder" >
                                                        {supply.rate}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
    <td colSpan="5" className="text-end"><strong>Total</strong></td>
    <td className="noBorder">
    {location?.state?.supplyTotalRate}
    </td>
</tr>
                                        </tbody>
                                    </table>
                                </div>
                            
                                <div className="row mt-4 align-items-center">

                                    <div className="col-sm-6 text-sm-right text-start">
                                        <a href="javascript:void(0);" className="btn btnColor text-white mb-2" onClick={() => navigate("/purchaseOrder", {state: {data: Details, services, VendorName: location?.state?.VendorName, supplies }})}>
                                        Back
                                        </a>
                                        <a href="javascript:void(0);" className="btn text-white btnColor2 ms-4 mb-2" onClick={handlePrint}>Print
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default PrintPurchase;
