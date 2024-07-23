import React, { useEffect, useState } from "react";
import { faBook, faChartLine, faTasks } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from '@themesberg/react-bootstrap';
import { CounterWidget } from "./Widgets";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import '../assets/css/dashboard.css';
import { Capitalized } from "./functions/CaptaliseFunction";

export default () => {
  const [details, setDetails] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const getDetails = localStorage.getItem('Details');
      setDetails(JSON.parse(getDetails))
    }
    fetchData()
  }, [])
  
  return (
    <>
      <Sidebar />
      <main className="content">
        <Navbar />
        <article>
          <p className="text-dark"><b>Username:</b> {Capitalized(details?.username)}</p>
          <p className="text-dark"><b>Role:</b> {Capitalized(details?.role)}</p>
          <p className="text-dark"><b>Email:</b> {Capitalized(details?.email)}</p>
          <Row className="justify-content-md-center">
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Work Completed"
                icon={faTasks}
                title="120"
              />
            </Col>
            <Col xs={12} sm={6} xl={4} className="pointerCss mb-4" onClick={() => navigate('/invoiceList')}>
              <CounterWidget
                category="Invoice"
                icon={faChartLine}
                title="500"
              />
            </Col>
            <Col xs={12} sm={6} xl={4} className="mb-4">
              <CounterWidget
                category="Inventory"
                title="200"
                period="Feb 1 - Apr 1"
                percentage={28.4}
                icon={faBook}
                iconColor="shape-tertiary"
              />
            </Col>
          </Row>
        </article>
      </main>
    </>
  );
};
