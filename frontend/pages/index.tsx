import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Stock Market App</h1>
      <Link href="/signup">
        <button>Go to Signup</button>
      </Link>
      <Link href="/signin">
        <button>Go to Signin</button>
      </Link>
      <Link href="/signupnext">
        <button>Go to Signup Next</button>
      </Link>
    </div>
  );
};

export default Home;