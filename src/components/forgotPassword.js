import React, {useState} from "react";
import '../assets/css/style.css'; // Assuming you have a main CSS file similar to style.css
import Logo from '../assets/img/logo/dashboard-logo.png';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [getModal, setModal] = useState(false);
    const [originalOTP, setOriginalOTP] = useState();
    const [OTP, setOTP] = useState();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const apiUrl = process.env.REACT_APP_API_URL;
    console.log("apiUrl", process.env.REACT_APP_API_URL)

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
    <div className="vh-100">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <div className="text-center mb-3">
                        <img
                          src={Logo}
                          width="150px"
                          alt="Logo"
                        />
                      </div>
                      <h4 className="text-center mb-4">Forgot Password</h4>
                      <form action="index.html">
                        <div className="form-group">
                          <label>
                            <strong>Email</strong>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            required autoFocus onChange={e => setEmail(e.target.value)} name="email"
                            placeholder="hello@example.com"
                          />
                        </div>
                        <div className="text-center">
                          <button type="submit" onClick={SendOTP} className="btn btn-block text-white btnColor">
                            SUBMIT
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    <button type="button" onClick={handleSubmit} className="btn btnColor text-white m-2">Submit</button>
                    <button type="button" onClick={() => setModal(false)} className="btn btn-secondary">Close</button>
                </form>
            </Modal>
    </div>
  );
}

export default ForgotPassword;
