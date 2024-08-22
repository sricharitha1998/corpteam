import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../footer';
import { Capitalized } from '../functions/capitalized';

function VendorViewDetails() {
    const navigate = useNavigate();
    const [inputDetails, setInputDetails] = useState({});
    const [approvals, setApprovals] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
    const ProvInfo = async () => {
            const getDetails = localStorage.getItem('Details');
            console.log("JSON.parse(getDetails)._id",JSON.parse(getDetails)._id)
            const Vendor_id = JSON.parse(getDetails)._id
            setId(Vendor_id);
            if(Vendor_id){
            const response = await fetch(`https://pms.corpteamsolution.com/api/vendor/getDetails/${Vendor_id}`, {
                method: 'GET',
                headers: {
                    "Accept": "application/json, text/plain, */*"
                },
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log("result", result)
            setApprovals(result?.details?.approvals);
    }
}
    ProvInfo();
    }, []);
    
    const onChangeFunction = (e) => {
        const { name, files: selectedFiles } = e.target;
        setInputDetails((prevDetails) => ({
            ...prevDetails,
            [name]: selectedFiles[0],
        }));
    };

    const CommonFunction = async () => {
                
                const formData = new FormData();
                for (const [key, value] of Object.entries(inputDetails)) {
                    if (value instanceof File) {
                        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
                        const newFile = new File([value], `${timestamp}_${key}_${value.name}`, { type: value.type });
                        formData.append(key, newFile);
                    } else {
                        formData.append(key, value);
                    }
                }
        
                const response = await fetch('/api/vendor/updateDocs', {
                    method: 'POST',
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    },
                    body: formData,
                });
        
                const data = await response.json();
        
                if (data) {
                    alert("Vendor updated successfully");
                    navigate("/login", { state: { role: "vendor" } });
                }
            }

  return (
    <div className='fontSetting'>
      <div className="content-body">
        <div className="container-fluid">
          
          <div className="row page-titles">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Service Partner Document Status </li>
            </ol>
          </div>
          <div className="row page-titles">
            <div className="col-lg-12">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">S.NO</th>
                        <th scope="col">Document</th>
                        <th scope="col">Status  </th>
                        <th scope="col">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                    {approvals.length > 0 ? (
                        approvals.map((approval, index) => (
                        <tr key={approval._id}>
                        <th className="noBorder">{approval.key}</th>
                          <td className="noBorder">{Capitalized(approval.status)}</td>
                          <td className="noBorder">{approval.comments ? approval.comments : "No Comments"}</td>
                          <td className="noBorder">{approval.status !== "Approved" && (
                                                        <input
                                                            type="file"
                                                            className="inputFiled form-control"
                                                            name={approval.key}
                                                            onChange={onChangeFunction}
                                                            required
                                                        />
                                                    )}
                          </td>
                        </tr>
                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No approvals are found</td>
                                        </tr>
                                    )}
                      
                    </tbody>
                  </table>
                  <div className="row mt-4 align-items-center">
                                    <div className="col-sm-6 text-sm-right text-start">
                                        <button type="submit" onClick={CommonFunction} className="btn  btnColor text-white mb-2">Submit</button>
                                    </div>
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

export default VendorViewDetails;
