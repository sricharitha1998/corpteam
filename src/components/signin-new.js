import React, { useEffect, useState } from 'react';
import '../assets/css/globals.css';
import '../assets/css/new-signin.css';
import pic1 from '../assets/img/new/vector.svg'
import pic2 from '../assets/img/new/google-logo-1.png'
import pic3 from '../assets/img/new/vector-1.svg'
import pic4 from '../assets/img/new/cts-logo-removebg-preview-2.png'
import pic5 from '../assets/img/new/back.png'

export default () => {

  return (
    <div class="vendor-login">
    <div class="overlap-wrapper">
      <div class="overlap">
        <div class="overlap-group">
          <div class="text-wrapper">OR</div>
          <div class="div">WELCOME!</div>
          <div class="text-wrapper-2">Company Email</div>
          <div class="text-wrapper-3">Password</div>
          <div class="text-wrapper-4">Forgot Password?</div>
          <div class="overlap-2">
            <div class="text-wrapper-5">Password</div>
            <img class="vector" src={pic1}/>
          </div>
          <div class="overlap-3">
            <img class="google-logo" src={pic2} />
            <div class="text-wrapper-6">Sign in with Google</div>
          </div>
          <p class="p">Sign in to your Account</p>
          <p class="don-t-have-an">
            <span class="span">Don’t have an Account ? </span> <span class="text-wrapper-7">Sign Up</span>
          </p>
          <div class="group">
            <div class="overlap-group-2">
              <img class="img" src={pic3} />
              <div class="text-wrapper-8">example@company.com</div>
            </div>
          </div>
          <img class="cts-logo-removebg" src={pic4} />
          <div class="sign-in-button"><div class="text-wrapper-9">SIGN IN</div></div>
        </div>
        <div class="overlap-group-wrapper">
          <div class="overlap-4">
            <img class="back" src={pic5} />
            <div class="text-wrapper-10">Back</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
