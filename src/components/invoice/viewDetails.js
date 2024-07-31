import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../pagination';
import Footer from '../footer';
import { Capitalized } from '../functions/capitalized';

function InvoiceViewDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [inputDetails, setInputDetails] = useState({});
    const [approvals, setApprovals] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
        if (location.state) {
            const { id, approvals } = location.state;
            setId(id);
            setApprovals(approvals);
        } else {
            console.warn('No location state found');
        }
    }, [location.state]);
    
    const onChangeFunction = (e) => {
        const { name, files: selectedFiles } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: selectedFiles[0],
        }));
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const [key, value] of Object.entries(inputDetails)) {
            const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
            const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
            formData.append(key, newFile);
        }

        try {
            const response = await fetch(` https://pmsapi.corpteamsolutions.net/invoice/updateDocs/${id}`, {
                method: 'PATCH',
                headers: {
                    "Accept": "application/json, text/plain, */*"
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.status === true) {
                alert("Thanks For Uploading Invoice Form");
                window.location.reload();
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }

    const allApproved = approvals.every(approval => approval.status === "Approved");


  return (
    <div fontSetting>
      <Navbar />
      <div className="content-body">
        <div className="container-fluid">
          
          <div className="row page-titles">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Invoice Approval Status </li>
            </ol>
          </div>
          <div className="row page-titles">
            <div className="col-lg-12">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S.NO</th>
                        <th scope="col">Document</th>
                        <th scope="col">Status  </th>
                        <th scope="col">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                    {approvals.length > 0 ? (
                        approvals.map((approval, index) => (
                        <tr key={approval._id}>
                        <th className="noBorder">{approval.key}</th>
                          <td className="noBorder">{Capitalized(approval.status)}</td>
                          <td className="noBorder">{approval.comments ? approval.comments : "No Comments"}</td>
                          <td className="noBorder">{approval.status !== "Approved" && (
                                                        <input
                                                            type="file"
                                                            className="inputFiled form-control"
                                                            name={approval.key}
                                                            onChange={onChangeFunction}
                                                            required
                                                        />
                                                    )}
                          </td>
                        </tr>
                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No approvals are found</td>
                                        </tr>
                                    )}
                      
                    </tbody>
                  </table>
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

export default InvoiceViewDetails;
