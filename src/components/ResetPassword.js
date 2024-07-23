
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockAlt, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import corpteamLogo from "../assets/img/corpteam-trnspt.png"; 
import '../assets/css/dashboard.css'

export default () => {

  const [Password, setPassword] = useState();
    const [ConfirmPassword, setConfirmPassword] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    
    const ChangePassword = async (event) => {
      event.preventDefault();
      if(ConfirmPassword == Password){
          const response = await fetch('http://localhost:4000/users/changePassword', {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json, text/plain, */*"
              },
              body: JSON.stringify({ email: location?.state?.email, password: Password }),
  
          });
          const data = await response.json();
          if (data) {
              alert("Password Changed")
              navigate("/login")
          }
      }else{
          alert("Password doesn't match")
      }
  }

  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <img src={corpteamLogo} className="logoCss" alt="logo" />
              <p className="my-2"><FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={() => navigate('/forgotPassword')} /><span className="mx-2">Back</span></p>
                <h3 className="mb-4">Reset Password</h3>
                <Form>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" name="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" name="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={ChangePassword} className="w-100">
                    Reset Password
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
