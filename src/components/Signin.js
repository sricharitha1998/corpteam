import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUnlockAlt, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Routes } from "../routes";
import corpteamLogo from "../assets/img/corpteam-trnspt.png"; 
import Register from "../assets/img/register.jpg"; 
import '../assets/css/dashboard.css'

export default () => {

  const [VendorDetails, setVendorDetails] = useState()
    const [InputDetails, setInputDetails] = useState({
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const provInfo = async () => {
      setInputDetails({
        ...InputDetails,
        role: location?.state?.role
      })
      
    }

    provInfo();
  }, [])

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
    if (validateEmail(InputDetails.email) && InputDetails?.password) {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*"
        },
        body: JSON.stringify(InputDetails)
      });

      if (response?.status === 200) {
        const data = await response.json();
        if(data){
        const userInfo = await fetch(`http://localhost:4000/vendor/getDetails/${data?.details?._id}`);
            const res = await userInfo.json();
            
        const allApproved = res?.details?.approvals && res?.details?.approvals.every(approval => approval.status === "Approved");
        console.log("InputDetails", data.details.ProfileStatus === "1",allApproved )
       
        console.log("data", data)
        localStorage.setItem('Details', JSON.stringify(data.details));

        if(data.details.ProfileStatus === "1" && res?.details?.approvals.length > 0  && allApproved){
          navigate('/dashboard')
        }else{
          navigate('/ProfileUpdateDashboard')
        }

        // if (InputDetails.role === 'admin') {
        //   navigate('/adminDashboard')
        // } else if (InputDetails.role === 'vendor' && (res?.details?.approvals.length > 0 || allApproved === false)) {
        //   navigate('/ProfileUpdateDashboard')
        // } else {
        //   if(data.details.ProfileStatus === "1"){
        //     navigate('/dashboard')
        //   }
          
        // }
      } else {
        alert("Enter correct credentials")
      }
    } else {
      alert("Please enter a valid email and fill all fields")
    }
  }
  }

  return (
    <main>
      <section className="d-flex align-items-center my-4">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100"> 
              {/* fmxw-500 */}
              <div className='row'>
              
                <div className='col-md-7'>
                  <img src={Register} className="w-100" style={{maxHeight: "550px"}} alt="logo" />
                </div>
                <div className='col-md-5'>
                
                <div className="text-center text-md-center mb-4 mt-md-0">
                
                <img src={corpteamLogo} width="180" height="80" alt="logo" />
                  <h5 className="mt-3">Sign In</h5>
                  <p>Please Enter Your User Credentials</p>
                </div>
                
                <Form className="mt-2">
                  <Form.Group id="email" className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required name="email" onChange={LoginInput} type="email" placeholder="example@company.com" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-2">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required name="password" type="password" onChange={LoginInput} placeholder="Password" />
                      </InputGroup>
                    </Form.Group>
                    <div className='row col-md-12'>
                      <div className='col-md-7'>
                      <p className="mb-3"><FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={() => navigate('/')} /><span className="mx-2">Back</span></p>
                      </div>
                      <div className='col-md-5'>
                        <div className="d-flex justify-content-between align-items-center mb-3" style={{ float: "right" }}>
                          <Card.Link className="small text-end" onClick={() => navigate("/forgotPassword")} >Forgot Password?</Card.Link>
                        </div>
                      </div>
                    </div>

                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={Login} className="w-100">
                    Sign In
                  </Button>
                </Form>

                <div className="mx-2 text-center">
                  <span className="fw-normal mt-1">or</span>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <span className="fw-normal">
                    Not Registered?
                    <Card.Link to={Routes.Signup.path} onClick={() => navigate('/register')} className="fw-bold">
                      {` Create Account `}
                    </Card.Link>
                  </span>
                </div>
                </div>
              </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
