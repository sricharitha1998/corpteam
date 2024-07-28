import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './pagination';
import Footer from './footer';
import { PDFfile } from './functions/pdfFile';
import { Capitalized } from './functions/capitalized';

function WorkOrder() {
    const location = useLocation();
    const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [sortOrder, setSortOrder] = useState('dsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [getID, setID] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [getUserDetails, setUserDetails] = useState();
  const [ClosureBtn, setClosureBtn] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    async function provInfo() {
      const details = localStorage.getItem('Details');
      const userDetails = JSON.parse(details)

      const userInfo = await fetch(` http://93.127.185.34:4000/users/getUsers/vendor`);
      const getAllVendors = await userInfo.json();
      setVendors(getAllVendors?.users)
      setUserDetails(userDetails)
      let res;
      if (userDetails?.role === "admin") {
        const userInfo = await fetch(` http://93.127.185.34:4000/workOrder/getAll`);
        res = await userInfo.json();
        if (res) {
          const updateArray = await Promise.all(res?.map(async (details) => {
            const vendorResponse = await fetch(` http://93.127.185.34:4000/users/getById/${details?.vendor_id}`);
            const vendor = await vendorResponse.json();

            // Add the username to the details object
            return {
              ...details,
              username: vendor.username
            };
          }));

          // Update the res array with the updated array containing usernames
          res = updateArray;
        }
      } else {
        const userInfo = await fetch(` http://93.127.185.34:4000/workOrder/getRecords/${userDetails?._id}`);
        res = await userInfo.json();
      }
      if (res) {
        setWorkOrders(res);
        setSorted(res);
      }
    }
    provInfo();
  }, [location?.state]);

  const [getModal, setModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [VendorModal, setVendorModal] = useState(false);
  const [vendors, setVendors] = useState()
  const [VendorID, setVendorID] = useState()
  const [IdDetails, setIdDetails] = useState()

  const handleSort = () => {
    const getsorted = [...sorted].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.workOrderNumber.localeCompare(b.workOrderNumber);
      } else {
        return b.workOrderNumber.localeCompare(a.workOrderNumber);
      }
    });
    setSorted(getsorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const UpdateVendor = async (event) => {
    event.preventDefault();
    const response = await fetch(' http://93.127.185.34:4000/workOrder/updateVendor', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
      },
      body: JSON.stringify({ id: IdDetails, vendor_id: VendorID }),

    });
    const data = await response.json();
    if (data) {
      setVendorModal(false)
      window.location.reload();
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = workOrders.filter(item =>
      item.workOrderNumber.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSorted(filtered);
    setCurrentPage(1);
  };

  const DownloadPDF = async (id, event, username) => {

    event.preventDefault();
    const userInfo = await fetch(` http://93.127.185.34:4000/workOrder/getOneRecord/${id}`);
    const res = await userInfo.json();
    const getAllData = {...res, ...{vendorName: username}}

    PDFfile(getAllData)

  }

  const UpdateStatus = async (status, event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    const response = await fetch(' http://93.127.185.34:4000/workOrder/updateStatus', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
      },
      body: JSON.stringify({ id: getID, status: status }),
    });
    const data = await response.json();
    if (data) {
        window.location.reload();
    }
  };

  const SelectVendor = (e) => {
    const selectedVendorId = e.target.value;
    if (selectedVendorId) {
      const filteredArray = workOrders.filter(obj => obj.vendor_id === selectedVendorId);
      setSorted(filteredArray);
    } else {
      setSorted(workOrders); // Show all work orders if no vendor is selected
    }
    setCurrentPage(1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const today = new Date();
  

  return (
    <div fontSetting>
      <Navbar />
      <div className="content-body">
        <div className="container-fluid">
          
          <div className="row page-titles">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Admin Portal</li>
            </ol>
          </div>
          <div className="row page-titles">
            <div className="col-lg-12">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                     
                        <th scope="col" >S.NO</th>
                        <th scope="col" onClick={handleSort}>Work Order Number <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown}/></th>
                        {
                            getUserDetails?.role === "admin" &&
                        <th scope="col">Vendor Name</th>
                        }
                        <th scope="col">Home Pass Number</th>
                        <th scope="col">Route Length</th>
                        <th scope="col">Building Area</th>
                        <th scope="col">Issued Date</th>
                        <th scope="col">Aging Days</th>
                        <th scope="col">Allocation Status</th>
                        <th scope="col">Download</th>
                        { getUserDetails?.role === "vendor" && 
                        <th scope="col">Invoice</th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((pt, index) => 
                        { return(

                        <tr key={pt._id}>
                          <td className="noBorder">{index + 1}</td>
                          <td className="noBorder">{Capitalized(pt.workOrderNumber)}</td>
                          <td className="noBorder"> {pt.username &&
        <td>
          {Capitalized(pt.username)}{pt.status !== "accept" && <span className="badge bg-secondary" onClick={() => { setVendorModal(true); setIdDetails(pt._id) }}>Change</span>}
        </td>
        }</td>
                          <td className="noBorder">{pt.homePass ? Capitalized(pt.homePass) : "-"}</td>
                          <td className="noBorder">{pt.routeLength ? Capitalized(pt.routeLength) : "-"}</td>
                          <td className="noBorder">{Capitalized(pt.buildingArea)}</td>
                          <td className="noBorder">{pt.workOrderDate.toLocaleDateString()}</td>
                          <td className="noBorder">{Math.abs(Math.ceil(new Date(pt.date).getTime() -today.getTime() / (1000 * 3600 * 24)))}</td>
                          <td className="noBorder">
                          {
                            pt.status === "accept" ? (
                <span className="badge bg-success p-2">Accepted</span>
              ) : pt.status === "reject" ? (
                <span className="badge bg-danger p-2">Rejected</span>
              ) : getUserDetails?.role === "admin" ? (
                <span className="badge bg-warning p-2">Vendor Acceptance Pending</span>
              ) :
                (
                  <>
                    <span onClick={() => { setModal(true); setID(pt._id); }}>Accept</span> /
                    <span onClick={() => { setRejectModal(true); setID(pt._id); }}>Reject</span>
                  </>
                )}
                          </td>
                          <td className="noBorder"><FontAwesomeIcon icon={faDownload} onClick={(event) => DownloadPDF(pt._id, event, pt.username ? pt.username : getUserDetails?.username)} /></td>
                          <td className="noBorder">
        { pt.status === "accept" ? 
          <button className="btn btn-sm btn-primary" disabled={ClosureBtn} onClick={() => navigate("/wcform", { state: { id: pt._id } })}>Closure </button>
          :
          
            "Not Accepted"
          
         }
         </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <Pagination
                      itemsPerPage={itemsPerPage}
                      totalItems={workOrders.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
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

export default WorkOrder;
