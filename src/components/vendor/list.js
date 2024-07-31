import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../pagination';
import Footer from '../footer';
import { Capitalized } from '../functions/capitalized';

function VendorList() {

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
        const userInfo = await fetch(` http://localhost:4000/users/getUsers/vendor`);
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
    <div fontSetting>
      <Navbar />
      <div className="content-body">
        <div className="container-fluid">
          <div className="modal fade" id="addProjectSidebar">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Project</h5>
                  <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label className="text-black font-w500">Project Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="text-black font-w500">Deadline</label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="text-black font-w500">Client Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                      <button type="button" className="btn btn-primary">CREATE</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row page-titles">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active"> List Vendor</li>
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
                        <th scope="col">USERNAME <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown} onClick={handleSort} /></th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">MOBILE NUMBER	</th>
                        <th scope="col">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((pt, index) => (
                        <tr key={pt._id}>
                          <td className="noBorder">{index + 1}</td>
                          <td className="noBorder">{Capitalized(pt.username)}</td>
                          <td className="noBorder">{Capitalized(pt.email)}</td>
                          <td className="noBorder">{pt.MobNumber}</td>
                          <td className="noBorder">
                          <button className="btn text-white btnColor" onClick={() => navigate('/updateVendor', {state: {id:pt._id}})}>
              Edit
            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <Pagination
                      itemsPerPage={itemsPerPage}
                      totalItems={sortedVendors.length}
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

export default VendorList;
