import React, { useState, useEffect } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChartPie, faFileAlt, faSignOutAlt, faTimes, faUser, faPlus, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Routes } from "../routes";
import corpteamIcon from "../assets/img/corpteamIcon.png";
import corpteamLogo from "../assets/img/corpteam.png"; 
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const details = localStorage.getItem('Details');
    if (!details) {
        navigate('/');
    } else {
        setUserDetails(JSON.parse(details));
    }
  }, [navigate]);

  const onCollapse = () => setShow(!show);

  const isActive = (link) => pathname === link;

  const CollapsableNavItem = ({ eventKey, title, icon, children }) => {
    const isAnyChildActive = React.Children.toArray(children).some(child => {
      return React.isValidElement(child) && isActive(child.props.link);
    });
    const defaultKey = isAnyChildActive ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {React.Children.map(children, child => 
                React.cloneElement(child, { pathname })
              )}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = ({ title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" }) => {
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = isActive(link) ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon icon-span"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}
            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={corpteamIcon} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`} 
        // style={{backgroundColor: "#e58e00"}}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={ProfilePicture} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Hi, Jane</h6>
                  <Button as={Link} variant="secondary" size="xs" to={Routes.Signin.path} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>

            { userDetails?.role === "admin" ? 
            <Nav className="flex-column pt-3 pt-md-0">
            <img src={corpteamLogo} className="my-2" alt="logo"/>
              <NavItem title="Admin Dashboard" link={Routes.AdminDashboard.path} icon={faChartPie} /> 
              <CollapsableNavItem eventKey="work-closure-form/" title="Vendors" icon={faUser}>
                <NavItem title="Add" link={Routes.AddVendor.path} />
                <NavItem title="List" link={Routes.ListVendor.path} />
              </CollapsableNavItem>
              <NavItem title="Purchase Order" link={Routes.Purchase.path} icon={faCartPlus} />
              <NavItem title="Partner Allocation Work" link={Routes.WorkOrder.path} icon={faPlus} />
            </Nav>
            :
            <Nav className="flex-column pt-3 pt-md-0">
            <img src={corpteamLogo} className="my-2" alt="logo" />
              {/* <NavItem link={Routes.Home.path} icon={corpteamLogo} /> */}
              <NavItem title="Service Partner" link={Routes.DashboardOverview.path} icon={faChartPie} />              
              <NavItem title="Work Order" link={Routes.WorkOrder.path} icon={faPlus} />              
              <CollapsableNavItem eventKey="work-closure-form/" title="Work Closure Form" icon={faFileAlt}>
                <NavItem title="Add" link={Routes.WCForm.path} />
                <NavItem title="List" link={Routes.WCFList.path} />
              </CollapsableNavItem>
              <CollapsableNavItem eventKey="invoice-form/" title="Invoice Form" icon={faBook}>
                <NavItem title="Add" link={Routes.InvoiceForm.path} />
                <NavItem title="List" link={Routes.InvoiceList.path} />
              </CollapsableNavItem>
            </Nav>
            }
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
