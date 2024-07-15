import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table } from '@themesberg/react-bootstrap';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export const ViewWCF = () => {
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
            const response = await fetch(`http://localhost:4000/workClosure/updateDocs/${id}`, {
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
                alert("Thanks For Uploading Work Closure Form");
                // window.location.reload();
                navigate("/wcfTables")
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }

    const allApproved = approvals.every(approval => approval.status === "Approved");


    return (
        <>
            <Sidebar />

            <main className="content">
                <Navbar />
                <article>
                    <Card border="light" className="shadow-sm mb-4">
                        <Card.Body className="pb-0">
                            <Table responsive className="table-centered table-nowrap rounded mb-0">
                                <thead className="thead-light">
                                <tr>
                                    <td>Document</td>
                                    <td>Status</td>
                                    <td>Comments</td>
                                </tr>
                                    {approvals.length > 0 ? (
                                        approvals.map((approval, index) => (
                                            <tr key={index}>
                                                <th className="border-0">{approval.key}</th>
                                                <td>{approval.status}</td>
                                                <td >{approval.comments ? approval.comments : "No Comments"}</td>

                                                {approval.status !== "Approved" && (
                                                    <td colSpan="5">
                                                        <input
                                                            type="file"
                                                            className="inputFiled form-control"
                                                            name={approval.key}
                                                            onChange={onChangeFunction}
                                                            required
                                                        />
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : ( 
                                        <tr>
                                            <td colSpan="5">No approvals are found</td>
                                        </tr>
                                    )}
                                </thead>
                            </Table>
                        </Card.Body>
                        {approvals && approvals.length > 0 && !allApproved && (
                        <div className='container row col-md-12 my-2'>
                            <div className='col-md-2'>
                                <button className='btn btn-primary' onClick={HandleSubmit}>Submit</button>
                            </div>
                        </div>
                        )}
                    </Card>
                </article>
            </main>
        </>
    );
};
