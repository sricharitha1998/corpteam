import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Capitalized } from './capitalized';

export const PDFfile = (data) => {
    const doc = new jsPDF();
    // doc.text("Code\tUOM\tDescription\tQuantity", 10, 10);

    doc.text('Purchase Order', 20, 20);
    doc.text(`Work Order No: ${Capitalized(data.workOrderNumber)}`, 20, 30);
    doc.text(`Home Pass No: ${Capitalized(data.homePass) || ''}`, 110, 30);
    doc.text(`Route Length: ${Capitalized(data.routeLength) || ''}`, 110, 40);
    doc.text(`Building Area: ${Capitalized(data.buildingArea) || ''}`, 20, 40);
    doc.text(`Vendor Name: ${Capitalized(data?.vendorName) || ''}`, 20, 50);

    const tableColumn = ["S.No", "Service Description", "Service Code", "UOM", "Quantity"];
    const tableRows = [];

    data && data.services.forEach((service, index) => {
      const serviceData = [
        index + 1,
        Capitalized(service.description),
        Capitalized(service.code),
        Capitalized(service.uom),
        Capitalized(service.quantity),
      ];
      tableRows.push(serviceData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 60 });

    const tableSupply = ["S.No", "Supply Description", "Supply Code", "UOM", "Quantity"];
    const tableSupplyrows = [];

    data && data.supplies.forEach((supply, index) => {
      const supplyData = [
        index + 1,
        Capitalized(supply.description),
        Capitalized(supply.code),
        Capitalized(supply.uom),
        Capitalized(supply.quantity),
      ];
      tableSupplyrows.push(supplyData);
    });

    doc.autoTable(tableSupply, tableSupplyrows, { startY: 60 });

    doc.save('purchase_order.pdf');
}