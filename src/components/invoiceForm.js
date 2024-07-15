import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default () => {

    const [InputDetails, setInputDetails] = useState({})

    const OnChangeFunction = (e) => {
        const { name, files: selectedFiles } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: selectedFiles[0],
        }));
    };

    const ClickSubmit = async (e) => {
        e.preventDefault();

        try {
            if (InputDetails.wcf && InputDetails.invoiceCopy && InputDetails.supportingDoc) {
                const formData = new FormData();
                for (const [key, value] of Object.entries(InputDetails)) {
                    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                    const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
                    formData.append(key, newFile);
                }
                const details = localStorage.getItem('Details');
                formData.append("vendor_id", JSON.parse(details)._id)

                const response = await fetch('http://localhost:4000/invoice/register', {
                    method: 'POST',
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result?.success) {
                    alert("Invoice Submitted Successfully");
                    window.location.reload();
                } else {
                    alert(result?.message)
                }

            } else {
                alert("Please select all the files");
            }

        } catch (error) {
            console.error('Error uploading files:', error);
        }

    }

    return (
        <>
            <Sidebar />
            <main className="content">
                <Navbar />
                <article>
                    <div class="card px-5 pb-2">
                        <div class="card-header">
                            <h4>Invoice Form</h4>
                        </div>
                        <form>
                        <div className="form-group mt-4">
                        <div className='row col-md-12'>
                            <div className='col-md-4'>
                            <label>Work closure Form* :</label>
                            </div>
                            <div className='col-md-8'>
                            <input type="file" className="inputFiled form-control" name="wcf" onChange={OnChangeFunction} required />
                            </div>
                            <div className='col-md-4 mt-3'>
                            <label>Invoice Copy* :</label>
                            </div>
                            <div className='col-md-8 mt-3'>
                            <input type="file" className="inputFiled form-control" name="invoiceCopy" onChange={OnChangeFunction} required />
                            </div>
                            <div className='col-md-4 mt-3'>
                            <label>Supporting Document* :</label>
                            </div>
                            <div className='col-md-8 mt-3'>
                            <input type="file" className="inputFiled form-control" name="supportingDoc" onChange={OnChangeFunction} required />
                            </div>
                        </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <button type="submit" onClick={ClickSubmit} className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
            </main>
        </>
    );
};
