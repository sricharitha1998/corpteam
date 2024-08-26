import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faDownload, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './pagination';
import Footer from './footer';
import { PDFfile } from './functions/pdfFile';
import { Capitalized } from './functions/capitalized';
import '../assets/css/dashboard.css'

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
  const itemsPerPage = 25;

  useEffect(() => {
    async function provInfo() {
      const details = localStorage.getItem('Details');
      const userDetails = JSON.parse(details)

      const userInfo = await fetch(`https://pms.corpteamsolution.com/api/users/getUsers/vendor`);
      const getAllVendors = await userInfo.json();
      setVendors(getAllVendors?.users)
      setUserDetails(userDetails)
      let res;
      if (userDetails?.role === "admin" || userDetails?.role === "employee") {
        const userInfo = await fetch(`https://pms.corpteamsolution.com/api/workOrder/getAll`);
        res = await userInfo.json();
        if (res) {
          const updateArray = await Promise.all(res?.map(async (details) => {
            const vendorResponse = await fetch(`https://pms.corpteamsolution.com/api/users/getById/${details?.vendor_id}`);
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
        const userInfo = await fetch(`https://pms.corpteamsolution.com/api/workOrder/getRecords/${userDetails?._id}`);
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
    const response = await fetch('https://pms.corpteamsolution.com/api/workOrder/updateVendor', {
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

  const DownloadPDF = async (id, event, username,vendor_id) => {

    event.preventDefault();
    const userInfo = await fetch(`https://pms.corpteamsolution.com/api/workOrder/getOneRecord/${id}`);
    const res = await userInfo.json();
    const vendorDetails = await fetch(`https://pms.corpteamsolution.com/api/vendor/getDetails/${vendor_id}`);
    const ResVendor = await vendorDetails.json();
    console.log("ResVendor", ResVendor)
    const getAllData = { ...res, ...{ vendorName: username }, ...ResVendor?.details }

    PDFfile(getAllData)

  }

  const UpdateStatus = async (status, event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    const response = await fetch('https://pms.corpteamsolution.com/api/workOrder/updateStatus', {
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
    <div className='fontSetting'>
      <Navbar />
      <div className="content-body">
        <div className="container-fluid">

          <div className="row page-titles">
            <div className="col-md-8">
              <div className="row ">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active">Work Order List</li>
                </ol>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group search-area right d-lg-inline-flex d-none">
                <input type="text" className="form-control" placeholder="Search By Work Order Number" value={searchTerm}
                  onChange={handleSearch} />
                <span className="input-group-text">
                  <a href="javascript:void(0);"><FontAwesomeIcon icon={faSearch} className="fontAwesomeIcons mt-1" /></a>
                </span>
              </div>
            </div>
          </div>
          <div className="row page-titles">
            <div className="col-lg-12">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>

                        <th scope="col" >S.NO</th>
                        <th scope="col" onClick={handleSort}>W.O Number <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown} /></th>
                        {
                          (getUserDetails?.role === "admin" || getUserDetails?.role === "employee") &&
                          <th scope="col">Partner</th>
                        }
                        <th scope="col">Aging</th>
                        <th scope="col">H.P</th>
                        <th scope="col">Route</th>
                        <th scope="col">Building Area</th>
                        <th scope="col">Issued Date</th>
                        <th scope="col">Allocation Status</th>
                        <th scope="col">Download</th>
                        {getUserDetails?.role === "vendor" &&
                          <th scope="col">Invoice</th>
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((pt, index) => {
                        const today = new Date();
                        const workOrderDate = new Date(pt?.date);
                        const differenceInTime = workOrderDate.getTime() - today.getTime();
                        const differenceInDays = Math.abs(Math.ceil(differenceInTime / (1000 * 3600 * 24)));
                        return (

                          <tr key={pt._id}>
                            <td className="noBorder">{indexOfFirstItem + index + 1}</td>
                            <td className="noBorder">{Capitalized(pt.workOrderNumber)}</td>
                            {pt.username &&
                              <td className="noBorder">
                                {Capitalized(pt.username)}{pt.status !== "accept" && <span className="badge bg-secondary pointerCss" onClick={() => { setVendorModal(true); setIdDetails(pt._id) }}>Change</span>}
                              </td>
                            }
                            <td className="noBorder">{differenceInDays >= 0 ? differenceInDays : "-"}</td>
                            <td className="noBorder">{pt.homePass ? Capitalized(pt.homePass) : "-"}</td>
                            <td className="noBorder">{pt.routeLength ? Capitalized(pt.routeLength) : "-"}</td>
                            <td className="noBorder">{Capitalized(pt.buildingArea)}</td>
                            <td className="noBorder">{workOrderDate.toLocaleDateString()}</td>

                            <td className="noBorder">
                              {
                                pt.status === "accept" ? (
                                  <span className="badge bg-success p-2">Accepted</span>
                                ) : pt.status === "reject" ? (
                                  <span className="badge bg-danger p-2">Rejected</span>
                                ) : (getUserDetails?.role === "admin" || getUserDetails?.role === "employee") ? (
                                  <span className="badge bg-warning p-2">Service Partner Acceptance Pending</span>
                                ) :
                                  (
                                    <>
                                      <span className='badge bg-success pointerCss' style={{marginRight:"1px"}} onClick={() => { setModal(true); setID(pt._id); }}>Accept</span>  
                                      <span className='badge bg-danger pointerCss' onClick={() => { setRejectModal(true); setID(pt._id); }}>Reject</span>
                                    </>
                                  )}
                            </td>
                            <td className="noBorder"><FontAwesomeIcon icon={faDownload} onClick={(event) => DownloadPDF(pt._id, event, pt.username ? pt.username : getUserDetails?.username, pt.vendor_id)} /></td>
                            {getUserDetails?.role === "vendor" &&
                              <td className="noBorder"> 
                                {pt.status === "accept" ?
                                  <button className="btn btn-sm btn-primary" disabled={ClosureBtn} onClick={() => navigate("/wcform", { state: { id: pt._id } })}>Closure </button>
                                  :

                                  "Not Accepted"

                                }
                              </td>
                            }
                          </tr>
                        )
                      })}
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
      <Modal
        isOpen={getModal}
        onRequestClose={() => setModal(false)}
        style={{
          content: {
            width: '500px',
            margin: 'auto',
            height: 'fit-content',
            padding: '20px',
            boxShadow: '30px 30px 30px 30px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <div className='row'>
          <div className='col-md-11'></div>
          <div className='col-md-1'>
            <FontAwesomeIcon icon={faTimes} onClick={() => setModal(false)} />
          </div>
        </div>
        <h5 className='text-center'>Are you sure you want to accept the order?</h5>
        <br />
        <form>
          <div className="row col-md-12">
            <div className="col-md-4"></div>
            <div className="col-md-2 text-center">
              <button className="btn btn-success" onClick={(event) => UpdateStatus("accept", event)}>Yes</button>
            </div>
            <div className="col-md-2 text-center">
              <button className="btn btn-danger" onClick={() => setModal(false)}>No</button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={VendorModal}
        onRequestClose={() => setVendorModal(false)}
        style={{
          content: {
            width: '500px',
            margin: 'auto',
            height: 'fit-content',
            padding: '20px',
            boxShadow: '30px 30px 30px 30px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <div className='row'>
          <div className='col-md-1'></div>
          <div className='col-md-10'>
            <h5 className='text-center'>Change Service Partner</h5>
          </div>
          <div className='col-md-1'>
            <FontAwesomeIcon icon={faTimes} onClick={() => setVendorModal(false)} />
          </div>
        </div>


        <br />
        <form>
          <div className="row col-md-12">
            <select className='form-control mx-2' name="vendorID" onChange={(e) => setVendorID(e.target.value)}>
              <option value="">Select Service Partner</option>
              {vendors && vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>{vendor.username}</option>
              ))}
            </select>
            <div className='row'>
              <div className='col-md-4'>
                <button type="button" onClick={UpdateVendor} className="btn btn-primary my-2">Submit</button>
              </div>
            </div>

          </div>
        </form>
      </Modal>

      <Modal
        isOpen={rejectModal}
        onRequestClose={() => setRejectModal(false)}
        style={{
          content: {
            width: '500px',
            margin: 'auto',
            height: 'fit-content',
            padding: '20px',
            boxShadow: '30px 30px 30px 30px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <div className='row'>
          <div className='col-md-11'></div>
          <div className='col-md-1'>
            <FontAwesomeIcon icon={faTimes} onClick={() => setRejectModal(false)} />
          </div>
        </div>
        <h5 className='text-center'>Are you sure you want to reject the order?</h5>
        <br />
        <form>
          <div className="row col-md-12">
            <div className="col-md-4"></div>
            <div className="col-md-2 text-center">
              <button className="btn btn-success" onClick={(event) => UpdateStatus("reject", event)}>Yes</button>
            </div>
            <div className="col-md-2 text-center">
              <button className="btn btn-danger" onClick={() => setRejectModal(false)}>No</button>
            </div>
          </div>
        </form>
      </Modal>
      <Footer />
    </div>
  );
}

export default WorkOrder;