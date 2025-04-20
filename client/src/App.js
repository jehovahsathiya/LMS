import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import HomePage from "./pages/Pages/HomePage/HomePage"
import SignIn from "./pages/LoginSingup/SignIn.jsx";
import SignUp from "./pages/LoginSingup/SignUp.jsx";
import Profile from "./pages/Pages/Profile/Profile";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./pages/Components/Navbar";
import LandingPage from "./pages/Pages/LandingPage";
import Cart from "./pages/Pages/Cart/Cart";
import EditProfile from "./pages/Pages/Profile/EditProfile"
import Borrower from "./pages/Pages/Cart/Borrower";
import BookManagement from "./pages/Pages/bookmanagement/bookmanagement.jsx";
import Dashboard from "./pages/Pages/Cart/Dashboard/dashboard.jsx";
import UserManagement from "./pages/Pages/userManagement/usermanagement.jsx";
import Chatbot from "./pages/chatbot.js/chat.jsx";
import DigitalLibrary from "./pages/digitallibrary/digitallibrary.jsx";
import BookPDFSearch from "./pages/digitallibrary/searchookspdf.jsx";
import MyBorrowedBooks from "./pages/Pages/myBorrowed/myborrowedlist.jsx";
import OverduePage from "./pages/Pages/overdueBooks/overDueBooks.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/logedinuser/`, { withCredentials: true });
      console.log(data.user);
      localStorage.setItem("user", JSON.stringify(data.user))

      setUser(data.user);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Router>
        {user && <Navbar user={user} />}
        {!isLoading && (
          <Routes>
            <Route
              exact
              path="/"
              element={user ? <Navigate to="/home" /> : <LandingPage />}
            />
            <Route
              exact
              path="/home"
              element={user ? <HomePage user={user} /> : <SignIn />}
            />
            <Route
              exact
              path="/signup"
              element={user ? <Navigate to="/home" /> : <SignUp />}
            />
            <Route
              exact
              path="/signin"
              element={user ? <Navigate to="/home" /> : <SignIn />}
            />
            <Route
              exact
              path="/cart"
              element={user ? <Cart user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/edit/:id"
              element={user ? <EditProfile user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/borrower"
              element={user ? <Borrower user={user} /> : <Navigate to="/home" />}
            />
             <Route
              exact
              path="/MyBorrowedBooks"
              element={user ? <MyBorrowedBooks /> : <Navigate to="/home" />}
            />

            <Route
              exact
              path="/bookManagement"
              element={user ? <BookManagement /> : <Navigate to="/home" />}
            />

<Route
              exact
              path="/overdueBooks"
              element={user ? <OverduePage user={user} /> : <Navigate to="/home" />}
            />




            <Route
              exact
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/home" />}
            />

            <Route
              exact
              path="/usermanagement"
              element={user ? <UserManagement /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/digital-library"
              element={<DigitalLibrary />}
            />

            <Route
              exact
              path="/BookPDFSearch"
              element={<BookPDFSearch />}
            />
          </Routes>
        )}
      </Router>
      <Chatbot />
    </>
  );
}

export default App;
