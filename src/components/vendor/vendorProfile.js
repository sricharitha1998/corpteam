import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../footer';
import { Capitalized } from '../functions/capitalized';

function VendorProfile() {
    const navigate = useNavigate();

    const [InputDetails, setInputDetails] = useState()
    const [VendorDocs, setVendorDocs] = useState()
    const location = useLocation();

    useEffect(() => {
        const provInfo = async () => {
            if (location?.state?.id) {
                const userInfo = await fetch(`https://pms.corpteamsolution.com/api/users/getById/${location?.state?.id}`);
                const res = await userInfo.json();
                console.log("res", res)
                setInputDetails(res)
                const userDocs = await fetch(`https://pms.corpteamsolution.com/api/vendor/getDetails/${location?.state?.id}`, {
                    method: 'GET',
                    headers: {
                        "Accept": "application/json, text/plain, */*"
                    },
                });
                const resDocs = await userDocs.json();
                console.log("resDocs", resDocs)
                setVendorDocs(resDocs?.details)
            }
        }
        provInfo();
    }, [location?.state])

    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">

                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Profile</li>
                        </ol>
                    </div>
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                                <h4 className='text-center fw-bold'>{Capitalized(InputDetails?.username)}</h4>
                                <h6 className='text-center mt-2'>{InputDetails?.MobNumber}</h6>
                                <h6 className='text-center mt-2'>{Capitalized(InputDetails?.email)}</h6>
                                {VendorDocs ?


    <>
    {VendorDocs?.approvals &&
<p className='text-center text-danger'>***Feedback on documents are pending***</p>
}

<div className="table-responsive">
<table className="table">
    <thead>
        <tr>
            <th scope="col">Document Name</th>
            <th scope="col">Document</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="noBorder">GST No</td>
            <td className="noBorder">
                {VendorDocs?.gst}
            </td>
        </tr>
        <tr>
            <td className="noBorder">Financial Document</td>
            <td className="noBorder">
                <a
                    href={`/api/public/documents/${VendorDocs?.financialDetails}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {VendorDocs?.financialDetails}
                </a>
            </td>
        </tr>
        <tr>
            <td className="noBorder">ROC Document</td>
            <td className="noBorder">
                <a
                    href={`/api/public/documents/${VendorDocs?.roc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {VendorDocs?.roc}
                </a>
            </td>
        </tr>
        <tr>
            <td className="noBorder">photo</td>
            <td className="noBorder">
                <a
                    href={`/api/public/documents/${VendorDocs?.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {VendorDocs?.photo}
                </a>
            </td>
        </tr>
        <tr>
            <td className="noBorder">Partnership Deed / AOE / MOA</td>
            <td className="noBorder">
                <a
                    href={`/api/public/documents/${VendorDocs?.partnerShip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {VendorDocs?.partnerShip}
                </a>
            </td>
        </tr>
        <tr>
            <td className="noBorder">Company Pancard</td>
            <td className="noBorder">
                <a
                    href={`/api/public/documents/${VendorDocs?.pancard}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {VendorDocs?.pancard}
                </a>
            </td>
        </tr>
        <tr>
            <td className="noBorder">Company Address</td>
            <td className="noBorder">
                {VendorDocs?.address}
            </td>
        </tr>
        <tr>
            <td className="noBorder">Others</td>
            <td className="noBorder">
                {VendorDocs?.companyDetails}
            </td>
        </tr>
    </tbody>
</table>

</div>
</>



:

                                
                                <p className='text-center text-danger'>Vendor not yet submitted the documents</p>
}
                               
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default VendorProfile;
