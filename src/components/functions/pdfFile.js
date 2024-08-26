import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Capitalized } from './capitalized';
import logo from '../../assets/img/logo/dashboard-logo.png';

export const PDFfile = (data) => {
    const doc = new jsPDF();

    const imgWidth = 50;
    const imgHeight = 20; 
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = (pageWidth - imgWidth) / 2;

    doc.addImage(logo, 'PNG', centerX, 10, imgWidth, imgHeight);
    // Header Information
    doc.text('Purchase Order', 20, 40);
    doc.text(`Work Order No: ${Capitalized(data.workOrderNumber)}`, 20, 50);
    doc.text(`Home Pass No: ${Capitalized(data.homePass) || ''}`, 110, 50);
    doc.text(`Route Length: ${Capitalized(data.routeLength) || ''}`, 110, 60);
    doc.text(`Building Area: ${Capitalized(data.buildingArea) || ''}`, 20, 60);
    doc.text(`Vendor Name: ${Capitalized(data?.vendorName) || ''}`, 20, 70);

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
        startY: 80
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
        startY: finalY + 10 // Start 10 units below the end of the first table
    });

    doc.save('purchase_order.pdf');
}
