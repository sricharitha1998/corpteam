import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Table, ProgressBar, Form, Pagination } from '@themesberg/react-bootstrap';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Capitalized } from './functions/CaptaliseFunction';

export const VendorsList = () => {
  const TableRow = (props) => {
    const { username, email, MobNumber, _id } = props;
    const navigate = useNavigate();
    
    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{Capitalized(username)}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{Capitalized(email)}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">{MobNumber}</Card.Link>
        </td>
        <td>
          <Card.Link href="#" className="text-dark fw-bold">
            <button className="btn btn-sm btn-primary" onClick={() => navigate('/updateVendor', {state: {id:_id}})}>
              Edit
            </button>
          </Card.Link>
        </td>
      </tr>
    );
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [getVendors, setVendors] = useState([]);
  const [sortedVendors, setSortedVendors] = useState([]);
  const [sortOrder, setSortOrder] = useState('dsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    async function provInfo() {
      const userInfo = await fetch(`http://localhost:4000/users/getUsers/vendor`);
      const res = await userInfo.json();
      setVendors(res?.users);
      setSortedVendors(res?.users);
    }
    provInfo();
  }, [location?.state]);

  const handleSort = () => {
    const sorted = [...sortedVendors].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
    setSortedVendors(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = getVendors.filter(item => 
      item.username.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSortedVendors(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedVendors.slice(indexOfFirstItem, indexOfLastItem);

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
              <h5>List Of Vendors</h5>
              </div>
              <div className='col-md-4'>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search By Username"
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
                      Username <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown} />
                    </th>
                    <th className="border-0">Email</th>
                    <th className="border-0">Mobile Number</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map(pt => <TableRow key={`page-traffic-${pt._id}`} {...pt} />)}
                </tbody>
              </Table>
              <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(sortedVendors.length / itemsPerPage) }, (_, index) => (
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