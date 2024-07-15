import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Table, ProgressBar, Form, Pagination } from '@themesberg/react-bootstrap';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export const InvoiceList = () => {
  const TableRow = (props) => {
    const { wcf, level1, level2, level3, approvals, _id } = props;
    const navigate = useNavigate();
    
    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{wcf}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{level1 === "approved" ? "Approved" : level1 === "rejected" ? "Rejected" : "Pending"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{level2 === "approved" ? "Approved" : level2 === "rejected" ? "Rejected" : "Pending"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{level3 === "approved" ? "Approved" : level3 === "rejected" ? "Rejected" : "Pending"}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
          {(level1 !=="approved" || level2 !=="approved" || level3 !=="approved") &&
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/viewInvoice`, { state: { approvals, id: _id } })}>
              Verify
            </button>
          }
          </Card.Link>
        </td>
      </tr>
    );
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [getWCFS, setWCFS] = useState([]);
  const [sortedWCFS, setSortedWCFS] = useState([]);
  const [sortOrder, setSortOrder] = useState('dsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value to set items per page

  useEffect(() => {
    async function provInfo() {
      const details = localStorage.getItem('Details');
      const userInfo = await fetch(`http://localhost:4000/invoice/getAll/${location?.state ? location?.state?.id : JSON.parse(details)?._id}`);
      const res = await userInfo.json();
      console.log("res", res)
      setWCFS(res?.invoices);
      setSortedWCFS(res?.invoices);
    }
    provInfo();
  }, [location?.state]);

  const handleSort = () => {
    const sorted = [...sortedWCFS].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.wcf.localeCompare(b.wcf);
      } else {
        return b.wcf.localeCompare(a.wcf);
      }
    });
    setSortedWCFS(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = getWCFS.filter(item => 
      item.wcf.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSortedWCFS(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWCFS.slice(indexOfFirstItem, indexOfLastItem);

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
              <div className='col-md-8'>
              <h5>Invoice Forms</h5>
              </div>
              <div className='col-md-4'>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search by WCF Document"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Col>
              </Row>
              </div>
            </div>
              
              <Table responsive className="table-centered table-nowrap rounded mb-0">
                <thead className="thead-light">
                  <tr>
                    <th className="border-0" onClick={handleSort} style={{ cursor: 'pointer' }}>
                      WCF Document <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown} />
                    </th>
                    <th className="border-0">Level1</th>
                    <th className="border-0">Level2</th>
                    <th className="border-0">Level3</th>
                    <th className="border-0">Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map(pt => <TableRow key={`page-traffic-${pt._id}`} {...pt} />)}
                </tbody>
              </Table>
              <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(sortedWCFS.length / itemsPerPage) }, (_, index) => (
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
    </>
  );
};