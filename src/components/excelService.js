import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import Navbar from './navbar';
import { Capitalized } from './functions/capitalized';
import Pagination from './pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Footer from './footer';


const ExcelService = () => {
    const [data, setData] = useState([]);
    const [ServiceItems, setServiceItems] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [sorted, setSorted] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function provInfo() {
            const serviceInfo = await fetch(`/api/serviceItems/allItems`);
            const serviceRes = await serviceInfo.json();
            setServiceItems(serviceRes)
            setSorted(serviceRes)
        }
        provInfo();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filtered = ServiceItems.filter(item =>
          item.code.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setSorted(filtered);
        setCurrentPage(1);
      };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log("jsonData", jsonData)
            setData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };


    const ClickSubmit = async (e) => {
        e.preventDefault();

        try {
            if (data.length > 0) {
                const response = await fetch('/api/serviceItems/itemsInsert', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json, text/plain, */*"
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result) {
                    alert("Services Uploaded Successfully");
                    window.location.reload();
                }
            } else {
                alert("fill the fields");
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }

    }

    const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">

                <div className="row">
            <div className="col-md-8">
            <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Service List</li>
                        </ol>
                    </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="input-group search-area right d-lg-inline-flex d-none">
                <input type="text" className="form-control" placeholder="Search By Item Code" value={searchTerm}
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
                                <div className="form-validation">
                                    <form className="needs-validation" novalidate="">
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="mb-3 row">
                                                    <label className="col-lg-4 col-form-label">Upload Excel<span className="text-danger">*</span>

                                                    </label>
                                                    <div className="col-lg-6">
                                                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" />
                                                    </div>
                                                </div>

                                                {/* <table>
                                                    <thead>
                                                        <tr>
                                                            {data[0] && Object.keys(data[0]).map((key) => (
                                                                <th key={key}>{key}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map((row, index) => (
                                                            <tr key={index}>
                                                                {Object.values(row).map((value, i) => (
                                                                    <td key={i}>{value}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table> */}
                                                <button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button>

                                            </div>

                                        </div>
                                    </form>
                                </div>

                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col" >S.NO</th>
                                                    <th scope="col">Item Code</th>
                                                    <th scope="col">Item Description</th>
                                                    <th scope="col">UOM</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((pt, index) => {
                                                    
                                                    return (

                                                        <tr key={pt._id}>
                                                            <td className="noBorder">{indexOfFirstItem + index + 1}</td>
                                                            <td className="noBorder">{Capitalized(pt.code)}</td>
                                                            <td className="noBorder">{Capitalized(pt.description)}</td>
                                                            <td className="noBorder">{Capitalized(pt.uom)}</td>
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
                                                totalItems={ServiceItems?.length}
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
            </div>
            <Footer />
        </div>
    );
}

export default ExcelService;
