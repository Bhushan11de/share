import React from 'react';
import Signin from '../components/signin'; // Adjust the path as necessary
import MainPage from '../components/main-page';
const SigninPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <MainPage/>
      <Signin />
    </div>
  );
};

export default SigninPage;