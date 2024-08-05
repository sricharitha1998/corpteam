import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import pdfToText from 'react-pdftotext';

function PdfViewer() {
  const [pdfFile, setPdfFile] = useState(null);
  const [emails, setEmails] = useState([]);
  const [mwoNumbers, setMwoNumbers] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const extractText = (event) => {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => {
        // Use regex to extract emails
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const foundEmails = text.match(emailPattern) || [];
        setEmails(foundEmails);

        const mwoPattern = "MWO"; // Example pattern for MWO numbers
        const foundMwoNumbers = text.match(mwoPattern) || [];
        setMwoNumbers(foundMwoNumbers);
      })
      .catch((error) => console.error('Failed to extract text from PDF', error));
  };

  console.log("mwoNumbers", mwoNumbers)
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={extractText} />

      {emails.length > 0 && (
        <div>
          <h3>Extracted Emails:</h3>
          <ul>
            {emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}

      {pdfFile && (
        <div style={{ height: '750px' }}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfFile} />
          </Worker>
        </div>
      )}
    </div>
  );
}

export default PdfViewer;
