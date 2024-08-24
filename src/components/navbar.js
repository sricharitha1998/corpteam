import React, {useEffect, useState, useRef} from 'react';
import '../assets/css/style.css'; 
import Logo from '../assets/img/logo/dashboard-logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileAlt, faTools, faBoxes, faUser, faFileInvoice, faPuzzlePiece, faListCheck, faUserTie, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
// import '../assets/css/dropDown.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';


function Navbar() {
  useEffect(() => {
    // Assuming your custom.js defines a function called initializeCustom
    if (window.initializeCustom) {
      window.initializeCustom();
    }
  }, []);

  const [ wcfShow, setWCFShow ] = useState(false);
  const [ InvoiceShow, setInvoiceShow ] = useState(false);
  const [ MenuShow, setMenuShow ] = useState(true);
  const [ vendorShow, setVenodrShow ] = useState(false);
  const [ EmpShow, setEmpShow ] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const details = localStorage.getItem('Details');
    if (!details) {
        navigate('/');
    } else {
        setUserDetails(JSON.parse(details));
    }
}, []);

  
  const handleSignOut = () => {
    localStorage.removeItem('Details');
    navigate('/');
};

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
console.log("location.pathname", location.pathname)
  useEffect(() => {
    const closeMenuOnClickOutside = (e) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        menuRef.current.open = false;
      }
    };

    document.addEventListener("click", closeMenuOnClickOutside);

    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, []);

  return (
    <div fontSetting style={{position: "sticky", top: "0", zIndex: "1000", flexShrink: "0"}}>

      {/* <div id="main-wrapper" className="show menu-toggle"> */}
      <div className="nav-header">
        <a href="https://corpteamsolution.com/" className="brand-logo">
          <img src={Logo} width="100px" alt="Dashboard Logo" />
        </a>
        {/* <div className="nav-control" onClick={() => setMenuShow(!MenuShow)}>
        {
          MenuShow ? 
          <div className="hamburger">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
          :
          <div class="hamburger is-active">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        }
         
        </div> */}
      </div>
      
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                
              </div>
              {/* <main>
      <details id="menu" ref={menuRef}>
        <summary id="menuButton" ref={buttonRef}>open</summary>
        <div className="menu">
          <ul className="menu-list">
            <li className="menu-list--item">
              <a href="#" className="menu-list--action">Action</a>
            </li>
            <li className="menu-list--item">
              <a href="#" className="menu-list--action">Another action</a>
            </li>
            <li className="menu-list--item">
              <a href="#" className="menu-list--action">Something else here</a>
            </li>
          </ul>
        </div>
      </details>
    </main> */}
              <ul className="navbar-nav header-right main-notification">
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="#" role="button">
                    <div className="header-info">
                      <span>{userDetails?.username}</span>
                      <small>{userDetails?.role}</small>
                    </div>
                  </a>
                  {/* <div className="dropdown-menu dropdown-menu-end">
                    <a href="ranjith-profile.html" className="dropdown-item ai-icon">
                      <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span className="ms-2">Profile </span>
                    </a>
                    <a href="email-inbox.html" className="dropdown-item ai-icon">
                      <svg id="icon-inbox" xmlns="http://www.w3.org/2000/svg" className="text-success" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      <span className="ms-2">Inbox </span>
                    </a>
                    <a href="page-login.html" className="dropdown-item ai-icon">
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" className="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      <span className="ms-2">Logout </span>
                    </a>
                  </div> */}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
     
      <div className="deznav">
        <>
          <div className="main-profile">
            <h5 className="name"><span className="font-w400">Hello,</span> {userDetails?.username}</h5>
            <p className="email">{userDetails?.email}</p>
          </div>
          <ul className="metismenu" id="menu">
            <li>
            {userDetails?.role === "admin" || userDetails?.role === "employee" ?
              
              <a href="/adminDashboard" className={`ai-icon ${location.pathname === '/adminDashboard' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faCog} className={`fontAwesomeIcons mt-1 ${location.pathname === '/adminDashboard' ? 'text-white' : '' }` }/>
                <span className="nav-text">Dashboard</span>
              </a>
              :
              <a href="/dashboard" className={`ai-icon ${location.pathname === '/dashboard' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faCog} className={`fontAwesomeIcons mt-1 ${location.pathname === '/dashboard' ? 'text-white' : '' }` }/>
                <span className="nav-text">Service Partner</span>
              </a>
            }
            </li>
            
            {userDetails?.role === "admin" || userDetails?.role === "employee" ?
            <>
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
            
                <FontAwesomeIcon icon={faUser} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text" onClick={() => setEmpShow(!EmpShow)}>Employee</span>
              </a>
              {(EmpShow || (location?.pathname === '/addEmployee' || location?.pathname === '/listEmployees')) &&
              <ul aria-expanded="false">
                <li><a href="/addEmployee" className={`${location.pathname === '/addEmployee' ? 'activeNav text-white' : ''}`}>Add</a></li>
                <li><a href="/listEmployees" className={`${location.pathname === '/listEmployees' ? 'activeNav text-white' : ''}`}>List</a></li>
              </ul>
              }
            </li>
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
            
                <FontAwesomeIcon icon={faUser} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text" onClick={() => setVenodrShow(!vendorShow)}>Service Partner</span>
              </a>
              {(vendorShow || (location?.pathname === '/addVendor' || location?.pathname === '/vendorList')) &&
              <ul aria-expanded="false">
                <li><a href="/addVendor" className={`${location.pathname === '/addVendor' ? 'activeNav text-white' : ''}`}>Add</a></li>
                <li><a href="/vendorList" className={`${location.pathname === '/vendorList' ? 'activeNav text-white' : ''}`}>List</a></li>
              </ul>
              }
            </li>
            <li>
              <a href="/ExcelService" className={`ai-icon ${location.pathname === '/ExcelService' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faTools} className={`fontAwesomeIcons mt-1 ${location.pathname === '/ExcelService' ? 'text-white' : '' }` }/>
                <span className="nav-text">Service Line Items</span>
              </a>
            </li>
            <li>
              <a href="/ExcelReader" className={`ai-icon ${location.pathname === '/ExcelReader' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faBoxes} className={`fontAwesomeIcons mt-1 ${location.pathname === '/ExcelReader' ? 'text-white' : '' }` }/>
                <span className="nav-text">Supply Line Items</span>
              </a>
            </li>
            <li>
              <a href="/purchaseOrder" className={`ai-icon ${location.pathname === '/purchaseOrder' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faPuzzlePiece} className={`fontAwesomeIcons mt-1 ${location.pathname === '/purchaseOrder' ? 'text-white' : '' }` }/>
                <span className="nav-text">Purchase Orders</span>
              </a>
            </li>
            <li>
              <a href="/workOrder" className={`ai-icon ${location.pathname === '/workOrder' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faListCheck} className={`fontAwesomeIcons mt-1 ${location.pathname === '/workOrder' ? 'text-white' : '' }` }/>
                <span className="nav-text">Partner Allocation Work</span>
              </a>
            </li>
            </>
            :
            <>
            <li>
              <a href="/workOrder" className={`ai-icon ${location.pathname === '/workOrder' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faListCheck} className={`fontAwesomeIcons mt-1 ${location.pathname === '/workOrder' ? 'text-white' : '' }` }/>
                <span className="nav-text">Work Orders</span>
              </a>
            </li>
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
            
                <FontAwesomeIcon icon={faFileAlt} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text" onClick={() => setWCFShow(!wcfShow)}>Work Closure Form </span>
              </a>
              { (wcfShow || (location?.pathname === '/wcform' || location?.pathname === '/wcfList')) &&
              <ul aria-expanded="false">
                <li><a href="/wcform" className={`${location.pathname === '/wcform' ? 'activeNav text-white' : ''}`}>Add</a></li>
                <li><a href="/wcfList" className={`${location.pathname === '/wcfList' ? 'activeNav text-white' : ''}`}>List</a></li>
              </ul>
              }
            </li>
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
              <FontAwesomeIcon icon={faFileInvoice} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text" onClick={() => setInvoiceShow(!InvoiceShow)}>Invoice Form  </span>
              </a>
              {(InvoiceShow || (location?.pathname === '/invoiceForm' || location?.pathname === '/invoiceList')) &&
              <ul aria-expanded="false">
                <li><a href="/invoiceForm" className={`${location.pathname === '/invoiceForm' ? 'activeNav text-white' : ''}`}>Add</a></li>
                <li><a href="/invoiceList" className={`${location.pathname === '/invoiceList' ? 'activeNav text-white' : ''}`}>List</a></li>
              </ul>
              }
            </li>
           
            </>
            }
            
            <li>
              <a href="/profile" className={`ai-icon ${location.pathname === '/profile' ? 'activeNav text-white' : ''}`} aria-expanded="false">
              <FontAwesomeIcon icon={faUserTie} className={`fontAwesomeIcons mt-1 ${location.pathname === '/profile' ? 'text-white' : '' }` }/>
                <span className="nav-text">Profile</span>
              </a>
            </li>
            <li>
              <a href="/" className="ai-icon" aria-expanded="false" onClick={handleSignOut}>
              <FontAwesomeIcon icon={faSignOutAlt} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text">Logout</span>
              </a>
            </li>
          </ul>
          <div className="copyright mb-0" style={{marginTop: "50%"}}>
            <p><strong>CorpTeam Admin Dashboard</strong> © <span className="current-year">2024</span> All Rights Reserved</p>
            <p className="fs-12">Made with <span className="heart"></span> by CorpTeam Solutions</p>
          </div>
        </>
      </div>
      
      
    {/* </div> */}
    </div>
  );
}

export default Navbar;
