import React, {useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/style.css'; // Assuming you have a main CSS file similar to style.css
import Logo from '../assets/img/logo/dashboard-logo.png';

const ResetPassword = () => {
    const [Password, setPassword] = useState();
    const [ConfirmPassword, setConfirmPassword] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    
    const ChangePassword = async (event) => {
      event.preventDefault();
      if(ConfirmPassword == Password){
          const response = await fetch(' https://93.127.185.34:4000/users/changePassword', {
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
                      <h4 className="text-center mb-4">Reset Password</h4>
                      <form action="index.html">
                        <div className="form-group">
                          <label>
                            <strong>New Password</strong>
                          </label>
                          <input
                            required className="form-control" type="password" name="password" onChange={e => setPassword(e.target.value)} placeholder="Password"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <strong>Confirm Password</strong>
                          </label>
                          <input
                            required type="password" className="form-control"name="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password"
                          />
                        </div>
                        <div className="text-center">
                          <button type="submit" onClick={ChangePassword} className="btn btn-block text-white btnColor">
                            Reset Password
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
      
    </div>
  );
}

export default ResetPassword;
