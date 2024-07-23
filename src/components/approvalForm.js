
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table } from '@themesberg/react-bootstrap';

export const ApprovalTable = () => {
    const { id, level } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(`http://localhost:4000/workClosure/getDocuments/${id}`, {
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
console.log("details", details)
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
            if(isApproved && approvals.length === 12+details?.others.length){
            const response = await fetch(`http://localhost:4000/workClosure/SendEmailVendor`, {
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
            console.log('Checkboxes submitted successfully:', result);
            alert("Approval Submitted Successfully")
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
                                <td>PO Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.po}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.po}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="po" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="po" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="po" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>NESA Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.nesa}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.nesa}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="nesa" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="nesa" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="nesa" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Inventory Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.inventory}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.inventory}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="inventory" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="inventory" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="inventory" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>SignUp ABD Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.signupABD}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.signupABD}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="signupABD" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="signupABD" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="signupABD" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Civil At Sign Off Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.civilSignOff}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.civilSignOff}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="civilSignOff" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="civilSignOff" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="civilSignOff" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>MRC Document</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.mrc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.mrc}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="mrc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="mrc" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="mrc" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Official Application Copy</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.officalApp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.officalApp}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="officalApp" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="officalApp" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="officalApp" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Official Demand Note</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.officalDemandNote}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.officalDemandNote}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="officalDemandNote" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="officalDemandNote" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="officalDemandNote" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>DD Channel</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.dd}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.dd}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="dd" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="dd" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="dd" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>Final Order Copy</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.finalOrder}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.finalOrder}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="finalOrder" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="finalOrder" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="finalOrder" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td>SignUp Doc</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.signup}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.signup}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="signup" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="signup" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="signup" onChange={handleCommentChange} /></td>
                            </tr>

                            <tr>
                                <td>SD/BG Doc</td>
                                <td>
                                    <a
                                        href={`http://localhost:4000/public/documents/${details?.sdOrBg}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.sdOrBg}
                                    </a>
                                </td>
                                <td>
                                    <input type="radio" name="sdOrBg" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td>
                                    <input type="radio" name="sdOrBg" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td><input type="text" className='form-control' name="sdOrBg" onChange={handleCommentChange} /></td>
                            </tr>
                            
                            {details?.others?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.key}</td>
                                    <td>
                                        <a
                                            href={`http://localhost:4000/public/documents/${item.value}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.value}
                                        </a>
                                    </td>
                                    <td>
                                        <input type="radio" name={`${item.key}`} value="Approved" onChange={handleCheckboxChange} />
                                    </td>
                                    <td>
                                        <input type="radio" name={`${item.key}`} value="Not Approved" onChange={handleCheckboxChange} />
                                    </td>
                                    <td><input type="text" className='form-control' name={item.key} onChange={handleCommentChange} /></td>
                                </tr>
                            ))}

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
