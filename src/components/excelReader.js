import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import Navbar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Capitalized } from './functions/capitalized';
import Pagination from './pagination';
import Footer from './footer';

const ExcelReader = () => {
    const [data, setData] = useState([]);
    const [ServiceItems, setServiceItems] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [sorted, setSorted] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [InputDetails, setInputDetails] = useState();
  const [activeTab, setActiveTab] = useState('bulk');

    useEffect(() => {
        async function provInfo() {
            const serviceInfo = await fetch(`https://pms.corpteamsolution.com/api/supplyItems/allItems`);
            const serviceRes = await serviceInfo.json();
            setServiceItems(serviceRes)
            setSorted(serviceRes)
        }
        provInfo();
    }, []);
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log("jsonData", jsonData)
        setData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    };
  
  
    const ClickSubmit = async (e) => {
      e.preventDefault();
     
      try {
if(data){
          const response = await fetch('https://pms.corpteamsolution.com/api/supplyItems/itemsInsert', {
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
          console.log("result", result)
          if(result){
              alert("Supply Items Inserted Successfully");
              window.location.reload();
          }
          }else{
alert("fill the fields");}
      } catch (error) {
          console.error('Error uploading files:', error);
      }
  
  }
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = ServiceItems.filter(item =>
      item.code.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSorted(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
const paginate = (pageNumber) => setCurrentPage(pageNumber);
// console.log("services", ServiceItems)

const SubmitSingleFile = async (e) => {
  e.preventDefault();
  try {
      if(InputDetails?.uom && InputDetails?.code && InputDetails?.description){
      
      const response = await fetch('https://pms.corpteamsolution.com/api/supplyItems/singleInsert' , {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json, text/plain, */*"
          },
          body: JSON.stringify(InputDetails),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.status === true) {
          // localStorage.setItem('Details', JSON.stringify(result));
          alert("Supply Items Inserted Successfully");
          window.location.reload();
      }else if(result.status === false){
          alert("Supply Item Already Exists")
      }
  }else{
      alert("Fill all fields")
  }

  } catch (error) {
      console.error('Error uploading files:', error);
  }
};

let name, value;
    const ChangeDetails = (event) => {
        name = event.target.name;
        value = event.target.value;        
        setInputDetails({
            ...InputDetails,
            [name]: value
        })
    }

    const handleDownload = () => {
        const headings = [
            { code: "code", description: "description", uom: "uom" }
        ];
        
        const worksheet = XLSX.utils.json_to_sheet(headings, { header: ["code", "description", "uom"], skipHeader: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Supply Items");

        XLSX.writeFile(workbook, "SupplyItems.xlsx");
    };

    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                     
               
            <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Supply List</li>
                        </ol>
                    </div>
           
                    <div className="row page-titles">
                        <div className="col-lg-12">

                            <div className="card-body">
                                <div className="form-validation">
                                <ul className="nav nav-tabs">
                                        <li className="nav-item">
                                            <a 
                                                className={`nav-link ${activeTab === 'bulk' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('bulk')}
                                                href="#"
                                            >
                                                Bulk Upload
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a 
                                                className={`nav-link ${activeTab === 'single' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('single')}
                                                href="#"
                                            >
                                                Single Upload
                                            </a>
                                        </li>
                                    </ul>
                                    <form className="needs-validation" novalidate="">
                                    <div className="row">
                                            <div className="col-xl-12">
                                              <br />
                                                {activeTab === 'bulk' && (
                                                    <div className="mb-3 row">
                                                        <label className="col-lg-3 col-form-label">Upload Excel<span className="text-danger">*</span></label>
                                                        <div className="col-lg-7">
                                                            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" />
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <button type="submit" onClick={ClickSubmit} className="btn mt-1 btnColor text-white mb-2">Submit</button>
                                                            </div>
                                                        
                                                    </div>
                                                )}

                                                {activeTab === 'single' && (
                                                    <>
                                                    <br />
                                                        <div className="mb-3 row">
                                                            <label className="col-lg-4 col-form-label">Item Code<span className="text-danger">*</span></label>
                                                            <div className="col-lg-6">
                                                                <input type="text" className="form-control" name="code" placeholder="Enter Item Code" onChange={ChangeDetails} />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 row">
                                                            <label className="col-lg-4 col-form-label">Item Description<span className="text-danger">*</span></label>
                                                            <div className="col-lg-6">
                                                                <input type="text" className="form-control" placeholder="Enter Item Description" name="description" onChange={ChangeDetails}/>
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 row">
                                                            <label className="col-lg-4 col-form-label">UOM<span className="text-danger">*</span></label>
                                                            <div className="col-lg-6">
                                                                <input type="text" className="form-control" placeholder="Enter UOM" name="uom" onChange={ChangeDetails}/>
                                                            </div>
                                                        </div>
                                                        <button type="submit" onClick={SubmitSingleFile} className="btn  btnColor text-white mb-2">Submit</button>
                                                    </>

                                                )}

                                               
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="card-body">
                                  <div className='row'>
                                  <div className="col-md-8 mt-3"><FontAwesomeIcon icon={faDownload} style={{float: "right", cursor:"pointer"}} onClick={handleDownload}/></div>
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
                                                            <td className="noBorder" style={{ whiteSpace: 'normal', wordWrap: 'break-word', width:"60%" }}>{Capitalized(pt.description)}</td>
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

export default ExcelReader;



// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelReader = () => {
//   const [data, setData] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const workbook = XLSX.read(e.target.result, { type: 'array' });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
//       console.log("jsonData", jsonData)
//       setData(jsonData);
//     };
//     reader.readAsArrayBuffer(file);
//   };


//   const ClickSubmit = async (e) => {
//     e.preventDefault();
   
//     try {
//         const response = await fetch('https://pms.corpteamsolution.com/api/supplyItems/itemsInsert', {
//             method: 'POST',
//             headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json, text/plain, */*"
//         },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         console.log("result", result)
//         if(result){
//             localStorage.setItem('Details', JSON.stringify(result));
//             alert("Profile Updated Successfully");
//             window.location.reload();
//         }
        
//     } catch (error) {
//         console.error('Error uploading files:', error);
//     }

// }

//   return (
//     <div>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//       <table>
//         <thead>
//           <tr>
//             {data[0] && Object.keys(data[0]).map((key) => (
//               <th key={key}>{key}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               {Object.values(row).map((value, i) => (
//                 <td key={i}>{value}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
// <button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button>
//     </div>
//   );
// };

// export default ExcelReader;
