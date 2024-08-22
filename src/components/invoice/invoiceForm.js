import React, { useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import Footer from '../footer';

function InvoiceForm() {

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

                const response = await fetch('https://pms.corpteamsolution.com/api/invoice/register', {
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
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                     
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Add Invoice</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Work Closure Form      <span className="text-danger">*</span>
                                                        
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="file" className="form-control form-control" name="wcf" onChange={OnChangeFunction} required />
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom02">Invoice Copy  <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input  type="file" className="form-control" name="invoiceCopy" onChange={OnChangeFunction} required />
                                                        
                                                    </div>
                                                </div>
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label" for="validationCustom05">Supporting Document    <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="col-lg-6">
                                                    <input type="file" className="form-control" name="supportingDoc" onChange={OnChangeFunction} required  />
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="row mt-4 align-items-center">

                                    <div className="col-sm-6 text-sm-right text-start">
                                       
                                        <button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button>
                                    </div>
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

export default InvoiceForm;
