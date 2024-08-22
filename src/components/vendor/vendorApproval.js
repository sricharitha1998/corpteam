import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

function VendorApproval() {
    const { id } = useParams();
    const [details, setDetails] = useState({});
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        const provInfo = async () => {
            try {
                const response = await fetch(`/api/vendor/getVendorDetails/${id}`, {
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
            const response = await fetch(`/api/vendor/updateApproval`, {
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
    <div className='fontSetting'>
      <div className="m-5">
        <div className="container-fluid">
          <div className="row page-titles">
          <ol className="breadcrumb my-4 text-center">
                            <li className="breadcrumb-item active">Service Partner Approval</li>
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
                                <td className="noBorder">GST No</td>
                                <td className="noBorder">
                                    {details?.gst}
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="gst" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="gst" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="gst" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Financial Document</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.financialDetails}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.financialDetails}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="financialDetails" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="financialDetails" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="financialDetails" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">ROC Document</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.roc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.roc}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="roc" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="roc" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="roc" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">photo</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.photo}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.photo}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="photo" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="photo" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="photo" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Partnership Lead / AOE / MOA</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.partnerShip}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.partnerShip}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="partnerShip" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="partnerShip" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="partnerShip" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Company Pancard</td>
                                <td className="noBorder">
                                    <a
                                        href={`/api/public/documents/${details?.pancard}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {details?.pancard}
                                    </a>
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="pancard" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="pancard" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="pancard" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Company Team</td>
                                <td className="noBorder">
                                        {details?.companyTeam}
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="companyTeam" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="companyTeam" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="companyTeam" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Company Address</td>
                                <td className="noBorder">
                                        {details?.address}
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="address" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="address" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="address" onChange={handleCommentChange} /></td>
                            </tr>
                            <tr>
                                <td className="noBorder">Others</td>
                                <td className="noBorder">
                                        {details?.companyDetails}
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="companyDetails" value="Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder">
                                    <input type="radio" name="companyDetails" value="Not Approved" onChange={handleCheckboxChange} />
                                </td>
                                <td className="noBorder"><input type="text" className='form-control' name="companyDetails" onChange={handleCommentChange} /></td>
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

export default VendorApproval;
