import React from 'react';
import SignupNext from '../components/signupnext';
import MainPage from '../components/main-page';
const SignupPage = () => {
  return (
    <div style={{ display: 'flex' }}>
    <MainPage/>
      <SignupNext />
    </div>
  );
};

export default SignupPage;