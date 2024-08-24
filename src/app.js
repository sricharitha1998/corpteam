import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginComponent from './components/Login';
import ForgotPassword from './components/forgotPassword';
import Dashboard from './components/dashboard';
import PurchaseOrder from './components/purchaseOrder';
import InvoiceForm from './components/invoice/invoiceForm';
import InvoiceList from './components/invoice/invoiceList';
import InvoiceDetails from './components/invoice/viewDetails'
import WCForm from './components/WCForm/add';
import WCFList from './components/WCForm/list';
import WorkOrder from './components/workOrder';
import AddVendor from './components/vendor/add';
import VendorList from './components/vendor/list';
import UpdateVendor from './components/vendor/update';
import WCFViewDetails from './components/WCForm/viewDetails';
import Profile from './components/profile';
import ProfileDocs from './components/ProfileDoc';
import InvoiceApproval from './components/invoice/invoiceApproval';
import WCFApproval from './components/WCForm/wcfApproval';
import VendorApproval from './components/vendor/vendorApproval';
import PrintPurchase from './components/printPurchase';
import ResetPassword from './components/resetPassword';
import AdminLogin from './components/adminLogin';
import AdminDashboard from './components/adminDashboard';
import Error from './components/error';
import Register from './components/register'
import ExcelReader from './components/excelReader';
import ExcelService from './components/excelService';
import VendorProfile from './components/vendor/vendorProfile';
import EmployeeList from './components/employee/list';
import AddEmployee from './components/employee/add';
import EmployeeLogin from './components/empLogin';

function App() {
    return ( 
        <Router>
          <Routes>
                <Route path="/" element={<Home />} />  
                <Route path="/login" element={<LoginComponent />} />  
                <Route path="/forgotPassword" element={<ForgotPassword />} />  
                <Route path="/dashboard" element={<Dashboard />} />  
                <Route path="/purchaseOrder" element={<PurchaseOrder />} />  
                <Route path="/invoiceForm" element={<InvoiceForm />} />  
                <Route path="/invoiceList" element={<InvoiceList />} />  
                <Route path="/wcform" element={<WCForm />} />  
                <Route path="/wcfList" element={<WCFList />} />
                <Route path="/workOrder" element={<WorkOrder />} /> 
                <Route path="/addVendor" element={<AddVendor />} />  
                <Route path="/vendorList" element={<VendorList />} />
                <Route path="/updateVendor" element={<UpdateVendor />} />  
                <Route path="/wcfViewDetails" element={<WCFViewDetails />} />  
                <Route path="/profile" element={<Profile />} /> 
                <Route path="/profileDocs" element={<ProfileDocs />} />
                <Route path="/invoiceApproval/:id/:level" element={<InvoiceApproval />} /> 
                <Route path="/approvalForm/:id/:level" element={<WCFApproval />} /> 
                <Route path="/VendorApproval/:id" element={<VendorApproval />} />
                <Route path="/printPurchase" element={<PrintPurchase />} /> 
                <Route path="/resetPassword" element={<ResetPassword />} /> 
                <Route path="/adminLogin" element={<AdminLogin />} /> 
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/viewInvoice" element={<InvoiceDetails />} />
                <Route path="/ExcelReader" element={<ExcelReader />} />
                <Route path="/ExcelService" element={<ExcelService />} />
                <Route path="/vendorProfile" element={<VendorProfile />} />
                <Route path="/addEmployee" element={<AddEmployee />} />
                <Route path="/listEmployees" element={<EmployeeList />} />
                <Route path="/EmpLogin" element={<EmployeeLogin />} />
		        <Route path="*" element={Error} />
            </Routes>
        </Router>
    );
}

export default App;
