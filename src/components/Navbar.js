
import React, {useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Nav, Navbar, Dropdown, Container } from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default () => {

  const [userDetails, setUserDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    const details = localStorage.getItem('Details');
    if (!details) {
        navigate('/');
    } else {
        setUserDetails(JSON.parse(details));
    }
}, []);

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('Details');
    navigate('/');
};
  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            
          </div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item} onMouseEnter={() => setShowDropdown(true)} show={showDropdown}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  {/* <Image src={Profile3} className="user-avatar md-avatar rounded-circle" /> */}
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <FontAwesomeIcon icon={faUserCircle} className="me-2" style={{ fontSize: '25px' }}/>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2" onMouseLeave={() => setShowDropdown(false)}>
                <Dropdown.Item className="fw-bold" >
                  {userDetails?.username}
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold" onClick={() => navigate('/profile')} >
                   Profile Changes
                </Dropdown.Item>
                <Dropdown.Divider />

                <Dropdown.Item className="fw-bold" onClick={handleSignOut}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
