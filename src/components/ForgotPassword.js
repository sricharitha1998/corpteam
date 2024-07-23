
import React, {useState} from "react";
import { Col, Row, Form, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";
import corpteamLogo from "../assets/img/corpteam-trnspt.png"; 
import '../assets/css/dashboard.css'

export default () => {

  const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [getModal, setModal] = useState(false);
    const [originalOTP, setOriginalOTP] = useState();
    const [OTP, setOTP] = useState();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const SendOTP = async (event) => {
        event.preventDefault();
        if (validateEmail(email)) {
            const response = await fetch('http://localhost:4000/users/sendOTP', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                body: JSON.stringify({ email: email }),

            });
            const data = await response.json();
            console.log("data", data)
            if (data.status === 200) {
                setOriginalOTP(data.OTP)
                setModal(true)
            }else{
                alert(data.msg)
            }

        } else {
            alert("Please enter a valid email and fill all fields")
        }
    }

    const handleSubmit = () => {
      if (OTP == originalOTP) {
          alert("OTP Verified")
          setModal(false)
          navigate("/resetPassword", {state: { email: email }});
      } else {
          alert("Invalid OTP")
      } 
  }

  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <img src={corpteamLogo} className="logoCss" alt="logo" />
              <p className="my-2"><FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={() => navigate('/login')} /><span className="mx-2">Back</span></p>
              <h3>Forgot Your Password?</h3>
                <p className="mb-4">Enter your email and we'll send you a OTP to reset your password</p>
                <Form>
                  <div className="mb-4">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <InputGroup id="email">
                      <Form.Control required autoFocus onChange={e => setEmail(e.target.value)} name="email" type="email" placeholder="john@company.com" />
                    </InputGroup>
                  </div>
                  <Button variant="primary" type="submit" className="w-100" onClick={SendOTP}>
                    Recover Password
                  </Button>
                </Form>
                
              </div>
            </Col>
          </Row>
        </Container>
        <Modal
                isOpen={getModal}
                onRequestClose={() => setModal(false)}
                style={{
                    content: {
                        width: '500px',
                        margin: 'auto',
                        height: 'fit-content',
                        padding: '20px',
                    }
                }}
            >
                <h5 className='text-center'>OTP Verification</h5>
                <br />
                <form>
                    <div className="row col-md-12">
                        <div className="col-md-12">
                            <div>
                                <label>Enter OTP</label>
                                <input
                                    className='inputFiled form-control my-3'
                                    type="number"
                                    name="otp"
                                    onChange={e => setOTP(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={handleSubmit} className="btn btn-primary m-2">Submit</button>
                    <button type="button" onClick={() => setModal(false)} className="btn btn-secondary">Close</button>
                </form>
            </Modal>
      </section>
    </main>
  );
};
