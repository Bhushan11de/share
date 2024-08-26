import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";

const Home: React.FC = () => {
  useAuthRedirect();

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Home;
