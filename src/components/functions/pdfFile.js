import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Capitalized } from './capitalized';

export const PDFfile = (data) => {
    const doc = new jsPDF();

    // Header Information
    doc.text('Purchase Order', 20, 20);
    doc.text(`Work Order No: ${Capitalized(data.workOrderNumber)}`, 20, 30);
    doc.text(`Home Pass No: ${Capitalized(data.homePass) || ''}`, 110, 30);
    doc.text(`Route Length: ${Capitalized(data.routeLength) || ''}`, 110, 40);
    doc.text(`Building Area: ${Capitalized(data.buildingArea) || ''}`, 20, 40);
    doc.text(`Vendor Name: ${Capitalized(data?.vendorName) || ''}`, 20, 50);

    // Services Table
    const tableColumnServices = ["S.No", "Service Description", "Service Code", "UOM", "Quantity"];
    const tableRowsServices = [];

    data.services.forEach((service, index) => {
      const serviceData = [
        index + 1,
        Capitalized(service.description),
        Capitalized(service.code),
        Capitalized(service.uom),
        Capitalized(service.quantity),
      ];
      tableRowsServices.push(serviceData);
    });

    doc.autoTable({
        head: [tableColumnServices],
        body: tableRowsServices,
        startY: 60
    });

    // Get the final Y position after the services table
    const finalY = doc.lastAutoTable.finalY;

    // Supplies Table (start after the Services table)
    const tableColumnSupplies = ["S.No", "Supply Description", "Supply Code", "UOM", "Quantity"];
    const tableRowsSupplies = [];

    data.supplies.forEach((supply, index) => {
      const supplyData = [
        index + 1,
        Capitalized(supply.description),
        Capitalized(supply.code),
        Capitalized(supply.uom),
        Capitalized(supply.quantity),
      ];
      tableRowsSupplies.push(supplyData);
    });

    doc.autoTable({
        head: [tableColumnSupplies],
        body: tableRowsSupplies,
        startY: finalY + 10 // Start 10 units below the end of the first table
    });

    doc.save('purchase_order.pdf');
}
