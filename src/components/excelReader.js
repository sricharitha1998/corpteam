import React, { useState } from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import Navbar from './navbar';

const ExcelReader = () => {
    const [data, setData] = useState([]);
  
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
if(data.length>0){
          const response = await fetch('/api/supplyItems/itemsInsert', {
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
              localStorage.setItem('Details', JSON.stringify(result));
              alert("Profile Updated Successfully");
              window.location.reload();
          }
          }else{
alert("fill the fields");}
      } catch (error) {
          console.error('Error uploading files:', error);
      }
  
  }
  

    return (
        <div className='fontSetting'>

            <Navbar />

            <div className="content-body">
                <div className="container-fluid">
                     
                    <div className="row page-titles">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active">Service Upload</li>
                        </ol>
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
                                                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                                                    </div>
                                                </div>
                                               
                                                <table>
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
      </table>
<button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button>
    
                                            </div>
                                            
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="row mt-4 align-items-center">

                                    <div className="col-sm-6 text-sm-right text-start">
                                       
                                        {/* <button type="submit" onClick={ClickSubmit} className="btn  btnColor text-white mb-2">Submit</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="copyright">
                    <p>Copyright © Designed & Developed by <a href="" target="_blank">CorpTeam Solutions</a> <span className="current-year">2024</span></p>
                </div>
            </div>
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
//         const response = await fetch('/api/supplyItems/itemsInsert', {
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

