import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";

const Home: React.FC = () => {
  useAuthRedirect();

  const styles: React.CSSProperties = {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  };

  return (
    <div style={styles}>
      <p>Loading...</p>
    </div>
  );
};

export default Home;
