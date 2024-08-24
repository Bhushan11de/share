import React from "react";
import Signin from "../components/signincomponent/signin"; // Adjust the path as necessary
import MainPage from "../components/mainpagecomponent/main-page";
const SigninPage = () => {
  return (
    <div style={{ display: "flex" }}>
      <MainPage />
      <Signin />
    </div>
  );
};

export default SigninPage;
