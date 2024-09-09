import React, {useEffect, useState, useRef} from 'react';
import '../assets/css/style.css'; 
import Logo from '../assets/img/logo/dashboard-logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileAlt, faTools, faBoxes, faUser, faUsers, faFileInvoice, faPuzzlePiece, faListCheck, faUserTie, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  useEffect(() => {
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
      <div className="nav-header">
        <a href="https://corpteamsolution.com/" target='_blank' className="brand-logo">
          <img src={Logo} width="150px" alt="Dashboard Logo" />
        </a>

        {/* <div className="navbar-toggler" onClick={() => setMenuShow(!MenuShow)}>
          <div className="hamburger">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
         
        </div> */}
      </div>
      <div className={`collapse navbar-collapse ${MenuShow ? 'show' : ''}`}></div>
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                
              </div>
             
              <ul className="navbar-nav header-right main-notification">
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="#" role="button">
                    <div className="header-info">
                      <span>{userDetails?.username}</span>
                      <small>{userDetails?.role}</small>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
     
      <div className={`deznav ${MenuShow ? "" : "hideNav"}`}>
      <>
          <div className="main-profile " style={{backgroundColor: "white"}}>
            {/* <a href="https://corpteamsolution.com/" className="brand-logo">
          <img src={CorpteamLogo} width="50px" alt="Dashboard Logo" />
        </a> */}
            <h5 className="name"><span className="font-w400">Hello,</span> {userDetails?.username}</h5>
            <p className="email">{userDetails?.email}</p>
          </div>
          <ul className="metismenu" id="menu" style={{backgroundColor: "white"}}>
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
            
{userDetails?.role === "admin" &&
          
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
            
                <FontAwesomeIcon icon={faUsers} className="fontAwesomeIcons mt-1"/>
                <span className="nav-text" onClick={() => setEmpShow(!EmpShow)}>Employee</span>
              </a>
              {(EmpShow || (location?.pathname === '/addEmployee' || location?.pathname === '/listEmployees')) &&
              <ul aria-expanded="false">
                <li><a href="/addEmployee" className={`${location.pathname === '/addEmployee' ? 'activeNav text-white' : ''}`}>Add</a></li>
                <li><a href="/listEmployees" className={`${location.pathname === '/listEmployees' ? 'activeNav text-white' : ''}`}>List</a></li>
              </ul>
              }
            </li>
}

            {userDetails?.role === "admin" || userDetails?.role === "employee" ?
            <>

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

    </div>
  );
}

export default Navbar;

// import React, { useEffect, useState, useRef } from 'react';
// import '../assets/css/style.css'; 
// import Logo from '../assets/img/logo/dashboard-logo.png';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCog, faFileAlt, faTools, faBoxes, faUser, faUsers, faFileInvoice, faPuzzlePiece, faListCheck, faUserTie, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useLocation } from 'react-router-dom';

// function Navbar() {
//   const [menuShow, setMenuShow] = useState(false);
//   const [wcfShow, setWCFShow] = useState(false);
//   const [invoiceShow, setInvoiceShow] = useState(false);
//   const [vendorShow, setVendorShow] = useState(false);
//   const [empShow, setEmpShow] = useState(false);
//   const [userDetails, setUserDetails] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const details = localStorage.getItem('Details');
//     if (!details) {
//       navigate('/');
//     } else {
//       setUserDetails(JSON.parse(details));
//     }
//   }, [navigate]);

//   const handleSignOut = () => {
//     localStorage.removeItem('Details');
//     navigate('/');
//   };

//   const toggleMenu = () => {
//     setMenuShow(!menuShow);
//   };

//   return (
//     <div style={{ position: "sticky", top: "0", zIndex: "1000", flexShrink: "0" }}>
//       <div className="nav-header">
//         <a href="https://corpteamsolution.com/" target='_blank' className="brand-logo">
//           <img src={Logo} width="150px" alt="Dashboard Logo" />
//         </a>
//         <button className="navbar-toggler" type="button" onClick={toggleMenu}>
//           <FontAwesomeIcon icon={faBars} />
//         </button>
//       </div>

//       <div className={`collapse navbar-collapse ${menuShow ? 'show' : ''}`}>
//         <div className="header">
//           <div className="header-content">
//             <nav className="navbar navbar-expand">
//               <ul className="navbar-nav header-right">
//                 <li className="nav-item dropdown header-profile">
//                   <a className="nav-link" href="#" role="button">
//                     <div className="header-info">
//                       <span>{userDetails?.username}</span>
//                       <small>{userDetails?.role}</small>
//                     </div>
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>

//         <div className="deznav">
//           <div className="main-profile">
//             <h5 className="name"><span className="font-w400">Hello,</span> {userDetails?.username}</h5>
//             <p className="email">{userDetails?.email}</p>
//           </div>
//           <ul className="metismenu" id="menu">
//             <li>
//               {userDetails?.role === "admin" || userDetails?.role === "employee" ? (
//                 <a href="/adminDashboard" className={`ai-icon ${location.pathname === '/adminDashboard' ? 'activeNav text-white' : ''}`} aria-expanded="false">
//                   <FontAwesomeIcon icon={faCog} className={`fontAwesomeIcons mt-1 ${location.pathname === '/adminDashboard' ? 'text-white' : ''}`} />
//                   <span className="nav-text">Dashboard</span>
//                 </a>
//               ) : (
//                 <a href="/dashboard" className={`ai-icon ${location.pathname === '/dashboard' ? 'activeNav text-white' : ''}`} aria-expanded="false">
//                   <FontAwesomeIcon icon={faCog} className={`fontAwesomeIcons mt-1 ${location.pathname === '/dashboard' ? 'text-white' : ''}`} />
//                   <span className="nav-text">Service Partner</span>
//                 </a>
//               )}
//             </li>

//             {userDetails?.role === "admin" && (
//               <li>
//                 <a className="has-arrow ai-icon" href="javascript:void(0);" aria-expanded="false">
//                   <FontAwesomeIcon icon={faUsers} className="fontAwesomeIcons mt-1" />
//                   <span className="nav-text" onClick={() => setEmpShow(!empShow)}>Employee</span>
//                 </a>
//                 {(empShow || location.pathname === '/addEmployee' || location.pathname === '/listEmployees') && (
//                   <ul aria-expanded="false">
//                     <li><a href="/addEmployee" className={`${location.pathname === '/addEmployee' ? 'activeNav text-white' : ''}`}>Add</a></li>
//                     <li><a href="/listEmployees" className={`${location.pathname === '/listEmployees' ? 'activeNav text-white' : ''}`}>List</a></li>
//                   </ul>
//                 )}
//               </li>
//             )}

//             {/* More menu items here... */}
//             <li>
//               <a href="/profile" className={`ai-icon ${location.pathname === '/profile' ? 'activeNav text-white' : ''}`} aria-expanded="false">
//                 <FontAwesomeIcon icon={faUserTie} className={`fontAwesomeIcons mt-1 ${location.pathname === '/profile' ? 'text-white' : ''}`} />
//                 <span className="nav-text">Profile</span>
//               </a>
//             </li>
//             <li>
//               <a href="/" className="ai-icon" aria-expanded="false" onClick={handleSignOut}>
//                 <FontAwesomeIcon icon={faSignOutAlt} className="fontAwesomeIcons mt-1" />
//                 <span className="nav-text">Logout</span>
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
