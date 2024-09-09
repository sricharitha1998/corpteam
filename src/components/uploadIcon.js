import React, { useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';

function UploadIcon() {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          console.log("jsonData", jsonData); // Log jsonData for debugging

          if (jsonData && jsonData.length > 0) {
            const payload = { data: jsonData };
            const response = await fetch('https://pms.corpteamsolution.com/api/order/add', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
              },
              body: JSON.stringify(payload),
            });

            console.log("response", response); // Log the response

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result) {
              alert("Services Uploaded Successfully");
              window.location.reload();
            }
          } else {
            console.error("No data found in the file or invalid file format.");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label onClick={handleFileClick} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faUpload} />
      </label>
    </div>
  );
}

export default UploadIcon;
