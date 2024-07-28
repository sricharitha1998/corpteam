import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../pagination';
import { useParams } from 'react-router-dom';
import Footer from '../footer';

function InvoiceApproval() {
    const { id, level } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(` http://93.127.185.34:4000/invoice/getDocuments/${id}`, {
                    method: 'GET',
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setDetails(result);
                console.log('Files uploaded successfully:', result);
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        }
        provInfo();
    }, [id]);

    const handleCheckboxChange = (event) => {
        const { name, value, checked } = event.target;
        setApprovals(prevApprovals => {
            const updatedApprovals = prevApprovals.filter(item => item.key !== name);
            if (checked) {
                const existingApproval = prevApprovals.find(item => item.key === name);
                if (existingApproval) {
                    updatedApprovals.push({ ...existingApproval, status: value });
                } else {
                    updatedApprovals.push({ key: name, status: value, comments: "" });
                }
            }
            return updatedApprovals;
        });
    };

    const handleCommentChange = (event) => {
        const { name, value } = event.target;
        setApprovals(prevApprovals => {
            const updatedApprovals = prevApprovals.filter(item => item.key !== name);
            const existingApproval = prevApprovals.find(item => item.key === name);
            if (existingApproval) {
                updatedApprovals.push({ ...existingApproval, comments: value });
            } else {
                updatedApprovals.push({ key: name, comments: value, status: "" });
            }
            return updatedApprovals;
        });
    };
    
    const handleSubmit = async () => {
        try {
            const isApproved = approvals.every(item => item.status);
            if(isApproved && approvals.length === 3){
                console.log("detailssss", details._id)
            const response = await fetch(` http://93.127.185.34:4000/invoice/sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({ approvals: JSON.stringify(approvals), level, id: details._id })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if(result){
                alert("Approval Submitted Successfully")
            }
        }else{
            alert("Fill all file status")
        }
        } catch (error) {
            console.error('Error submitting checkboxes:', error);
        }
    }

  return (
    <div fontSetting>
      <div className="m-5">
        <div className="container-fluid">
          <div className="row page-titles">
            <div className="col-lg-12">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Document Name</th>
                        <th scope="col">Document</th>
                        <th scope="col">Approve</th>
                        <th scope="col">Reject</th>
                        <th scope="col">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                                <td className="noBorder">Work Closure Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` http://93.127.185.34:4000/public/invoice/${details?.wcf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.wcf}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="wcf" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="wcf" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="wcf" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Invoice Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` http://93.127.185.34:4000/public/invoice/${details?.invoiceCopy}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.invoiceCopy}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="invoiceCopy" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="invoiceCopy" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="invoiceCopy" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Supporting Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` http://93.127.185.34:4000/public/invoice/${details?.supportingDoc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.supportingDoc}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="supportingDoc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="supportingDoc" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="supportingDoc" onChange={handleCommentChange} /></td>
                            </tr>
                      
                    </tbody>
                  </table>
                  <div className='container row col-md-12 my-5'>
                    <div className='col-md-2'>
                        <button className='btn btnColor text-white' onClick={handleSubmit}>Submit</button>
                    </div>
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

export default InvoiceApproval;
