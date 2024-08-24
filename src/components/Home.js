import React from 'react';
import '../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import dashboardLogo from '../assets/img/logo/dashboard-logo.png';
import employeeIcon from '../assets/img/icons/employee.png';
import serviceProviderIcon from '../assets/img/icons/service-provider.png';

const Home = () => {
  return (
    <div className="authincation h-100">
    <div className='row col-xl-12 mt-3'>
    <div className='col-xl-10'></div>
                <div className='col-xl-2'>
                <a href="/adminLogin" className='btn btnColor text-white'>Admin Login</a>
                </div>
    </div>
      <div className="container h-100" style={{marginTop: "8%"}}>
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12 boxCSSShadow">
                
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <a href="https://corpteamsolution.com/" className="brand-logo">
                        <img src={dashboardLogo} width="200px" alt="Dashboard Logo" />
                      </a>
                    </div>
                    <h4 className="text-center mb-4 pt-3">
                      Welcome to CorpTeam Solutions Partner Management System
                    </h4>
                    <div className="row pt-sm-4 pt-3 align-items-center">
                      <div className="col-sm-6 mb-sm-0 mb-3">
                        <a href="#" className="btn d-block btn-lg" style={{backgroundColor:"#004377", color: "white", }}>
                          <img src={employeeIcon} width="30px" alt="Employee Icon"/>
                          &nbsp;&nbsp;Employee
                        </a>
                      </div>
                      <div className="col-sm-6">
                        <a href="/login" className="btn d-block btn-lg" style={{backgroundColor:"#004377", color: "white"}}>
                          <img src={serviceProviderIcon} width="35px" alt="Service Provider Icon" />
                          &nbsp;Service Partner
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
