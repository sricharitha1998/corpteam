import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import '../assets/css/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Capitalized } from './functions/CaptaliseFunction';

export default () => {
  const [details, setDetails] = useState();

  useEffect(() => {
    async function fetchData() {
      const getDetails = localStorage.getItem('Details');
      setDetails(JSON.parse(getDetails));
    }
    fetchData();
  }, []);

  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="content-own">
        <article>
          <div className="card-own p-5">
            <div className="card-content-own">
              <FontAwesomeIcon icon={faUser} size="3x" />
              <p><b>Username : </b> {Capitalized(details?.username)}</p>
              <p><b>Role : </b> {Capitalized(details?.role)}</p>
              <p><b>Email : </b> {Capitalized(details?.email)}</p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};
