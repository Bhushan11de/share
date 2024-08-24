import React from "react";
import SignupNext from "../components/signupnextcomponent/signupnext";
import MainPage from "../components/mainpagecomponent/main-page";
const SignupPage = () => {
  return (
    <div style={{ display: "flex" }}>
      <MainPage />
      <SignupNext />
    </div>
  );
};

export default SignupPage;
