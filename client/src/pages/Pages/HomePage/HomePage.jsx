import React from "react";
import Banner from "./Banner";
import "../../Assets/css/home.css";
import Lists from "./Lists";
import AllMember from "./AllMember";
import DummyData from "./DummyData";
const HomePage = ({ user }) => {
  return (
    <div className="home-top" style={{ paddingTop: "4rem" }}>
      {user.userType == "user" ? (
        <>
          <div className="home-inner-top">
            <Banner user={user} />
            <DummyData />
            <Lists user={user} />
          </div>
        </>
      ) : (
        <>
          <div className="home-inner-top">
            <Banner user={user} />
            <DummyData />
            <AllMember user={user} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
