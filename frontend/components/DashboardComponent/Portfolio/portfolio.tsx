import React, { useEffect, useState } from "react";
import { db } from "../../firebaseconfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
} from "chart.js";
import styles from "./portfolio.module.css";

// Register the necessary components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale
);

const Portfolio: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not signed in");
      }
    });
  }, []);

  const pieData = {
    labels: ["Stock A", "Stock B", "Stock C"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerLeft}>
        <div className={styles.companyInfo}>
          Welcome {userName ? userName + "," : "Loading..."}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.letcontainer}>
          <div className={styles.cont1}>
            <div className={styles.cont1div1}>
              <p className={styles.cont1div1para}>Total Asset Value</p>
              <div className={styles.cont1div1div1}>
                <p className={styles.cont1div3para}>Rs 40.21 Lakh</p>{" "}
              </div>
            </div>
            <div className={styles.cont1div2}>
              <p className={styles.cont1div2para}>Gain vs Yesterday</p>
              <div className={styles.cont1div2div1}>
                <p className={styles.cont1div4para}>+2.34% </p>
              </div>
            </div>
          </div>
          <div className={styles.cont2}>
            <p className={styles.cont2para}>Top Gainer/Looser</p>
            <div className={styles.cont2div1}>
              <div className={styles.cont2div1div1}>
                <div className={styles.cont2div1para}>
                  <p className={styles.cont2div1para1}>Gainers</p>
                </div>
                <div className={styles.gainercont}></div>
              </div>
              <div className={styles.cont2div1div2}>
                <div className={styles.cont2div2para}>
                  <p className={styles.cont2div2para1}>Looser</p>
                </div>
                <div className={styles.loosercont}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightcontainer}>
          <div className={styles.rightcontainerparadiv1}>
            <p className={styles.rightcontainerdiv1para}>Assets Distribution</p>
          </div>
          <div className={styles.piechart}>
            <Pie data={pieData} />
          </div>
          <div className={styles.buttondiv1}>
            <button className={styles.button3}>Open Full Details</button>
          </div>
        </div>
      </div>
      <div className={styles.buttondiv}>
        <button className={styles.button1}>Add new stock</button>
        <button className={styles.button2}>Sell stock</button>
      </div>
    </div>
  );
};

export default Portfolio;
