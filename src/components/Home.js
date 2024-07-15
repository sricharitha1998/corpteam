import React from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/css/dashboard.css';
import logo from '../assets/img/corpteam.jpg';

function Dashboard() {

    const navigate = useNavigate();

    return (
        <div className='bg-white' style={{ height: "100vh" }}>
        <div className='getRow row col-md-12 centered-container'>
            <div className="col-md-12 text-center">
                <img src={logo} alt="logo" style={{ width: "25%", height: "8%" }} />
            </div>
            <p className='text-center'>Welcome to CorpTeam Solutions Partner Management System. </p>
            <div className="pointerCss col-md-4 text-center" onClick={() => navigate("/login", { state: { role: "employee" } })}>
                <h6 className='dashboard'>Employee</h6></div>
            <div className="pointerCss col-md-4 text-center" onClick={() => navigate("/login", { state: { role: "vendor" } })}><h6 className='dashboard'>Service Partner</h6></div>
        </div>
        </div>
    );
}

export default Dashboard;
