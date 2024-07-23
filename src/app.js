import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Signin';
import Register from './components/Signup';
import WCForm from './components/wcform';
import Forms from './pages/components/Forms';
import { WCFTable } from './components/wcfTable';
import { ViewWCF } from './components/viewDetails';
import { ApprovalTable } from './components/approvalForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import InvoiceForm from './components/invoiceForm';
import Profile from './components/Profile';
import Dashboard from './components/dashboard';
import InvoiceApproval from './components/invoiceApproval';
import { InvoiceList } from './components/invoiceList';
import { ViewInvoice } from './components/viewInvoice';
import AdminLogin from './components/adminLogin';
import AddVendor from './components/addVendor';
import AdminDashboard from './components/adminDashboard';
import { WorkOrder } from './components/workOrder';
import { PurchaseOrder } from './components/purchaseOrder';
import { VendorsList } from './components/listVendors';
import UpdateVendor from './components/updateVendor';
import SignupBackup from './components/signup-backup';
import { PrintPurchaseOrder } from './components/printPurchaseOrder';
import ProfileNew from './components/profile-new';
import ProfileUpdateDashboard from './components/ProfileUpdateDashboard';
import VendorApproval from './components/VendorApproval';

function App() {
    return ( 
        <Router>
          <Routes>
                <Route path="/" element={<Home />} />  
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/wcform" element={<WCForm />} />
                <Route path="/Forms" element={<Forms />} />
                <Route path="/wcfTables" element={<WCFTable />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/approvalForm/:id/:level" element={<ApprovalTable />} />
                <Route path="/invoiceApproval/:id/:level" element={<InvoiceApproval />} />
                <Route path="/VendorApproval/:id" element={<VendorApproval />} />
                <Route path="/invoice" element={<InvoiceForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/viewWCF" element={<ViewWCF />} />  
                <Route path="/viewInvoice" element={<ViewInvoice />} /> 
                <Route path="/invoiceList" element={<InvoiceList />} /> 
                <Route path="/addVendor" element={<AddVendor />} /> 
                <Route path="/adminDashboard" element={<AdminDashboard />} /> 
                <Route path="/workOrder" element={<WorkOrder />} /> 
                <Route path="/purchaseOrder" element={<PurchaseOrder />} /> 
                <Route path="/vendorsList" element={<VendorsList />} /> 
                <Route path="/updateVendor" element={<UpdateVendor />} /> 
                <Route path="/signupBackup" element={<SignupBackup />} /> 
                <Route path="/printPurchase" element={<PrintPurchaseOrder />} /> 
                <Route path="/profileNew" element={<ProfileNew />} /> 
                <Route path="/ProfileUpdateDashboard" element={<ProfileUpdateDashboard />} /> 
            </Routes>
        </Router>
    );
}

export default App;