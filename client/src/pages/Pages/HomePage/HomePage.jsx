import React from "react";
// import Banner from "./Banner";
import "../../Assets/css/home.css";
// import Lists from "./Lists";
// import AllMember from "./AllMember";
import DummyData from "./DummyData";
const HomePage = ({ user }) => {
  return (
    <div >
      {user.userType == "user" ? (
        <>
          <div >
          <DummyData/>
          </div>
        </>
      ) : (
        <>
          <div >
          <DummyData/>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
