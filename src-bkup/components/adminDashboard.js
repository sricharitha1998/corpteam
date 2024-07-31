import React, {useEffect, useState} from 'react';
import '../assets/css/style.css'; 
import Logo from '../assets/img/logo/dashboard-logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileAlt, faUser, faFileInvoice, faPuzzlePiece, faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Footer from './footer';


function AdminDashboard() {
  useEffect(() => {
    // Assuming your custom.js defines a function called initializeCustom
    if (window.initializeCustom) {
      window.initializeCustom();
    }
  }, []);

  return (
    <div fontSetting>

      <Navbar />
      
      <div className="content-body">
        <div className="container-fluid">
          {/* <div className="form-head mb-sm-5 mb-3 d-flex flex-wrap align-items-center"> */}
            <h2 className="font-w600 title mb-2 me-auto">Dashboard</h2>
          </div>
          <div className="row">
            
                <div className="col-md-4 ">
                  <div className="widget-stat card bg-color">
                    <div className="card-body p-4" style={{height: "166px"}}>
                      <div className="media">
                        <span className="me-3">
                          <i className="fa fa-briefcase" aria-hidden="true"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Work Completed</p>
                          <h4 className="text-white">120</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="widget-stat card bg-info1">
                    <div className="card-body p-4" style={{height: "166px"}}>
                      <div className="media">
                        <span className="me-3">
                        <FontAwesomeIcon icon={faFileInvoice} className="fontAwesomeIcons mt-1"/>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Invoice</p>
                          <h4 className="text-white">76</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="widget-stat card bg-color">
                    <div className="card-body p-4">
                      <div className="media">
                        <span className="me-3">
                          <i className="fas fa-warehouse"></i>
                        </span>
                        <div className="media-body text-white">
                          <p className="mb-1">Inventory</p>
                          <h4 className="text-white">3280</h4>
                          <div className="progress mb-2 bg-secondary">
                            <div className="progress-bar progress-animated bg-light" style={{ width: '80%' }}></div>
                          </div>
                          <small>80% Increase in 20 Days</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          {/* </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
