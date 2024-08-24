import React from "react";
import Signup from "../components/signincomponent/signup"; // Adjust the path as necessary
import MainPage from "../components/mainpagecomponent/main-page";
const SignupPage = () => {
  return (
    <div style={{ display: "flex" }}>
      <MainPage />
      <Signup />
    </div>
  );
};

export default SignupPage;
