import React, { useState } from 'react';
import * as XLSX from 'xlsx';

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
        
    } catch (error) {
        console.error('Error uploading files:', error);
    }

}

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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
  );
};

export default ExcelReader;
