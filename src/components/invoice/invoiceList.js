import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './../navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../pagination';
import Footer from '../footer';

function InvoiceList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [getWCFS, setWCFS] = useState([]);
  const [sortedWCFS, setSortedWCFS] = useState([]);
  const [sortOrder, setSortOrder] = useState('dsc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    async function provInfo() {
      const details = localStorage.getItem('Details');
      const userInfo = await fetch(`https://pms.corpteamsolution.com/api/invoice/getAll/${location?.state ? location?.state?.id : JSON.parse(details)?._id}`);
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
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWCFS.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='fontSetting'>
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
          <div className="row">
              <div className="col-md-8">
              <ol className="breadcrumb">
              <li className="breadcrumb-item active">List Invoice</li>
            </ol>
              </div>
              <div className="col-md-4">
              <div className="input-group search-area right d-lg-inline-flex d-none">
                  <input type="text" className="form-control" placeholder="Search By WCF Document" value={searchTerm}
                        onChange={handleSearch}/>
                  <span className="input-group-text">
                    <a href="javascript:void(0);"><FontAwesomeIcon icon={faSearch} className="fontAwesomeIcons mt-1"/></a>
                  </span>
                </div>
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
                        <th scope="col">S.NO</th>
                        <th scope="col">WCF Document <FontAwesomeIcon icon={sortOrder === 'asc' ? faAngleUp : faAngleDown} onClick={handleSort} /></th>
                        <th scope="col">Level1</th>
                        <th scope="col">Level2</th>
                        <th scope="col">Level3</th>
                        <th scope="col">Verify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((pt, index) => (
                        <tr key={pt._id}>
                          <td className="noBorder">{indexOfFirstItem + index + 1}</td>
                          <td className="noBorder">{pt.wcf}</td>
                          <td className="noBorder">{pt.level1 === "approved" ? "Approved" : pt.level1 === "rejected" ? "Rejected" : "Pending"}</td>
                          <td className="noBorder">{pt.level2 === "approved" ? "Approved" : pt.level2 === "rejected" ? "Rejected" : "Pending"}</td>
                          <td className="noBorder">{pt.level3 === "approved" ? "Approved" : pt.level3 === "rejected" ? "Rejected" : "Pending"}</td>
                          <td className="noBorder">
                            {((pt.level1 ==="approved" && pt.level2 ==="approved" && pt.level3 ==="approved") || (pt.level1 ==="" && pt.level2 ==="" && pt.level3 ==="")) ? "-" :
                              <button className="btn btn-sm btnColor text-white" onClick={() => navigate(`/viewInvoice`, { state: { approvals: pt.approvals, id: pt._id } })}>
                                Verify
                              </button>
                            }
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
                      totalItems={sortedWCFS.length}
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

export default InvoiceList;