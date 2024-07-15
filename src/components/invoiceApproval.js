
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table } from '@themesberg/react-bootstrap';

export default () => {
    const { id, level } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(`http://localhost:4000/invoice/getDocuments/${id}`, {
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
            const response = await fetch(`http://localhost:4000/invoice/sendEmail`, {
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
        <>
            <Card border="light" className="shadow-sm m-5">
                <Card.Body className="pb-0">
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
                                <td>Work Closure Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/invoice/${details?.wcf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.wcf}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="wcf" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="wcf" value="Not Approve" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="wcf" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Invoice Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/invoice/${details?.invoiceCopy}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.invoiceCopy}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="invoiceCopy" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="invoiceCopy" value="Not Approve" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="invoiceCopy" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Supporting Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/invoice/${details?.supportingDoc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.supportingDoc}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="supportingDoc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="supportingDoc" value="Not Approve" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="supportingDoc" onChange={handleCommentChange} /></td>
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
