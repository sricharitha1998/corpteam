import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import logo from '../../assets/img/logo/dashboard-logo.png';
import autoTable from "jspdf-autotable";

export const PDFfile =(data) => {
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''; // Handle empty input
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const doc = new jsPDF();
    const imgWidth = 50;
    const imgHeight = 20; 
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2;
    doc.setFontSize(10);
    doc.addImage(logo, 'PNG', centerX, 10, imgWidth, imgHeight);
    doc.text('Service Items', 100, 80);
    const table1Data = [
      [{content: 'Service Partner Details', colSpan: 2, styles: { halign: 'center', fontSize: 8, fillColor: [0, 68, 117], textColor: [255, 255, 255] }}] ,
      { name: 'Name', description: capitalizeFirstLetter(data?.vendorName) },
      { name: 'Address', description: capitalizeFirstLetter(data?.address) },
      { name: 'GST', description: data?.gst },
    ];

    // Define options for Table 1
    const table1Options = {
      startY: 40,
      margin: { left: 15, right: 106 },
      body: table1Data,
      columns: [
        { dataKey: 'name' }, // Remove 'header' to exclude the header
        { dataKey: 'description' } // Remove 'header' to exclude the header
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [0, 68, 117],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      styles: {
        fontSize: 8, // Decrease content font size
        cellPadding: 1
      },
    };
  
    // Draw Table 1
    autoTable(doc, table1Options);

  // Table 2 data
  const table2Data = [
    [{content: 'Purchase Order Details', colSpan: 2, styles: { halign: 'center', fontSize: 8, fillColor: [0, 68, 117], textColor: [255, 255, 255] }}] ,
    { subject: 'Work Order No', marks: capitalizeFirstLetter(data.workOrderNumber) },
    { subject: 'Home Pass No', marks: capitalizeFirstLetter(data.homePass) },
    { subject: 'Route Length', marks: capitalizeFirstLetter(data.routeLength) },
    { subject: 'Building Area', marks: capitalizeFirstLetter(data.buildingArea) },
    ];

  const table2Options = {
    startY: 40,
    margin:{ left: 106, right: 15 },
    body: table2Data,
    columns: [
      { dataKey: 'subject' }, // Remove 'header' to exclude the header
      { dataKey: 'marks' } // Remove 'header' to exclude the header
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [0, 68, 117],
      textColor: [255, 255, 255],
      fontSize: 12,
    },
    styles: {
      fontSize: 8, // Decrease content font size
      cellPadding: 1
    },
  };

  autoTable(doc, table2Options);

    const tableColumnServices = ["S.No", "Service Description", "Service Code", "UOM", "Quantity", "Rate"];
    const tableRowsServices = [];

    data?.services?.forEach((service, index) => {
        const serviceData = [
            index + 1,
            capitalizeFirstLetter(service.description),
            capitalizeFirstLetter(service.code),
            capitalizeFirstLetter(service.uom),
            capitalizeFirstLetter(service.quantity),
            capitalizeFirstLetter(service.rate),
        ];
        tableRowsServices.push(serviceData);
    });
    tableRowsServices.push([
        '',
        '',
        '',
        '',
        'Total',
        data?.serviceTotalRate,
    ]);

    doc.autoTable({
        head: [tableColumnServices],
        body: tableRowsServices,
        startY: 82,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 68, 117],
            fontSize: 6,
        },
        styles: {
          fontSize: 8,
          cellPadding: 1 // Decrease content font size
        },
    });

    // Get the final Y position after the services table
    const finalY = doc.lastAutoTable.finalY;

    // Supplies Table
    const tableColumnSupplies = ["S.No", "Supply Description", "Supply Code", "UOM", "Quantity", "Rate"];
    const tableRowsSupplies = [];
    data?.supplies?.forEach((supply, index) => {
        const supplyData = [
            index + 1,
            capitalizeFirstLetter(supply.description),
            capitalizeFirstLetter(supply.code),
            capitalizeFirstLetter(supply.uom),
            capitalizeFirstLetter(supply.quantity),
            capitalizeFirstLetter(supply.rate),
        ];
        tableRowsSupplies.push(supplyData);
    });
    tableRowsSupplies.push([
        '',
        '',
        '',
        '',
        'Total',
        data?.supplyTotalRate,
    ]);
    doc.text('Supply Items', 100, finalY + 5);
    doc.autoTable({
        head: [tableColumnSupplies],
        body: tableRowsSupplies,
        startY: finalY + 7, // Start 10 units below the end of the first table
        theme: 'grid',
        headStyles: {
            fillColor: [0, 68, 117],
            fontSize: 6,
        },
        styles: {
          fontSize: 8,
          cellPadding: 1 // Decrease content font size
        },
    });

    doc.save('purchase_order.pdf');
};

