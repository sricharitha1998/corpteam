import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Table, Form, Pagination } from '@themesberg/react-bootstrap';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Modal from 'react-modal';
import '../assets/css/dashboard.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFfile } from './functions/pdfFile';
import { Capitalized } from './functions/CaptaliseFunction';

export const WorkOrder = () => {
  const TableRow = (props) => {
    const { workOrderNumber, buildingArea, _id, status, username, homePass, date, routeLength } = props;
    const navigate = useNavigate();
    const today = new Date();
    const workOrderDate = new Date(date);
    const differenceInTime = workOrderDate.getTime() -today.getTime();
    const differenceInDays = Math.abs(Math.ceil(differenceInTime / (1000 * 3600 * 24)));

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{Capitalized(workOrderNumber)}</Card.Link>
        </td>
        {username &&
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{Capitalized(username)}{status !== "accept" && <span className="badge bg-secondary" onClick={() => { setVendorModal(true); setIdDetails(_id) }}>Change</span>}</Card.Link>
        </td>
        }
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{homePass ? Capitalized(homePass) : "-"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{routeLength ? Capitalized(routeLength) : "-"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{Capitalized(buildingArea)}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{workOrderDate.toLocaleDateString()}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{differenceInDays >=0 ? differenceInDays : "-"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">

            {
              status === "accept" ? (
                <span className="badge bg-success p-2">Accepted</span>
              ) : status === "reject" ? (
                <span className="badge bg-danger p-2">Rejected</span>
              ) : getUserDetails?.role === "admin" ? (
                <span className="badge bg-warning p-2">Vendor Acceptance Pending</span>
              ) :
                (
                  <>
                    <span onClick={() => { setModal(true); setID(_id); }}>Accept</span> /
                    <span onClick={() => { setRejectModal(true); setID(_id); }}>Reject</span>
                  </>
                )}
          </Card.Link>
        </td>
        <td><FontAwesomeIcon icon={faDownload} onClick={(event) => DownloadPDF(_id, event, username ? username : getUserDetails?.username)} /></td>
        { getUserDetails?.role === "vendor" && 
        <td>
        { status === "accept" ? 
          <button className="btn btn-sm btn-primary" disabled={ClosureBtn} onClick={() => navigate("/wcform", { state: { id: _id } })}>Closure </button>
          :
          
            "Not Accepted"
          
         }
         </td>
        }
      </tr>
    );
  };

  const location = useLocation();
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

      const userInfo = await fetch(`http://localhost:4000/users/getUsers/vendor`);
      const getAllVendors = await userInfo.json();
      setVendors(getAllVendors?.users)
      setUserDetails(userDetails)
      let res;
      if (userDetails?.role === "admin") {
        const userInfo = await fetch(`http://localhost:4000/workOrder/getAll`);
        res = await userInfo.json();
        if (res) {
          const updateArray = await Promise.all(res?.map(async (details) => {
            const vendorResponse = await fetch(`http://localhost:4000/users/getById/${details?.vendor_id}`);
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
        const userInfo = await fetch(`http://localhost:4000/workOrder/getRecords/${userDetails?._id}`);
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
    const response = await fetch('http://localhost:4000/workOrder/updateVendor', {
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
    const userInfo = await fetch(`http://localhost:4000/workOrder/getOneRecord/${id}`);
    const res = await userInfo.json();
    const getAllData = {...res, ...{vendorName: username}}

    PDFfile(getAllData)

    // Create a PDF from the response
    // const doc = new jsPDF();
    // // doc.text("Code\tUOM\tDescription\tQuantity", 10, 10);

    // doc.text('Purchase Order', 20, 20);
    // doc.text(`Work Order No: ${res.workOrderNumber}`, 20, 30);
    // doc.text(`Home Pass No: ${res.homePass || ''}`, 110, 30);
    // doc.text(`Route Length: ${res.routeLength || ''}`, 110, 40);
    // doc.text(`Building Area: ${res.buildingArea || ''}`, 20, 40);
    // doc.text(`Vendor Name: ${username || ''}`, 20, 50);

    // const tableColumn = ["S.No", "Service Description", "Service Code", "UOM", "Quantity"];
    // const tableRows = [];

    // res && res.services.forEach((service, index) => {
    //   const serviceData = [
    //     index + 1,
    //     service.description,
    //     service.code,
    //     service.uom,
    //     service.quantity,
    //   ];
    //   tableRows.push(serviceData);
    // });

    // doc.autoTable(tableColumn, tableRows, { startY: 60 });
    // doc.save('purchase_order.pdf');
  }

  const UpdateStatus = async (status, event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    const response = await fetch('http://localhost:4000/workOrder/updateStatus', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
      },
      body: JSON.stringify({ id: getID, status: status }),
    });
    const data = await response.json();
    if (data) {
      // if (status === "accept") {
        // navigate("/wcform", { state: { id: getID } });
        window.location.reload();
      // } else if (status === "reject") {
      //   window.location.reload();
      // }
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

  return (
    <>
      <Sidebar />
      <main className="content">
        <Navbar />
        <article>
          <Card border="light" className="shadow-sm mb-4">
            <Card.Body className="pb-0">
              <div className='row col-md-12 sticky-header'>
                <div className='col-md-4'>
                  <h5>Work Orders</h5>
                </div>
                <div className='col-md-4'>
                {
                  getUserDetails?.role === "admin" &&
                  <Row className="mb-3">
                    <Col>
                    <select className='form-control mx-2' name="vendorID" onChange={SelectVendor}>
                                    <option value="">Select Vendor</option>
                                    {vendors && vendors.map((vendor) => (
                                        <option key={vendor._id} value={vendor._id}>{vendor.username}</option>
                                    ))}
                                </select> 
                    </Col>
                  </Row>
                }
                </div>
                <div className='col-md-4'>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Search By Work Order Number"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
              <div>
              <Table responsive className="table-centered table-nowrap rounded mb-0" >
                <thead className="thead-light">
                  <tr>
                    <th className="border-0" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Work Order Number <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown}/>
                    </th>
                    {
                      getUserDetails?.role === "admin" &&
                      <th className="border-0">Vendor Name</th>
                    }
                    <th className="border-0">Home Pass Number</th>
                    <th className="border-0">Route Length</th>
                    <th className="border-0">Building Area</th>
                    <th className="border-0">Issued Date</th>
                    <th className="border-0">Aging Days</th>
                    <th className="border-0">Allocation Status</th>
                    <th className="border-0">Download</th>
                    { getUserDetails?.role === "vendor" && <th className="border-0">Invoice</th> }
                  </tr>
                </thead>
                <tbody className="" style={{overflow: "scroll"}}>
                  {currentItems?.map(pt => <TableRow key={`page-traffic-${pt._id}`} {...pt} />)}
                </tbody>
              </Table>
              </div>
              <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(sorted.length / itemsPerPage) }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Card.Body>
          </Card>
        </article>
      </main>

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
        <h5 className='text-center'>Change Vendor</h5>
        </div>
        <div className='col-md-1'>
        <FontAwesomeIcon icon={faTimes} onClick={() => setVendorModal(false)} />
        </div>
      </div>
        
        
        <br />
        <form>
          <div className="row col-md-12">
            <select className='form-control mx-2' name="vendorID" onChange={(e) => setVendorID(e.target.value)}>
              <option value="">Select Vendor</option>
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
    </>
  );
};
