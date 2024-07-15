import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [inputDetails, setInputDetails] = useState({});
    const [fields, setFields] = useState([]);
    const [getShow, setShow] = useState(false);
    const [getName, setPDFName] = useState();
    const fileInputRefs = useRef({});
    
    useEffect(() => {
        const ProvInfo = async () => {
            if(location?.state?.id){
                const userInfo = await fetch(`http://localhost:4000/workOrder/getOneRecord/${location?.state?.id}`);
                const res = await userInfo.json();

                // Create a PDF from the response
                const doc = new jsPDF();
                // doc.text("Code\tUOM\tDescription\tQuantity", 10, 10);
                doc.text('Purchase Order', 20, 20);
                doc.text(`Work Order No: ${res.workOrderNumber}`, 20, 30);
                doc.text(`Building Name: ${res.buildingName || ''}`, 20, 40);

                const tableColumn = ["S.No", "Service Description", "Service Code", "UOM", "Quantity"];
        const tableRows = [];

        res && res.services.forEach((service, index) => {
            const serviceData = [
                index + 1,
                service.description,
                service.code,
                service.uom,
                service.quantity,
            ];
            tableRows.push(serviceData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 50 });

                // res && res.services.forEach((item, index) => {
                //     const yPosition = 20 + (index * 10);
                //     doc.text(`${item.code}\t${item.uom}\t${item.description}\t${item.quantity}`, 10, yPosition);
                // });

                // Convert the PDF to a File object
                const pdfBlob = doc.output('blob');
                const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                const getPDFName = timestamp+"_po_document.pdf"
                setPDFName(getPDFName)
                const pdfFile = new File([pdfBlob], getPDFName, { type: 'application/pdf' });

                // Set the PDF file in the state
                setInputDetails((prevDetails) => ({
                    ...prevDetails,
                    po: pdfFile,
                }));
            }
        }
        ProvInfo();
    }, [location?.state])

    const onChangeFunction = (e) => {
        const { name, files: selectedFiles } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: selectedFiles[0],
        }));
    };

    const addField = () => {
        setFields([...fields, { key: '', value: null, fileName: '' }]);
    };

    const handleChange = (index, event) => {
        const { name, value, files } = event.target;
        const newFields = fields.map((field, i) => {
            if (i === index) {
                return {
                    ...field,
                    [name]: files ? files[0] : value,
                    fileName: files ? files[0].name : field.fileName
                };
            }
            return field;
        });
        setFields(newFields);
    };

    const handleDelete = (key) => {
        setInputDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            delete updatedDetails[key];
            return updatedDetails;
        });
        if (fileInputRefs.current[key]) {
            fileInputRefs.current[key].value = "";
        }
    };

    const removeField = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const clickSubmit = async (e) => {
        e.preventDefault();

        if (
            Object.keys(inputDetails).length === 12 && Object.keys(inputDetails).every(key => inputDetails[key] !== undefined)
        ) {
            const formData = new FormData();
            for (const [key, value] of Object.entries(inputDetails)) {
                const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
                formData.append(key, newFile);
            }

            for (var i = 0; i < fields.length; i++) {
                formData.append(fields[i].key, fields[i].value)
            }

            const formattedFields = fields.map(field => ({
                key: field.key,
                value: field.value ? field.value : null,
                fileName: field.fileName
            }));

            formData.append('others', JSON.stringify(formattedFields));
            const details = localStorage.getItem('Details');
            formData.append("vendor_id", JSON.parse(details)._id)

            try {

                const response = await fetch('http://localhost:4000/workClosure/CreateDocs', {
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
                if (result.status === true) {
                    alert("Thanks For Uploading Work Closure Form");
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            alert("Please upload all files");
        }
    };

    console.log("input", inputDetails)

    const renderFileInputs = () => {
        const fileInputs = [
            { name: 'po', label: 'PO Document*' },
            { name: 'nesa', label: 'NESA Document*' },
            { name: 'inventory', label: 'Inventory Document*' },
            { name: 'signupABD', label: 'SignUp ABD Document*' },
            { name: 'civilSignOff', label: 'Civil At Sign Off Document*' },
            { name: 'mrc', label: 'MRC Document*' },            
        ];

        return fileInputs.map((input, index) => (
            <div key={index} className="form-group mt-3">
                <div className="row">
                    <div className="col-md-4">
                        <label>{input.label}</label>
                    </div>
                    <div className="col-md-7">
                    {input.name == "po" && getName ? 
                        <input
                            type="text"
                            value={getName}
                            className="inputFiled form-control"
                        />
                    :
                    
                        <input
                            type="file"
                            ref={(ref) => (fileInputRefs.current[input.name] = ref)}
                            className="inputFiled form-control"
                            name={input.name}
                            onChange={onChangeFunction}
                            required
                        />
                    }
                    </div>
                    <div className='col-md-1 mt-2'>
                        {inputDetails[input.name] &&
                            <i className="fa fa-times-circle" onClick={() => handleDelete(input.name)}></i>
                        }
                    </div>
                </div>
            </div>
        ));
    };

    const NewFileInputs = () => {

        const addFields = [
            { name: 'officalApp', label: 'Official Application Copy*' },
            { name: 'officalDemandNote', label: 'Official Demand Note*' },
            { name: 'dd', label: 'DD Channel*' },
            { name: 'finalOrder', label: 'Final Order Copy*' },
            { name: 'signup', label: 'SignUp Document*' },
            { name: 'sdOrBg', label: 'SD/BG Document*' },
        ]

        return addFields.map((input, index) => (
            
            <div key={index} className="form-group mt-3">
                {getShow &&
                <div className="row">
                    <div className="col-md-4">
                        <label>{input.label}</label>
                    </div>
                    <div className="col-md-7">
                        <input
                            type="file"
                            ref={(ref) => (fileInputRefs.current[input.name] = ref)}
                            className="inputFiled form-control"
                            name={input.name}
                            onChange={onChangeFunction}
                            required
                        />
                    </div>
                    <div className='col-md-1 mt-2'>
                        {inputDetails[input.name] &&
                            <i className="fa fa-times-circle" onClick={() => handleDelete(input.name)}></i>
                        }
                    </div>
                </div>
                }
            </div>
            
        ));
    };

    return (
        <>
        
            <Sidebar />

            <main className="content">
                <Navbar />
                <article>
                    <div className="card px-5 pb-2 mb-5">
                        <div className="card-header sticky-header">
                            <h4>Work Closure Form</h4>
                        </div>
                        <form encType='multipart/form-data' >
                        {renderFileInputs()}
                        {getShow ? 
                        <button type="button" onClick={() => setShow(false)} className="btn btn-primary">
                            -
                        </button>
                        :
                        <button type="button" onClick={() => setShow(true)} className="btn btn-primary">
                            +
                        </button>
                        }
                        {NewFileInputs()}
                        {fields.map((field, index) => (
                            <div key={index} className="form-group mt-3">
                                <div className='row col-md-12'>
                                    <div className='col-md-4'>
                                        <input
                                            type="text"
                                            name="key"
                                            value={field.key}
                                            onChange={(e) => handleChange(index, e)}
                                            placeholder="Document Name"
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-7'>
                                        <input
                                            type="file"
                                            className="inputFiled form-control"
                                            name="value"
                                            onChange={(e) => handleChange(index, e)}
                                        />

                                    </div>
                                    <div className='col-md-1'>
                                        <button type="button" onClick={() => removeField(index)} className="btn btn-danger">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <br />
                        {getShow &&
                        <button type="button" onClick={addField} className="btn btn-primary" style={{ float: 'right' }}>
                            Add More fields
                        </button>
                        }

                        {/* <FieldsWCForm /> */}

                        <div className="row mt-3">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <button type="submit" onClick={clickSubmit} className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </article>
            </main>
        </>
    );
};
