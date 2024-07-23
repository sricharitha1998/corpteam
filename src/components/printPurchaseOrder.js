import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table, Button } from '@themesberg/react-bootstrap';
import 'jspdf-autotable';
import '../assets/css/dashboard.css'

export const PrintPurchaseOrder = () => {
      
    const location = useLocation();
    const navigate = useNavigate();
   
    const [services, setServices] = useState()
    const [Details, setDetails] = useState()
    
    useEffect(() => {
        if(location?.state?.data && location?.state?.services){
            setServices(location?.state?.services)
            setDetails(location?.state?.data)
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

    const TableRow = (props) => {
        const { code, uom, description, quantity } = props;
        const navigate = useNavigate();
        
        return (
          <tr>
            <td>
              <Card.Link href="#" className="text-dark fw-bold">{description}</Card.Link>
            </td>
            <td>
              <Card.Link href="#" className="text-dark fw-bold">{code}</Card.Link>
            </td>
            <td>
              <Card.Link href="#" className="text-dark fw-bold">{uom}</Card.Link>
            </td>
            <td>
              <Card.Link href="#" className="text-dark fw-bold">{quantity}</Card.Link>
            </td>
          </tr>
        );
      };

    return (
        <>
            <Card border="light" className="shadow-sm m-5 p-3">
            <Card.Body className="pb-0">
              <div className='row col-md-12'>
              <h4 className='text-center'>Purchase Order</h4>
              <div className='col-md-4'><h6>Work Order Number: {Details?.workOrderNumber}</h6></div>
              <div className='col-md-4'><h6>Home Pass Number: {Details?.homePass}</h6></div>
              <div className='col-md-4'><h6>Route Length: {Details?.routeLength}</h6></div>
              <div className='col-md-4'><h6>Vendor Name: {location?.state?.VendorName}</h6></div>
              <div className='col-md-4'><h6>Building Area: {Details?.buildingArea}</h6></div>
            
              </div>
              
              <Table responsive className="table-centered table-nowrap rounded mb-0">
                <thead className="thead-light">
                  <tr>
                    <th className="border-0">Description</th>
                    <th className="border-0">Code</th>
                    <th className="border-0">UOM</th>
                    <th className="border-0">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {services?.map(pt => <TableRow key={`page-traffic-${pt._id}`} {...pt} />)}
                </tbody>
              </Table>
              <br />
              <Button variant="primary" onClick={() => navigate("/purchaseOrder", {state: {data: Details, services, VendorName: location?.state?.VendorName }})} className="mx-2 print-hide">Back</Button>
              <Button variant="secondary" onClick={handlePrint} className="ml-2 print-hide">Print</Button>
            </Card.Body>
          </Card> 
        </>
    );
};
