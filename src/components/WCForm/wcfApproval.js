import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import Footer from '../footer';

function WCFApproval() {
    const { id, level } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(` /api/workClosure/getDocuments/${id}`, {
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
            const response = await fetch(` /api/workClosure/SendEmailVendor`, {
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
    <div className='fontSetting'>
      <div className="m-5">
        <div className="container-fluid">
        <div className="row page-titles">
          <ol className="breadcrumb my-4 text-center">
                            <li className="breadcrumb-item active">Work Closure Form Approval</li>
                        </ol>
                        </div>
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
                                <td className="noBorder">PO Document</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.po}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.po}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="po" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="po" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="po" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">NESA Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.nesa}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.nesa}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="nesa" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="nesa" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="nesa" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Inventory Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.inventory}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.inventory}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="inventory" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="inventory" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="inventory" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">SignUp ABD Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.signupABD}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.signupABD}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="signupABD" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="signupABD" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="signupABD" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Civil At Sign Off Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.civilSignOff}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.civilSignOff}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="civilSignOff" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="civilSignOff" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="civilSignOff" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">MRC Document</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.mrc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.mrc}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="mrc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="mrc" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="mrc" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Official Application Copy</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.officalApp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.officalApp}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="officalApp" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="officalApp" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="officalApp" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Official Demand Note</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.officalDemandNote}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.officalDemandNote}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="officalDemandNote" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="officalDemandNote" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="officalDemandNote" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">DD Channel</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.dd}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.dd}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="dd" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="dd" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="dd" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Final Order Copy</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.finalOrder}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.finalOrder}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="finalOrder" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="finalOrder" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="finalOrder" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">SignUp Doc</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.signup}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.signup}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="signup" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="signup" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="signup" onChange={handleCommentChange} /></td>
                            </tr>

                            <tr>
                                <td className="noBorder">SD/BG Doc</td>
                                <td className="noBorder">
                                    <a
                                        href={` /api/public/documents/${details?.sdOrBg}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.sdOrBg}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="sdOrBg" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="sdOrBg" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="sdOrBg" onChange={handleCommentChange} /></td>
                            </tr>
                            
                            {details?.others?.map((item, index) => (
                                <tr key={index}>
                                    <td className="noBorder">{item.key}</td>
                                    <td className="noBorder">
                                        <a
                                            href={` /api/public/documents/${item.value}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.value}
                                        </a>
                                    </td>
                                    <td className="noBorder">
                                        <input type="radio" name={`${item.key}`} value="Approved" onChange={handleCheckboxChange} />
                                    </td>
                                    <td className="noBorder">
                                        <input type="radio" name={`${item.key}`} value="Not Approved" onChange={handleCheckboxChange} />
                                    </td>
                                    <td className="noBorder"><input type="text" className='form-control' name={item.key} onChange={handleCommentChange} /></td>
                                </tr>
                            ))}
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

export default WCFApproval;
