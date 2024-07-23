
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table } from '@themesberg/react-bootstrap';

export default () => {
    const { id } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(`http://localhost:4000/vendor/getVendorDetails/${id}`, {
                    method: 'GET',
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log("response", result)
                setDetails(result?.details);
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
            if(isApproved && approvals.length === 9){
                console.log("detailssss", details._id)
            const response = await fetch(`http://localhost:4000/vendor/updateApproval`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({ approvals: JSON.stringify(approvals), id: details._id })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if(result){
                alert("Approval Submitted Successfully")
                window.location.reload();
            }
        }else{
            alert("Fill all file status")
        }
        } catch (error) {
            console.error('Error submitting checkboxes:', error);
        }
    }

    return (
        <>
            <Card border="light" className="shadow-sm m-5">
                <Card.Body className="pb-0">
                <p><b>Vendor Code: </b>{details?.vendorCode}</p>
                    <Table responsive className="table-centered table-nowrap rounded mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th className="border-0">Document Name</th>
                                <th className="border-0">Document</th>
                                <th className="border-0">Approve</th>
                                <th className="border-0">Reject</th>
                                <th className="border-0">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>GST No</td>
                                <td>
                                    {details?.gst}
                                </td>
                                <td>
                                    <input type="radio" name="gst" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="gst" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="gst" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Financial Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.financialDetails}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.financialDetails}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="financialDetails" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="financialDetails" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="financialDetails" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>ROC Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.roc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.roc}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="roc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="roc" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="roc" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>photo</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.photo}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.photo}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="photo" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="photo" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="photo" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Partnership Lead / AOE / MOA</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.partnerShip}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.partnerShip}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="partnerShip" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="partnerShip" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="partnerShip" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Company Pancard</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.pancard}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.pancard}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="pancard" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="pancard" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="pancard" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Company Team</td>
                                <td>
                                        {details?.companyTeam}
                                </td>
                                <td>
                                    <input type="radio" name="companyTeam" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="companyTeam" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="companyTeam" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Company Address</td>
                                <td>
                                        {details?.address}
                                </td>
                                <td>
                                    <input type="radio" name="address" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="address" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="address" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Others</td>
                                <td>
                                        {details?.companyDetails}
                                </td>
                                <td>
                                    <input type="radio" name="companyDetails" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="companyDetails" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="companyDetails" onChange={handleCommentChange} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className='container row col-md-12 my-5'>
                    <div className='col-md-2'>
                        <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
                </Card.Body>
            </Card>
        </>
    );
};
