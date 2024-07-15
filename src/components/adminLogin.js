
import React, { useState} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Routes } from "../routes";

export default () => {

  const [InputDetails, setInputDetails] = useState({
    email: "",
    password: "", role: "admin"
});
const navigate = useNavigate();
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

let name, value;
function LoginInput(event) {
  name = event.target.name;
  value = event.target.value;
  setInputDetails({
      ...InputDetails,
      [name]: value
  })
}

const Login = async (event) => {
  event.preventDefault();
  if (validateEmail(InputDetails.email) && InputDetails?.password){
  const response = await fetch('http://localhost:4000/users/login', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*"
          },
          body: JSON.stringify(InputDetails)

  });
  if(response?.status === 200){
      const data = await response.json();
      localStorage.setItem('Details', JSON.stringify(data.details));
          navigate('/adminDashboard')      
  }else{
      alert("Enter correct credentials")
  }
}else{
  alert("Please enter a valid email and fill all fields")
}
 }

  return (
    <main>
      <section className="d-flex align-items-center my-4">
        <Container>
          <Row className="justify-content-center form-bg-image"
          //  style={{ backgroundImage: `url(${BgImage})` }}
           >
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in</h3>
                  <p>Please Enter Your User Credentials</p>
                </div>
                <Form className="mt-4">
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required name="email" onChange={LoginInput} type="email" placeholder="example@company.com" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required name="password" type="password" onChange={LoginInput} placeholder="Password" />
                      </InputGroup>
                    </Form.Group>
                    <div className='row col-md-12'>
                      <div className='col-md-7'></div>
                      <div className='col-md-5'>
                      <div className="d-flex justify-content-between align-items-center mb-4" style={{float:"right"}}>
                      <Card.Link className="small text-end" onClick={() => navigate("/forgotPassword")} >Forgot password?</Card.Link>
                    </div>
                      </div>
                    </div>
                    
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={Login} className="w-100">
                    Sign in
                  </Button>
                </Form>

                <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or</span>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Not registered?
                    <Card.Link to={Routes.Signup.path} onClick={() => navigate('/register')} className="fw-bold">
                      {` Create account `}
                    </Card.Link> 
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
