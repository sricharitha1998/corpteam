import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Capitalized } from './capitalized';
import logo from '../../assets/img/logo/dashboard-logo.png';

export const PDFfile = (data) => {
  console.log("data", data)
    const doc = new jsPDF();
    const imgWidth = 50;
    const imgHeight = 20; 
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2;
    doc.setFontSize(10);
    doc.addImage(logo, 'PNG', centerX, 10, imgWidth, imgHeight);
    // Header Information
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Order', 20, 40);
    doc.setFont('helvetica', 'normal'); 
    doc.text(`Work Order No: ${Capitalized(data.workOrderNumber)}`, 20, 45);
    doc.text(`Home Pass No: ${Capitalized(data.homePass) || ''}`, 20, 50);
    doc.text(`Route Length: ${Capitalized(data.routeLength) || ''}`, 20, 55);
    doc.text(`Building Area: ${Capitalized(data.buildingArea) || ''}`, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Company Address:', 110, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`13th Floor Manjeera Trinity,`, 110, 45);
    doc.text(`JNTU Road,`, 110, 50);
    doc.text(`KPHB,`, 110, 55);
    doc.text(`Hyderabad.`, 110, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Partner Details: ', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Service Partner Name: ${Capitalized(data?.vendorName) || ''}`, 20, 75);
    doc.text(`Address: ${Capitalized(data?.address) || ''}`, 20, 80);

    // Services Table
    const tableColumnServices = ["S.No", "Service Description", "Service Code", "UOM", "Quantity", "Rate"];
    const tableRowsServices = [];

    data && data?.services && data?.services?.forEach((service, index) => {
      const serviceData = [
        index + 1,
        Capitalized(service.description),
        Capitalized(service.code),
        Capitalized(service.uom),
        Capitalized(service.quantity),
        Capitalized(service.rate),
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
        startY: 100,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 68, 117],
          fontSize: 9,
          
      },
      
    });

    // Get the final Y position after the services table
    const finalY = doc.lastAutoTable.finalY;

    // Supplies Table (start after the Services table)
    const tableColumnSupplies = ["S.No", "Supply Description", "Supply Code", "UOM", "Quantity", "Rate"];
    const tableRowsSupplies = [];

    data && data?.supplies && data.supplies.forEach((supply, index) => {
      const supplyData = [
        index + 1,
        Capitalized(supply.description),
        Capitalized(supply.code),
        Capitalized(supply.uom),
        Capitalized(supply.quantity),
        Capitalized(supply.rate),
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
    doc.autoTable({
        head: [tableColumnSupplies],
        body: tableRowsSupplies,
        startY: finalY + 10, // Start 10 units below the end of the first table
        theme: 'grid',
        headStyles: {
          fillColor: [0, 68, 117],
          fontSize: 9,
          
      },
    });

    doc.save('purchase_order.pdf');
}
