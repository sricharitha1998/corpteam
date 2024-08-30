import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/img/logo/dashboard-logo.png';
import ReactToPrint from 'react-to-print';

function PrintPurchase() {
    const location = useLocation();
    const navigate = useNavigate();
    const componentRef = useRef();
    const [services, setServices] = useState()
    const [supplies, setSupplies] = useState()
    const [Details, setDetails] = useState()

    useEffect(() => {
        if (location?.state?.data && location?.state?.services) {
            setServices(location?.state?.services)
            setDetails(location?.state?.data)
            setSupplies(location?.state?.supplies)
        }
    }, [location?.state])

    return (
        <div className='fontSetting'>

            <div className="m-5" ref={componentRef}>
                <div className="container-fluid">
                    <div className="">
                        <div className="col-lg-12">
                        
                            <div className="card-body">
                                
                                <div className="form-validation">
                                    <div className='row col-md-12'>
                                        <div className="text-center mb-4">
                                            <img src={logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
                                        </div>

                                    </div>

                                </div>

                                <div className="print-container">
                                <div className="table-wrapper">
                                        <table id="customers" style={{ fontSize: '13px' }}>
                                            <tr>
                                                <th colSpan="2" className='text-center'>Service Partner Details</th>

                                            </tr>
                                            <tr>
                                                <td>Name</td>
                                                <td className="capitalize-first">{location?.state?.VendorName}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td className="capitalize-first">{location?.state?.Address}</td>
                                            </tr>
                                           
                                            <tr>
                                                <td>GST</td>
                                                <td>{location?.state?.getGst}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="table-wrapper">
                                    <table id="customers" style={{ fontSize: '13px' }}>
                                            <tr>
                                                <th colSpan="2" className='text-center'>Purchase Order Details</th>

                                            </tr>
                                            <tr>
                                                <td>Work Order Number</td>
                                                <td>{Details?.workOrderNumber}</td>
                                            </tr>
                                            <tr>
                                                <td>Home Pass Number</td>
                                                <td>{Details?.homePass}</td>
                                            </tr>
                                            <tr>
                                                <td>Route Length</td>
                                                <td>{Details?.routeLength}</td>
                                            </tr>
                                            <tr>
                                                <td>Building Area</td>
                                                <td>{Details?.buildingArea}</td>
                                            </tr>

                                        </table>
                                    </div>
                                </div>
                                        
                                <table id="customers" style={{ fontSize: '13px' }}>
                                    <tr>
                                        <td colSpan="6" className='text-center'><strong>Service Items</strong></td>

                                    </tr>
                                    <tr>
                                        <th>S.NO</th>
                                        <th>Description</th>
                                        <th>Code</th>
                                        <th>UOM</th>
                                        <th>Quantity</th>
                                        <th>Rate</th>
                                    </tr>
                                    {services?.map((service, index) => (
                                        <tr key={index}>
                                            <td className="noBorder">{index + 1}</td>
                                            <td className="noBorder table-cell" style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: "60%" }}>
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
                                </table>
                               
                                <table id="customers" style={{ fontSize: '13px' }}>
                                    <tr>
                                        <td colSpan="6" className='text-center'><strong>Supply Items</strong></td>

                                    </tr>
                                    <tr>
                                        <th >S.NO</th>
                                        <th>Description</th>
                                        <th>Code</th>
                                        <th>UOM</th>
                                        <th>Quantity</th>
                                        <th>Rate</th>
                                    </tr>
                                    {supplies?.map((supply, index) => (
                                        <tr key={index}>
                                            <td className="noBorder">{index + 1}</td>
                                            <td className="noBorder" style={{ whiteSpace: 'normal', wordWrap: 'break-word', width: "60%" }}>
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
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="row mt-4 align-items-center">

                <div className="col-sm-5"></div>
                <div className="col-sm-2 mx-5 text-sm-right text-start">
                    <a href="javascript:void(0);" className="btn btnColor text-white mb-2 print-hide" onClick={() => navigate("/purchaseOrder", { state: { data: Details, services, VendorName: location?.state?.VendorName, supplies } })}>
                        Back
                    </a>
                    <ReactToPrint
                        trigger={() => <button className="btn text-white btnColor2 ms-4 mb-2 print-hide">Print</button>}
                        content={() => componentRef.current}
                    />
                    {/* <a href="javascript:void(0);" className="btn text-white btnColor2 ms-4 mb-2 print-hide" onClick={handlePrint}>Print
    </a> */}
                </div>
            </div>

        </div>
    );
}

export default PrintPurchase;
